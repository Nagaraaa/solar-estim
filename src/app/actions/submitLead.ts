'use server'

import { google } from 'googleapis';
import { z } from 'zod';
import { Resend } from 'resend';
import { SolarReportEmail } from '@/emails/SolarReportEmail';

const LeadSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").trim(),
    phone: z.string().min(10, "Le numéro de téléphone est invalide").trim(),
    email: z.string().email("L'adresse email est invalide").trim(),
    address: z.string().optional(),
});

export async function submitLead(formData: FormData, simulationResult: any, country: 'FR' | 'BE', token: string) {
    try {
        const rawData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
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

        console.log("📝 Saving to Sheets:", row);

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Leads!A2',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [row] },
        });

        // Email
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: 'SolarEstim <contact@solarestim.com>',
                to: [email],
                subject: `Votre étude solaire pour ${addressStr.split(',')[0]} ☀️`,
                react: SolarReportEmail({
                    name: name,
                    city: addressStr,
                    annualProduction: simulationResult.annualProduction || 0,
                    annualSavings: simulationResult.annualSavings || 0,
                    totalCostObserved: simulationResult.totalCost || 0
                }) as React.ReactElement,
            });
        }

        return { success: true };

    } catch (error: any) {
        console.error('❌ Global Submit Error:', error);
        return { success: false, error: error.message || 'Une erreur est survenue.' };
    }
}
