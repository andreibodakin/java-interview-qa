// Структура категорий — легко расширять
const PRACTICE_CATEGORIES = [
    {
        name: "Массивы",
        path: "practice-problems/arrays",
        files: [
            "two-sum.md",
            "move-zeroes.md"
        ]
    },
    {
        name: "Строки",
        path: "practice-problems/strings",
        files: [
            "reverse-string.md",
            "find-first-unique.md"
        ]
    },
    {
        name: "Коллекции",
        path: "practice-problems/collections",
        files: [
            "group-anagrams.md"
        ]
    },
    {
        name: "Алгоритмы",
        path: "practice-problems/algorithms",
        files: [
            "fibonacci.md"
        ]
    }
];

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

// Парсинг Markdown: первая строка ## — заголовок (задача), остальное — решение
function parseMarkdownToProblem(mdContent) {
    const sections = mdContent.split(/^##\s+/m).filter(s => s.trim());
    if (sections.length === 0) return null;

    const lines = sections[0].split('\n');
    const title = lines[0].trim();
    const solution = lines.slice(1).join('\n').trim();

    return { title, solution };
}

// Рендеринг задачи
function renderProblem(container, problem) {
    const problemBlock = document.createElement('div');
    problemBlock.className = 'qa-block';

    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.textContent = problem.title;
    questionDiv.onclick = function() {
        const answerDiv = this.nextElementSibling;
        answerDiv.classList.toggle('show');
        this.classList.toggle('open');
    };

    const answerDiv = document.createElement('div');
    answerDiv.className = 'answer';
    answerDiv.innerHTML = marked.parse(problem.solution);

    problemBlock.appendChild(questionDiv);
    problemBlock.appendChild(answerDiv);
    container.appendChild(problemBlock);
}

// Рендеринг категории
async function renderCategory(category) {
    const categorySection = document.createElement('div');
    categorySection.className = 'topic-section'; // используем тот же класс, что и на главной

    const categoryTitle = document.createElement('h2');
    categoryTitle.className = 'topic-title';
    categoryTitle.textContent = category.name;
    categorySection.appendChild(categoryTitle);

    for (let file of category.files) {
        const url = `${category.path}/${file}`;
        const mdContent = await loadMarkdownFile(url);
        const problem = parseMarkdownToProblem(mdContent);
        if (problem) {
            renderProblem(categorySection, problem);
        }
    }

    return categorySection;
}

// Инициализация страницы практики
async function initPractice() {
    const container = document.getElementById('problems-container');
    for (let category of PRACTICE_CATEGORIES) {
        const categorySection = await renderCategory(category);
        container.appendChild(categorySection);
    }
}

// Запускаем после загрузки DOM
if (document.getElementById('problems-container')) {
    document.addEventListener('DOMContentLoaded', initPractice);
}
