// Загрузка манифеста задач
async function loadPracticeManifest() {
    const response = await fetch('practice-manifest.json');
    if (!response.ok) throw new Error('Failed to load practice manifest');
    return await response.json();
}

// Загрузка Markdown-файла
async function loadMarkdownFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
        return await response.text();
    } catch (error) {
        console.error("Ошибка загрузки:", error);
        return `⚠️ Ошибка загрузки: ${url}`;
    }
}

// Парсинг Markdown: ищем ## Условие и ## Решение
function parseProblem(mdContent) {
    const sections = mdContent.split(/^##\s+/m).slice(1);
    let condition = "", solution = "";
    for (let section of sections) {
        const lines = section.split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        if (title === "Условие") {
            condition = content;
        } else if (title === "Решение") {
            solution = content;
        }
    }
    return { condition, solution };
}

// Рендеринг задачи
function renderProblem(container, problemTitle, condition, solution) {
    // ... (твой код без изменений)
}

// Рендеринг категории
async function renderCategory(category) {
    // ... (твой код без изменений)
}

// Инициализация — ТОЛЬКО ОДИН РАЗ
async function initPractice() {
    const container = document.getElementById('problems-container');
    const categories = await loadPracticeManifest();
    for (let category of categories) {
        const categorySection = await renderCategory(category);
        container.appendChild(categorySection);
    }
}

// Запуск после загрузки DOM — ТОЛЬКО ОДИН РАЗ
if (document.getElementById('problems-container')) {
    document.addEventListener('DOMContentLoaded', initPractice);
}
