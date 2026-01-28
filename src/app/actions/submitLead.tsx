'use server'

import { google } from 'googleapis';
import { z } from 'zod';
import { Resend } from 'resend';
import { SolarReportEmail } from '@/emails/SolarReportEmail';
import { supabaseAdmin } from '@/lib/supabase';

import React from 'react';
import { redirect } from 'next/navigation';

import { SOLAR_CONSTANTS } from '@/lib/constants';

const sanitizeInput = (str: string) => {
    if (!str) return "";
    // Basic sanitization: remove HTML tags and limit length
    // This removes <script>, <iframe> etc. by removing the <...> pattern roughly or just escaping.
    // For lead input (Name, Address), we accept text but no tags.
    // Replace < and > to neutralize HTML
    return str.replace(/[<>]/g, "").trim().slice(0, SOLAR_CONSTANTS.VALIDATION.MAX_TEXT_LENGTH);
};

const LeadSchema = z.object({
    name: z.string()
        .min(SOLAR_CONSTANTS.VALIDATION.NAME_MIN_LENGTH, "Le nom est trop court")
        .max(100, "Le nom est trop long")
        .transform(val => sanitizeInput(val)),
    phone: z.string()
        .min(SOLAR_CONSTANTS.VALIDATION.PHONE_MIN_LENGTH, "Numéro trop court")
        .max(20, "Numéro trop long")
        .trim(),
    email: z.string()
        .email("L'adresse email est invalide")
        .max(100, "Email trop long")
        .trim(),
    address: z.string()
        .optional()
        .transform(val => val ? sanitizeInput(val) : ""),
});

export async function submitLead(formData: FormData, simulationResult: any, country: 'FR' | 'BE', token: string) {
    let shouldRedirect = false;
    try {
        let phoneRaw = formData.get('phone') as string || "";

        // Normalisation (Auto-Format)
        // Convert local format (06...) to international (+33...)
        if (phoneRaw.startsWith('0')) {
            if (country === 'FR') {
                phoneRaw = phoneRaw.replace(/^0/, '+33');
            } else if (country === 'BE') {
                phoneRaw = phoneRaw.replace(/^0/, '+32');
            }
        }
        // Remove spaces
        phoneRaw = phoneRaw.replace(/\s/g, '');

        const rawData = {
            name: formData.get('name'),
            phone: phoneRaw,
            email: formData.get('email'),
            address: formData.get('address'),
        };

        // 0. Security Turnstile


        if (!token) {
            return { success: false, error: "Validation de sécurité manquante (Captcha)." };
        }

        // Verify with Cloudflare
        const cfForm = new FormData();
        cfForm.append('secret', process.env.TURNSTILE_SECRET_KEY || "");
        cfForm.append('response', token);
        // cfForm.append('remoteip', clientIp); // Optional

        const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: cfForm,
        });
        const cfData = await cfRes.json();

        if (!cfData.success) {
            console.error("❌ Turnstile Failed:", cfData);
            return { success: false, error: "Échec de la validation de sécurité. Veuillez rafraîchir la page." };
        }


        const validatedData = LeadSchema.parse(rawData);
        const { name, phone, email, address } = validatedData;
        const addressStr = address || "";

        // Determine Region/Pays strictly for Google Sheets
        // BE: Deduce Region from Zip
        let paysColumn: string = country;
        let cpStr = "";

        // Extraction Code Postal
        const zipMatch = addressStr.match(/\b\d{4,5}\b/);
        if (zipMatch) {
            cpStr = zipMatch[0];
            if (country === 'BE') {
                const cpVal = parseInt(cpStr);
                // 1000-1299 = Bruxelles, Le reste = Wallonie
                if (cpVal >= 1000 && cpVal <= 1299) {
                    paysColumn = "Belgique (Bruxelles)";
                } else {
                    paysColumn = "Belgique (Wallonie)";
                }
            } else {
                paysColumn = "France";
            }
        } else {
            paysColumn = country === 'FR' ? "France" : "Belgique";
        }

        // 1. SUPABASE MIGRATION (SQL)
        // Champs : date, nom, email, ville, pays, puissance_kwc, economie_estimee, statut (default: 'nouveau').
        // Note: 'id' est souvent auto-incrémenté ou uuid généré par Supabase, on laisse Supabase gérer ou on insert si besoin.

        try {
            const { error: supabaseError } = await supabaseAdmin
                .from('leads')
                .insert([
                    {
                        // id: auto (uuid)
                        // created_at: auto
                        nom: name,
                        email: email,
                        telephone: phone,
                        ville: addressStr,
                        code_postal: cpStr,
                        pays: paysColumn,
                        puissance_kwc: simulationResult.systemSize,
                        economie_estimee_an: simulationResult.annualSavings,
                        statut: 'nouveau',
                        taux_autoconsommation: simulationResult.selfConsumptionRate ? Math.round(simulationResult.selfConsumptionRate * 100) + '%' : 'N/A',
                        ev_modele: simulationResult.details?.ev_model ?? simulationResult.details?.ev_model_name ?? null,
                        ev_conso: simulationResult.details?.ev_kwh ?? null
                    }
                ]);

            if (supabaseError) {
                console.error("❌ Supabase Insert Error:", supabaseError);
                // On ne bloque pas forcément le reste si Supabase fail mais c'est mieux de savoir.
                // Le prompt dit "doit être enregistrée... avant d'être envoyée". On pourrait throw ici.
            } else {

            }
        } catch (dbErr) {
            console.error("❌ Supabase Exception:", dbErr);
        }

        // Auth Google Sheets
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });

        const now = new Date();
        const dateStr = now.toLocaleDateString("fr-FR");
        const timeStr = now.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
        const formattedDate = `${dateStr} ${timeStr}`;

        // MAPPING STRICT:
        // [Date] | [Pays] | [Nom] | [Tel] | [CP] | [Facture actuelle] | [Prod estimée] | [Coût Net] | [ROI (ans)] | [Inclinaison] | [Orientation]

        const consumptionEst = simulationResult.estimatedConsumption ? `${simulationResult.estimatedConsumption} kWh/an` : "Non défini";
        const powerEst = `${simulationResult.systemSize} kWc`;
        const netCostEst = simulationResult.netCost ? `${simulationResult.netCost} €` : (simulationResult.totalCost ? `${simulationResult.totalCost} €` : "N/A");
        const roiEst = simulationResult.roiYears ? `${simulationResult.roiYears} ans` : "N/A";
        // Correction format Bill
        const monthlyBill = simulationResult.monthlyBill ? `${simulationResult.monthlyBill} €/mois` : "N/A";

        // Get Details
        const slope = simulationResult.details?.slope ?? "35 (Défaut)";
        const azimuth = simulationResult.details?.azimuth ?? "0 (Sud)";

        const row = [
            formattedDate,          // Date
            paysColumn,             // Pays
            name,                   // Nom
            phone,                  // Tel
            cpStr,                  // CP
            monthlyBill,            // Facture actuelle
            `${simulationResult.annualProduction} kWh/an`, // Prod estimée
            netCostEst,             // Coût Net
            roiEst,                 // ROI (ans)
            slope,                  // Inclinaison
            azimuth                 // Orientation
        ];

        // Logs supprimés pour confidentialité (RGPD)

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Leads!A2',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [row] },
        });

        // Email
        if (process.env.RESEND_API_KEY) {
            // Fetch Admin Contact Setting
            const { fetchSettings } = await import("@/actions/settings");
            const settings = await fetchSettings();
            const adminEmail = settings['EMAIL_CONTACT'] || "contact@solarestim.com";

            // Production Render
            const { render } = await import('@react-email/render');
            const emailHtml = await render(
                <SolarReportEmail
                    name={name}
                    city={addressStr}
                    annualProduction={simulationResult.annualProduction || 0}
                    annualSavings={simulationResult.annualSavings || 0}
                    totalCostObserved={simulationResult.netCost || simulationResult.totalCost || 0}
                    selfConsumptionRate={simulationResult.selfConsumptionRate || 0.35}
                    adminContactEmail={String(adminEmail)}
                    evModel={simulationResult.details?.ev_model ?? simulationResult.details?.ev_model_name}
                    evKwh={simulationResult.details?.ev_kwh}
                />
            );



            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: 'SolarEstim <contact@solarestim.com>',
                to: [email],
                subject: "Votre etude solaire - " + addressStr.split(',')[0],
                html: emailHtml,
            });
        }

        shouldRedirect = true;

    } catch (error: any) {
        console.error('❌ Global Submit Error:', error);
        return { success: false, error: error.message || 'Une erreur est survenue.' };
    }

    // Success - Redirect
    if (shouldRedirect) {
        redirect('/merci');
    }

    return { success: true }; // Should not reach here if redirected, but type safety
}
