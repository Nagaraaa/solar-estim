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

// Resend sera initialisé uniquement si la clé est présente
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitLead(formData: FormData, simulationResult: any, country: 'FR' | 'BE') {
    try {
        const rawData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
        };

        const validatedData = LeadSchema.parse(rawData);

        const { name, phone, email, address } = validatedData;
        const addressStr = address || "";

        // 1. Authentification Google Sheets
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                // Gestion des sauts de ligne dans la clé privée pour Vercel
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 2. Préparation des Données
        const now = new Date();
        const dateStr = now.toLocaleDateString("fr-FR"); // 17/12/2025
        const timeStr = now.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' }); // 15:30
        const formattedDate = `${dateStr} ${timeStr}`;

        // NOTE : On essaie d'extraire le Code Postal depuis l'adresse si possible, sinon on garde l'adresse complète.
        // On regarde aussi si "zipCode" est passé explicitement.
        const zipFromForm = formData.get('zipCode') as string;
        let finalZip = addressStr;

        if (zipFromForm) {
            finalZip = zipFromForm;
        } else {
            // Extraction du code postal (regex simple pour 4 ou 5 chiffres)
            const cpMatch = addressStr.match(/\b\d{4,5}\b/);
            finalZip = cpMatch ? cpMatch[0] : addressStr;
        }

        // 3. Ordre Strict des Colonnes (A -> J)
        // { Date, Nom, Téléphone, Email, "Code Postal", "Facture Elec", "Production (kWh)", "Gain Estimé (€)", Statut, Pays }
        const row = [
            formattedDate,                  // A: Date
            name,                           // B: Nom
            phone,                          // C: Téléphone
            email,                          // D: Email
            finalZip,                       // E: Code Postal
            simulationResult.totalCost || 0,        // F: Facture Elec (Attention: c'est souvent 'monthlyBill' * 12 ou similaire, ici on prend totalCost si c'est ce qui est demandé, ou monthlyBill ?) 
            // User prompt said "Facture Elec". Using passed simulation result totalCost for now, assuming it maps to bill context.
            // WARN: simulationResult.totalCost in dashboard was 'bill * 12'. 
            simulationResult.annualProduction || 0, // G: Production
            simulationResult.annualSavings || 0,    // H: Gain Estimé
            "NOUVEAU",                      // I: Statut
            country                         // J: Pays
        ];

        console.log("📝 Saving to Sheets:", row);

        // 4. Insertion Robuste dans le fichier
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Leads!A2',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [row],
            },
        });
        console.log("✅ Sheet Saved!");

        // 5. Envoi Email via Resend + React Email
        console.log("📧 Attempting to send email to:", email);
        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                const emailResult = await resend.emails.send({
                    from: 'SolarEstim <contact@solarestim.com>',
                    // to: [email], // PROD
                    // Pour le test, on peut vouloir l'envoyer à soi-même ou au client. The prompt says "au client".
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

                if (emailResult.error) {
                    console.error("❌ Resend API Error:", emailResult.error);
                } else {
                    console.log("✅ Email Sent! ID:", emailResult.data?.id);
                }

            } catch (emailError) {
                console.error("❌ Resend Exception:", emailError);
                // On ne bloque pas si l'email échoue
            }
        } else {
            console.warn("⚠️ No RESEND_API_KEY found.");
        }

        return { success: true };

    } catch (error: any) {
        console.error('❌ Global Submit Error:', error);
        return { success: false, error: error.message || 'Une erreur est survenue.' };
    }
}
