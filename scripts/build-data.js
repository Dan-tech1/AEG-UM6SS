const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'data.json');
let data = {};

if (fs.existsSync(dataFilePath)) {
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Erreur de lecture de data.json', e);
  }
}

function loadCollection(folderName, targetKey) {
  const dirPath = path.join(__dirname, '..', 'data', folderName);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  if (files.length === 0) return;

  if (!Array.isArray(data[targetKey])) {
    data[targetKey] = [];
  }

  // Calcul du plus grand ID existant
  let maxId = data[targetKey].reduce((max, item) => {
    return item.id && typeof item.id === 'number' && item.id > max ? item.id : max;
  }, 0);

  const newItems = [];
  for (const file of files) {
    try {
      const content = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf8'));
      const slug = file.replace(/\.json$/, '');

      // Nettoyer le chemin d'image
      if (content.image && content.image.startsWith('/')) {
        content.image = content.image.slice(1);
      }
      if (content.logo && content.logo.startsWith('/')) {
        content.logo = content.logo.slice(1);
      }

      const existingIndex = data[targetKey].findIndex(item => 
        item.slug === slug || (item.title && content.title && item.title === content.title)
      );

      if (existingIndex === -1) {
        maxId++;
        newItems.push({
          id: content.id || maxId,
          slug,
          ...content
        });
      } else {
        data[targetKey][existingIndex] = {
          ...data[targetKey][existingIndex],
          ...content
        };
      }
    } catch (e) {
      console.error(`Erreur lecture ${file}:`, e);
    }
  }

  // Ajouter les nouveaux items en haut de liste
  if (newItems.length > 0) {
    data[targetKey] = [...newItems, ...data[targetKey]];
  }
}

// Fusionner toutes les collections CMS
loadCollection('blog', 'blog');
loadCollection('events', 'events');
loadCollection('team', 'team');
loadCollection('activities', 'activities');
loadCollection('partenaires', 'partenaires');

try {
  const jsonOutput = JSON.stringify(data, null, 2);
  const tempPath = dataFilePath + '.tmp';
  fs.writeFileSync(tempPath, jsonOutput);
  fs.copyFileSync(tempPath, dataFilePath);
  fs.unlinkSync(tempPath);
  console.log('✅ data/data.json synchronisé avec succès !');
} catch (err) {
  console.error('Erreur écriture:', err);
}
