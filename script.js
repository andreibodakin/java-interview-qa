// Список тем и файлов — можно автоматизировать позже, пока вручную
const TOPICS = [
    {
        name: "Core Java",
        path: "topics/core-java",
        files: [
            "jvm.md",
            "equals-vs-operator.md"
            // добавляй сюда новые файлы
        ]
    },
    {
        name: "Multithreading",
        path: "topics/multithreading",
        files: [
            "volatile.md"
        ]
    },
    {
        name: "Collections",
        path: "topics/collections",
        files: [
            "hashmap-internals.md",
            "arraylist-vs-linkedlist.md"
        ]
    }
];

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

function parseMarkdownToQAPairs(mdContent) {
    // Разделяем по заголовкам второго уровня
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
        answerDiv.innerHTML = marked.parse(answer); // рендерим Markdown в HTML

        qaBlock.appendChild(questionDiv);
        qaBlock.appendChild(answerDiv);
        container.appendChild(qaBlock);
    });
}

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

async function init() {
    const container = document.getElementById('topics-container');
    for (let topic of TOPICS) {
        const section = await loadTopicSection(topic);
        container.appendChild(section);
    }
}

// Запускаем!
document.addEventListener('DOMContentLoaded', init);
