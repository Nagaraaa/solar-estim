'use server'

import { google } from 'googleapis';

import { z } from 'zod';

const LeadSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").trim(),
    phone: z.string().min(10, "Le numéro de téléphone est invalide").trim(),
    email: z.string().email("L'adresse email est invalide").trim(),
    address: z.string().optional(),
});

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
        const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
        // NOTE : simulationResult.details.lat/lon sont les coordonnées GPS.
        // On essaie d'extraire le Code Postal depuis l'adresse si possible, sinon on garde l'adresse complète.

        // On utilise l'adresse validée pour extraire le CP ou on met chaine vide
        const addressStr = address || "";
        // Extraction du code postal (regex simple pour 4 ou 5 chiffres)
        const cpMatch = addressStr.match(/\b\d{4,5}\b/);
        const postalCode = cpMatch ? cpMatch[0] : addressStr;

        // 3. Ordre Strict des Colonnes (A -> J)
        // C'est ici qu'on définit ce qui va dans chaque colonne du Google Sheet
        const row = [
            date,                           // A: Date de la demande
            name,                           // B: Nom du client
            phone,                          // C: Téléphone
            email,                          // D: Email
            postalCode,                     // E: Code Postal ou Adresse
            simulationResult.totalCost || 0,      // F: Facture estimée (Coût total)
            simulationResult.annualProduction || 0, // G: Production estimée
            simulationResult.annualSavings || 0,    // H: Gain (Économies annuelles)
            "NOUVEAU",                      // I: Statut dans le CRM
            country                         // J: Pays (FR ou BE)
        ];

        // 4. Insertion Robuste dans le fichier
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Leads!A2', // On commence à chercher une case vide à partir de A2
            valueInputOption: 'USER_ENTERED', // Traite les données comme si l'utilisateur tapait au clavier
            insertDataOption: 'INSERT_ROWS', // Force l'insertion d'une nouvelle ligne
            requestBody: {
                values: [row],
            },
        });

        return { success: true };

    } catch (error: any) {
        console.error('Google Sheets Error:', error);
        // RETURN REAL ERROR FOR DEBUGGING
        return { success: false, error: error.message || 'Une erreur est survenue lors de l\'enregistrement.' };
    }
}
