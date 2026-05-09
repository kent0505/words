// Theme

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark');
}

const themeBtn = document.getElementById('themeToggle');

function updateThemeButton() {
    const isDark = document.body.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
}

updateThemeButton();

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeButton();
});

// Tabs

let currentTab = 'all';
const allTab = document.getElementById('allTab');
const studyingTab = document.getElementById('studyingTab');

allTab.addEventListener('click', () => {
    currentTab = 'all';
    allTab.classList.add('active');
    studyingTab.classList.remove('active');
    renderWords();
});

studyingTab.addEventListener('click', () => {
    currentTab = 'studying';
    studyingTab.classList.add('active');
    allTab.classList.remove('active');
    renderWords();
});

// Words

let allWords = [];

async function loadWords() {
    const response = await fetch('words.txt');
    const text = await response.text();
    allWords = text.split('\n').filter(line => line.trim());
    renderWords();
}

function renderWords() {
    const container = document.getElementById('list');
    let wordsToShow = allWords;
    if (currentTab === 'studying') {
        wordsToShow = allWords.filter(
            (line, index) => {
                return localStorage.getItem(`word_${index}`) !== 'true';
            }
        );
    }

    container.innerHTML =
        wordsToShow.map((line) => {
            const originalIndex = allWords.indexOf(line);
            const checked = localStorage.getItem(`word_${originalIndex}`) === 'true';
            return `
            <div class="item">
                <input
                    type="checkbox"
                    id="word_${originalIndex}"
                    ${checked ? 'checked' : ''}
                >
                <label
                    for="word_${originalIndex}"
                    class="${checked ? 'checked' : ''}"
                >
                    ${line}
                </label>
            </div>
            `;
        }).join('');

    container.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            localStorage.setItem(checkbox.id, checkbox.checked);
            const label = checkbox.parentElement.querySelector('label');
            label.classList.toggle('checked', checkbox.checked);
            if (currentTab === 'studying') {
                renderWords();
            }
        });
    });
}

loadWords();