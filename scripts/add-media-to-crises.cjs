const fs = require('fs');
const path = require('path');

const crisesDir = path.join(__dirname, '..', 'content', 'crises');

// Function to generate appropriate placeholder images based on crisis ID
function generatePlaceholderImages(crisisId) {
  const imageMappings = {
    'ai': ['/media/ai/neural-network-placeholder.jpg', '/media/ai/robot-placeholder.png', '/media/ai/algorithm-placeholder.jpg'],
    'armut': ['/media/armut/homeless-placeholder.jpg', '/media/armut/food-bank-placeholder.png', '/media/armut/working-poor-placeholder.jpg'],
    'artensterben': ['/media/artensterben/extinction-placeholder.jpg', '/media/artensterben/biodiversity-placeholder.png', '/media/artensterben/endangered-species-placeholder.jpg'],
    'asylpolitik': ['/media/asylpolitik/refugee-placeholder.jpg', '/media/asylpolitik/border-placeholder.png', '/media/asylpolitik/asylum-seeker-placeholder.jpg'],
    'automatisierung': ['/media/automatisierung/robot-placeholder.jpg', '/media/automatisierung/factory-placeholder.png', '/media/automatisierung/unemployment-placeholder.jpg'],
    'autoritarismus': ['/media/autoritarismus/dictator-placeholder.jpg', '/media/autoritarismus/protest-placeholder.png', '/media/autoritarismus/censorship-placeholder.jpg'],
    'desinformation': ['/media/desinformation/fake-news-placeholder.jpg', '/media/desinformation/social-media-placeholder.png', '/media/desinformation/misinformation-placeholder.jpg'],
    'drogen': ['/media/drogen/drugs-placeholder.jpg', '/media/drogen/addiction-placeholder.png', '/media/drogen/trafficking-placeholder.jpg'],
    'exklusion': ['/media/exklusion/exclusion-placeholder.jpg', '/media/exklusion/discrimination-placeholder.png', '/media/exklusion/marginalization-placeholder.jpg'],
    'faschisierung': ['/media/faschisierung/fascism-placeholder.jpg', '/media/faschisierung/extremism-placeholder.png', '/media/faschisierung/racism-placeholder.jpg'],
    'nihilismus': ['/media/nihilismus/nihilism-placeholder.jpg', '/media/nihilismus/apathy-placeholder.png', '/media/nihilismus/meaninglessness-placeholder.jpg'],
    'polarisierung': ['/media/polarisierung/polarization-placeholder.jpg', '/media/polarisierung/divide-placeholder.png', '/media/polarisierung/conflict-placeholder.jpg'],
    'populismus': ['/media/populismus/populism-placeholder.jpg', '/media/populismus/demagogue-placeholder.png', '/media/populismus/crowd-placeholder.jpg'],
    'radikalisierung': ['/media/radikalisierung/radicalization-placeholder.jpg', '/media/radicalization/extremism-placeholder.png', '/media/radicalization/ideology-placeholder.jpg'],
    'terrorismus': ['/media/terrorismus/terrorism-placeholder.jpg', '/media/terrorismus/attack-placeholder.png', '/media/terrorismus/security-placeholder.jpg'],
    'ueberwachung': ['/media/ueberwachung/surveillance-placeholder.jpg', '/media/ueberwachung/camera-placeholder.png', '/media/ueberwachung/privacy-placeholder.jpg'],
    'vereinsamung': ['/media/vereinsamung/loneliness-placeholder.jpg', '/media/vereinsamung/isolation-placeholder.png', '/media/vereinsamung/social-media-placeholder.jpg'],
    'zukunftsangst': ['/media/zukunftsangst/anxiety-placeholder.jpg', '/media/zukunftsangst/uncertainty-placeholder.png', '/media/zukunftsangst/fear-placeholder.jpg']
  };

  return imageMappings[crisisId] || [
    `/media/${crisisId}/crisis-placeholder.jpg`,
    `/media/${crisisId}/impact-placeholder.png`,
    `/media/${crisisId}/solution-placeholder.jpg`
  ];
}

// Function to add media section to a manifest file
function addMediaToManifest(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const manifest = JSON.parse(content);

    const crisisId = manifest.id;

    // Skip if media section already exists and has images
    if (manifest.media && manifest.media.images && manifest.media.images.length > 0) {
      console.log(`Skipping ${crisisId} - already has media section`);
      return;
    }

    // Generate placeholder images
    const images = generatePlaceholderImages(crisisId);

    // Add media section
    manifest.media = {
      images: images
    };

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`Added media section to ${crisisId}`);

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process all crisis directories
function processAllCrises() {
  const crisisDirs = fs.readdirSync(crisesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const crisisDir of crisisDirs) {
    const enManifestPath = path.join(crisesDir, crisisDir, 'manifest.en.json');
    const deManifestPath = path.join(crisesDir, crisisDir, 'manifest.de.json');

    if (fs.existsSync(enManifestPath)) {
      addMediaToManifest(enManifestPath);
    }

    if (fs.existsSync(deManifestPath)) {
      addMediaToManifest(deManifestPath);
    }
  }
}

console.log('Adding media sections to all crises...');
processAllCrises();
console.log('Done!');
