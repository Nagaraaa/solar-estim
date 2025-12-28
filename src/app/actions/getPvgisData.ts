'use server'

export async function getPvgisData(lat: number, lon: number, peakPower: number, angle: number = 35, aspect: number = 0) {
    // 1. On vérifie les entrées pour le débogage (supprimé en prod)

    // 2. Construction de l'URL pour l'API PVGIS
    // Si la puissance (peakPower) est manquante, on met 3 kWc par défaut
    const safePower = peakPower || 3;
    const url = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${lat}&lon=${lon}&peakpower=${safePower}&loss=14&angle=${angle}&aspect=${aspect}&outputformat=json`;

    try {
        const res = await fetch(url, { cache: 'no-store' }); // On ne garde pas en cache pour avoir des données fraiches

        // 3. Gestion des erreurs de l'API (ex: Coordonnées hors zone)
        if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ [ERREUR API] Status:", res.status, "Body:", errorText);
            throw new Error(`Erreur PVGIS ${res.status}: ${errorText}`);
        }

        const data = await res.json();

        // 4. Vérification de la structure du fichier reçu
        // On s'assure que 'outputs.totals.fixed' existe bien
        if (!data.outputs || !data.outputs.totals || !data.outputs.totals.fixed) {
            console.error("⚠️ [JSON INVALIDE] Reçu :", JSON.stringify(data, null, 2));
            throw new Error("Structure JSON invalide (données manquantes)");
        }

        const result = data.outputs.totals.fixed.E_y; // E_y = Production annuelle estimée

        return result;

    } catch (error) {
        console.error("💥 [PLANTAGE] Exception :", error);
        throw error;
    }
}
