'use server'

import { google } from 'googleapis';

export async function submitLead(formData: FormData, simulationResult: any, country: 'FR' | 'BE') {
    try {
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;

        if (!name || !phone || !email) {
            throw new Error('Champs requis manquants');
        }

        // Authentication
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Prepare Data
        const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
        const cp = simulationResult.details.lon + "," + simulationResult?.details?.lat; // Simplified location or extract CP if available
        // Note: simulationResult.details.lat/lon are coordinates. 
        // Ideally we would want the postal code from the address, but we might pass the full address string if available or just coordinates.
        // Let's rely on what we have. If 'address' is passed in formData or result, use it.
        // The user prompt asked for: Date, Nom, Tel, Email, CP, Facture, Prod, Gain, Statut, Pays

        // We will pass 'address' in formData for better CP extraction if possible, or just use the full string.
        const address = formData.get('address') as string || "";
        // Extraction of CP from address string (simple regex for 4 or 5 digits)
        const cpMatch = address.match(/\b\d{4,5}\b/);
        const postalCode = cpMatch ? cpMatch[0] : address;

        // 3. Strict Column Ordering (A -> J)
        const row = [
            date,                           // A: Date
            name,                           // B: Nom
            phone,                          // C: Tel
            email,                          // D: Email
            postalCode,                     // E: CP
            simulationResult.totalCost || 0,      // F: Facture (Coût total)
            simulationResult.annualProduction || 0, // G: Prod
            simulationResult.annualSavings || 0,    // H: Gain
            "NOUVEAU",                      // I: Statut
            country                         // J: Pays
        ];

        // 4. Robust Insertion
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Leads!A2', // Start looking for empty space from A2
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS', // Force insertion
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
