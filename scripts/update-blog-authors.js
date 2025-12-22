const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../src/content');
const authorData = {
    author: "Steve Herremans",
    authorBio: "Expert en énergie renouvelable et analyste du marché solaire depuis 2018.",
    authorImage: "/images/steve-herremans.jpg"
};

function updateFile(filePath) {
    if (!filePath.endsWith('.json')) return;

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);

        // Skip lexicon files unless specially requested, focusing on articles
        if (filePath.includes('lexicon')) return;

        // Add author data
        const updated = {
            ...json,
            ...authorData
        };

        fs.writeFileSync(filePath, JSON.stringify(updated, null, 4));
        console.log(`Updated: ${filePath}`);
    } catch (e) {
        console.error(`Error updating ${filePath}:`, e);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else {
            updateFile(fullPath);
        }
    });
}

traverseDir(contentDir);
