// ==UserScript==
// @name         ITD Extended Client
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Extended client for ITD social network
// @author       Kirill
// @match        https://итд.com/*
// @match        https://xn--d1ah4a.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @updateURL    https://github.com/kirillsql1kaa11/ITD-EXT-V2/raw/refs/heads/main/itd-extended.user.js
// @downloadURL  https://github.com/kirillsql1kaa11/ITD-EXT-V2/raw/refs/heads/main/itd-extended.user.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        :root {
            --itdex-bg-primary: #151518;
            --itdex-bg-secondary: #1a1a1a;
            --itdex-bg-tertiary: #2a2a2a;
            --itdex-text-primary: #f5f5f5;
            --itdex-text-secondary: rgba(255, 255, 255, .5);
            --itdex-accent-primary: #0080FF;
            --itdex-modal-shadow: rgba(0, 0, 0, 0.5);
        }

        .itdex-nav-item {
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .itdex-nav-item:hover {
            background-color: var(--itdex-bg-tertiary);
        }

        .itdex-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }

        .itdex-modal-overlay.active {
            opacity: 1;
            pointer-events: all;
        }

        .itdex-modal-container {
            background: var(--itdex-bg-secondary);
            width: 100%;
            max-width: 500px;
            border-radius: 12px;
            border: 1px solid var(--itdex-bg-tertiary);
            box-shadow: 0 8px 32px var(--itdex-modal-shadow);
            overflow: hidden;
            transform: scale(0.95);
            transition: transform 0.2s ease;
        }

        .itdex-modal-overlay.active .itdex-modal-container {
            transform: scale(1);
        }

        .itdex-modal-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--itdex-bg-tertiary);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .itdex-modal-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--itdex-text-primary);
        }

        .itdex-modal-close {
            cursor: pointer;
            color: var(--itdex-text-secondary);
            transition: color 0.2s;
        }

        .itdex-modal-close:hover {
            color: var(--itdex-text-primary);
        }

        .itdex-modal-body {
            padding: 20px;
            min-height: 200px;
            color: var(--itdex-text-secondary);
            font-size: 14px;
            text-align: center;
        }
    `);

    const CONFIG = {
        selectors: {
            nav: '.JOIWgkha, .JGhUMn6Z',
            navItem: '.Vxc0MjRf, .GNnsM0Nx',
            iconContainer: '.Yi-2DSIb, .TAGBLFdY',
            label: '.iQtUV16G'
        },
        id: 'itdex-main-button'
    };

    const UI = {
        icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
    };

    function createModal() {
        if (document.getElementById('itdex-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'itdex-modal';
        overlay.className = 'itdex-modal-overlay';

        overlay.innerHTML = `
            <div class="itdex-modal-container">
                <div class="itdex-modal-header">
                    <span class="itdex-modal-title">ITD Extended Settings</span>
                    <div class="itdex-modal-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                    </div>
                </div>
                <div class="itdex-modal-body">
                    Модули и настройки появятся в следующем обновлении.
                </div>
            </div>
        `;

        overlay.onclick = (e) => {
            if (e.target === overlay) closeModal();
        };

        overlay.querySelector('.itdex-modal-close').onclick = closeModal;

        document.body.appendChild(overlay);
    }

    function openModal() {
        const modal = document.getElementById('itdex-modal');
        if (modal) modal.classList.add('active');
    }

    function closeModal() {
        const modal = document.getElementById('itdex-modal');
        if (modal) modal.classList.remove('active');
    }

    function injectExtendedButton() {
        if (document.getElementById(CONFIG.id)) return;

        const nav = document.querySelector(CONFIG.selectors.nav);
        if (!nav) return;

        const template = nav.querySelector(CONFIG.selectors.navItem);
        if (!template) return;

        const extButton = template.cloneNode(true);
        extButton.id = CONFIG.id;
        extButton.href = 'javascript:void(0)';
        extButton.classList.remove('VPqB7n6W', 'ZtAKIgsJ');
        extButton.classList.add('itdex-nav-item');

        const iconSpan = extButton.querySelector(CONFIG.selectors.iconContainer);
        let labelSpan = extButton.querySelector(CONFIG.selectors.label);
        if (!labelSpan) {
            labelSpan = extButton.querySelectorAll('span:not(' + CONFIG.selectors.iconContainer + ')')[0]
                || extButton.querySelector('span:last-child');
        }

        if (iconSpan) iconSpan.innerHTML = UI.icon;
        if (labelSpan) labelSpan.innerText = 'Extended';

        extButton.onclick = (e) => {
            e.preventDefault();
            openModal();
        };

        nav.appendChild(extButton);
    }

    const observer = new MutationObserver(() => injectExtendedButton());

    function init() {
        createModal();
        injectExtendedButton();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
