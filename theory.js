// Список тем и файлов
const TOPICS = [
    {
        name: "Core Java",
        path: "theory/core-java",
        files: [
            "jvm.md",
            "equals-vs-operator.md"
        ]
    },
    {
        name: "Multithreading",
        path: "theory/multithreading",
        files: [
            "volatile.md"
        ]
    },
    {
        name: "Collections",
        path: "theory/collections",
        files: [
            "hashmap-internals.md",
            "arraylist-vs-linkedlist.md"
        ]
    },
    {
        name: "Database",
        path: "theory/database",
        files: [
            "NplusOne.md"
        ]
    }
];

// Переключение темы
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.getElementById('theme-toggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Загрузка сохранённой темы
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-toggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
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

// Парсинг Markdown в пары вопрос-ответ
function parseMarkdownToQAPairs(mdContent) {
    const sections = mdContent.split(/^##\s+/m).filter(s => s.trim());
    const qaPairs = [];

    for (let section of sections) {
        const lines = section.split('\n');
        const question = lines[0].trim();
        const answer = lines.slice(1).join('\n').trim();
        if (question) {
            qaPairs.push({ question, answer });
        }
    }

    return qaPairs;
}

// Рендеринг вопросов и ответов
function renderQA(container, qaPairs) {
    qaPairs.forEach(({ question, answer }) => {
        const qaBlock = document.createElement('div');
        qaBlock.className = 'qa-block';

        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.textContent = question;
        questionDiv.onclick = function() {
            const answerDiv = this.nextElementSibling;
            answerDiv.classList.toggle('show');
            this.classList.toggle('open');
        };

        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        answerDiv.innerHTML = marked.parse(answer);

        qaBlock.appendChild(questionDiv);
        qaBlock.appendChild(answerDiv);
        container.appendChild(qaBlock);
    });
}

// Загрузка раздела
async function loadTopicSection(topic) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'topic-section';

    const titleDiv = document.createElement('h2');
    titleDiv.className = 'topic-title';
    titleDiv.textContent = topic.name;
    sectionDiv.appendChild(titleDiv);

    for (let file of topic.files) {
        const url = `${topic.path}/${file}`;
        const mdContent = await loadMarkdownFile(url);
        const qaPairs = parseMarkdownToQAPairs(mdContent);
        renderQA(sectionDiv, qaPairs);
    }

    return sectionDiv;
}

// Инициализация
async function init() {
    loadSavedTheme();
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    const container = document.getElementById('topics-container');
    for (let topic of TOPICS) {
        const section = await loadTopicSection(topic);
        container.appendChild(section);
    }
}

document.addEventListener('DOMContentLoaded', init);
