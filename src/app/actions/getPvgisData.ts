'use server'

export async function getPvgisData(lat: number, lon: number, peakPower: number) {
    // 1. On loggue les entrées pour voir si un chiffre est NaN ou undefined
    console.log("🔍 [DEBUG INPUTS] Lat:", lat, "Lon:", lon, "Power:", peakPower);

    // 2. Construction de l'URL avec paramètres forcés (Pente 35, Sud 0)
    // Utilisation de peakPower par défaut à 3 si manquant
    const safePower = peakPower || 3;
    const url = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${lat}&lon=${lon}&peakpower=${safePower}&loss=14&angle=35&aspect=0&outputformat=json`;

    console.log("🚀 [DEBUG URL] Appel vers :", url);

    try {
        const res = await fetch(url, { cache: 'no-store' });

        // 3. Si l'API renvoie une erreur HTTP (ex: 400 Bad Request)
        if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ [API ERROR] Status:", res.status, "Body:", errorText);
            throw new Error(`PVGIS Error ${res.status}: ${errorText}`);
        }

        const data = await res.json();

        // 4. On vérifie si la structure JSON est celle attendue
        if (!data.outputs || !data.outputs.totals || !data.outputs.totals.fixed) {
            console.error("⚠️ [JSON INVALID] Reçu :", JSON.stringify(data, null, 2));
            throw new Error("Structure JSON invalide (pas de outputs.totals)");
        }

        const result = data.outputs.totals.fixed.E_y;
        console.log("✅ [SUCCESS] Production annuelle :", result);
        return result;

    } catch (error) {
        console.error("💥 [CRASH] Exception :", error);
        throw error;
    }
}
