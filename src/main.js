/**
 * ITD Extended Client - Main Logic
 */

const CONFIG = {
    selectors: {
        nav: '.JOIWgkha',
        navItem: '.Vxc0MjRf',
        iconContainer: '.Yi-2DSIb',
        label: '.iQtUV16G'
    },
    id: 'itdex-main-button'
};

const UI = {
    // SVG иконка для нашей кнопки (минималистичная шестеренка)
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
};

function injectExtendedButton() {
    if (document.getElementById(CONFIG.id)) return;

    const nav = document.querySelector(CONFIG.selectors.nav);
    if (!nav) return;

    // Берем первую попавшуюся кнопку в навигации как шаблон
    const template = nav.querySelector(CONFIG.selectors.navItem);
    if (!template) return;

    // Создаем нашу кнопку
    const extButton = template.cloneNode(true);
    extButton.id = CONFIG.id;
    extButton.href = '#itd-extended'; // Пока просто заглушка

    // Находим элементы внутри и меняем их
    const iconSpan = extButton.querySelector(CONFIG.selectors.iconContainer);
    const labelSpan = extButton.querySelector(CONFIG.selectors.label);

    if (iconSpan) iconSpan.innerHTML = UI.icon;
    if (labelSpan) labelSpan.innerText = 'Extended';

    // Слушатель клика
    extButton.onclick = (e) => {
        e.preventDefault();
        alert('ITD Extended: Settings coming soon!');
    };

    // Добавляем в конец меню
    nav.appendChild(extButton);
    console.log('ITD Extended: Button injected successfully');
}

// Следим за изменениями DOM (для SPA переходов)
const observer = new MutationObserver(() => {
    injectExtendedButton();
});

function init() {
    console.log('ITD Extended Client: Initializing...');

    // Запускаем первичный поиск
    injectExtendedButton();

    // Начинаем следить за телом документа
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
