
// Загрузка манифеста задач
async function loadPracticeManifest() {
    const response = await fetch('practice-manifest.json');
    if (!response.ok) throw new Error('Failed to load practice manifest');
    return await response.json();
}

async function initPractice() {
    const container = document.getElementById('problems-container');
    const categories = await loadPracticeManifest();
    for (let category of categories) {
        const categorySection = await renderCategory(category);
        container.appendChild(categorySection);
    }
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
    // Разделяем по заголовкам второго уровня
    const sections = mdContent.split(/^##\s+/m).slice(1); // первый элемент — до первого ##
    
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

// Рендеринг задачи с двойным раскрытием
function renderProblem(container, problemTitle, condition, solution) {
    const problemBlock = document.createElement('div');
    problemBlock.className = 'qa-block';

    // Уровень 1: Название задачи
    const titleDiv = document.createElement('div');
    titleDiv.className = 'question';
    titleDiv.textContent = problemTitle;
    titleDiv.style.cursor = 'pointer';
    titleDiv.onclick = function() {
        const conditionDiv = this.nextElementSibling;
        conditionDiv.classList.toggle('show');
        this.classList.toggle('open');
    };

    // Уровень 2: Условие задачи (изначально скрыто)
    const conditionDiv = document.createElement('div');
    conditionDiv.className = 'answer';
    conditionDiv.innerHTML = marked.parse(condition);

    // Кнопка "Показать решение" внутри условия
    const showSolutionBtn = document.createElement('button');
    showSolutionBtn.textContent = "👀 Показать решение";
    showSolutionBtn.className = 'theme-toggle'; // используем существующий стиль кнопки
    showSolutionBtn.style.marginTop = '15px';
    showSolutionBtn.style.width = 'auto';
    showSolutionBtn.style.padding = '8px 16px';

    const solutionDiv = document.createElement('div');
    solutionDiv.className = 'answer';
    solutionDiv.style.display = 'none';
    solutionDiv.innerHTML = marked.parse(solution);

    showSolutionBtn.onclick = function(e) {
        e.stopPropagation(); // не закрывать условие при клике
        solutionDiv.style.display = solutionDiv.style.display === 'none' ? 'block' : 'none';
        this.textContent = solutionDiv.style.display === 'none' ? "👀 Показать решение" : "🙈 Скрыть решение";
    };

    conditionDiv.appendChild(showSolutionBtn);
    conditionDiv.appendChild(solutionDiv);

    problemBlock.appendChild(titleDiv);
    problemBlock.appendChild(conditionDiv);
    container.appendChild(problemBlock);
}

// Рендеринг категории
async function renderCategory(category) {
    const categorySection = document.createElement('div');
    categorySection.className = 'topic-section';

    const categoryTitle = document.createElement('h2');
    categoryTitle.className = 'topic-title';
    categoryTitle.textContent = category.name;
    categorySection.appendChild(categoryTitle);

    for (let file of category.files) {
        const url = `${category.path}/${file}`;
        const mdContent = await loadMarkdownFile(url);
        const { condition, solution } = parseProblem(mdContent);
        const problemTitle = file.replace(/\.md$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        renderProblem(categorySection, problemTitle, condition, solution);
    }

    return categorySection;
}

// Инициализация страницы практики
async function initPractice() {
    const container = document.getElementById('problems-container');
    const categories = await loadPracticeManifest();
    for (let category of categories) {
        const categorySection = await renderCategory(category);
        container.appendChild(categorySection);
    }
}

// Запускаем после загрузки DOM
if (document.getElementById('problems-container')) {
    document.addEventListener('DOMContentLoaded', initPractice);
}
