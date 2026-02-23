// ==UserScript==
// @name         ITD Extended Client
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Extended client for ITD social network
// @author       Kirill
// @match        https://итд.com/*
// @match        https://xn--d1ah4a.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @updateURL    https://github.com/kirillsql1kaa11/ITD-EXT-V2/raw/main/itd-extended.user.js
// @downloadURL  https://github.com/kirillsql1kaa11/ITD-EXT-V2/raw/main/itd-extended.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Внедряем стили
    GM_addStyle(`
        :root {
            --itdex-bg-primary: #151518;
            --itdex-bg-secondary: #1a1a1a;
            --itdex-bg-tertiary: #2a2a2a;
            --itdex-text-primary: #f5f5f5;
            --itdex-text-secondary: rgba(255, 255, 255, .5);
            --itdex-text-tertiary: rgba(255, 255, 255, .3);
            --itdex-accent-primary: #0080FF;
            --itdex-accent-hover: #93c5fd;
        }

        .itdex-nav-item {
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .itdex-nav-item:hover {
            background-color: var(--itdex-bg-tertiary);
        }

        .itdex-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            color: var(--itdex-accent-primary);
        }

        .itdex-label {
            margin-left: 12px;
            font-weight: 500;
            color: var(--itdex-text-primary);
        }
    `);

    const CONFIG = {
        // Поддержка обоих типов навигации (Mobile / PC)
        selectors: {
            nav: '.JOIWgkha, .JGhUMn6Z',
            navItem: '.Vxc0MjRf, .GNnsM0Nx',
            iconContainer: '.Yi-2DSIb, .TAGBLFdY',
            label: '.iQtUV16G' // На ПК класса нет, обработаем отдельно
        },
        id: 'itdex-main-button'
    };

    const UI = {
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
    };

    function injectExtendedButton() {
        if (document.getElementById(CONFIG.id)) return;

        const nav = document.querySelector(CONFIG.selectors.nav);
        if (!nav) return;

        const template = nav.querySelector(CONFIG.selectors.navItem);
        if (!template) return;

        const extButton = template.cloneNode(true);
        extButton.id = CONFIG.id;
        extButton.href = '#itd-extended';
        extButton.classList.remove('VPqB7n6W', 'ZtAKIgsJ'); // Убираем активные стили
        extButton.classList.add('itdex-nav-item');

        const iconSpan = extButton.querySelector(CONFIG.selectors.iconContainer);

        // Логика поиска текста для ПК (где нет класса)
        let labelSpan = extButton.querySelector(CONFIG.selectors.label);
        if (!labelSpan) {
            labelSpan = extButton.querySelectorAll('span:not(' + CONFIG.selectors.iconContainer + ')')[0]
                || extButton.querySelector('span:last-child');
        }

        if (iconSpan) iconSpan.innerHTML = UI.icon;
        if (labelSpan) labelSpan.innerText = 'Extended';

        extButton.onclick = (e) => {
            e.preventDefault();
            const version = typeof GM_info !== 'undefined' ? GM_info.script.version : '1.0.1';
            alert('ITD Extended Client - v' + version + '\nBy Kirill');
        };

        nav.appendChild(extButton);
        console.log('ITD Extended: Injected into ' + (nav.classList.contains('JGhUMn6Z') ? 'PC' : 'Mobile') + ' menu');
    }

    const observer = new MutationObserver(() => injectExtendedButton());

    function init() {
        injectExtendedButton();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
