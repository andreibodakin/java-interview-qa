// generate-practice-manifest.js
const fs = require('fs');
const path = require('path');

const PRACTICE_DIR = 'practice';

const CATEGORY_NAMES = {
    arrays: 'Массивы',
    strings: 'Строки',
    collections: 'Коллекции',
    algorithms: 'Алгоритмы',
    concurrency: 'Многопоточность',
    jvm: 'JVM и производительность'
    // добавляй новые категории по мере появления папок
};

// Автоматически получаем список папок (или задай вручную)
const CATEGORIES = fs.readdirSync(PRACTICE_DIR)
    .filter(dir => fs.statSync(path.join(PRACTICE_DIR, dir)).isDirectory());

const manifest = CATEGORIES.map(cat => {
    const files = fs.readdirSync(path.join(PRACTICE_DIR, cat))
        .filter(f => f.endsWith('.md'))
        .sort();

    return {
        name: CATEGORY_NAMES[cat] || cat.charAt(0).toUpperCase() + cat.slice(1),
        path: `${PRACTICE_DIR}/${cat}`,
        files
    };
});

fs.writeFileSync('practice-manifest.json', JSON.stringify(manifest, null, 2));
console.log('✅ practice-manifest.json generated');
