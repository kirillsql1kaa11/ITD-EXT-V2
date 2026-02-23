// ==UserScript==
// @name         ITD Extended Client
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Extended client for ITD social network
// @author       Kirill
// @match        https://итд.com/*
// @match        https://xn--d1ah4a.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @updateURL    https://github.com/kirillsql1kaa11/ITD-EXT-V2/raw/refs/heads/main/itd-extended.user.js
// @downloadURL  https://github.com/kirillsql1kaa11/ITD-EXT-V2/raw/refs/heads/main/itd-extended.user.js
// ==/UserScript==

(function () {
    'use strict';

    const SETTINGS = {
        show_posts_count: GM_getValue('itdex_show_posts_count', true)
    };

    let profileData = null;

    // Перехват API
    const originFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originFetch(...args);
        if (args[0] && args[0].includes('/api/users/') && !args[0].includes('/posts')) {
            const clone = response.clone();
            clone.json().then(data => {
                profileData = data;
                injectPostsCount();
            });
        }
        return response;
    };

    GM_addStyle(`
        :root {
            --itdex-bg-primary: #151518;
            --itdex-bg-secondary: #1a1a1a;
            --itdex-bg-tertiary: #2a2a2a;
            --itdex-text-primary: #f5f5f5;
            --itdex-text-secondary: rgba(255, 255, 255, .5);
            --itdex-accent-primary: #0080FF;
        }

        .itdex-nav-item { cursor: pointer; transition: background-color 0.2s; }
        .itdex-nav-item:hover { background-color: var(--itdex-bg-tertiary); }

        .itdex-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.2s;
        }
        .itdex-modal-overlay.active { opacity: 1; pointer-events: all; }
        .itdex-modal-container {
            background: var(--itdex-bg-secondary); width: 100%; max-width: 450px;
            border-radius: 16px; border: 1px solid var(--itdex-bg-tertiary);
            box-shadow: 0 10px 40px rgba(0,0,0,0.5); transform: scale(0.95); transition: transform 0.2s;
        }
        .itdex-modal-overlay.active .itdex-modal-container { transform: scale(1); }
        .itdex-modal-header { padding: 18px 24px; border-bottom: 1px solid var(--itdex-bg-tertiary); display: flex; align-items: center; justify-content: space-between; }
        .itdex-modal-title { font-size: 18px; font-weight: 700; color: var(--itdex-text-primary); }
        .itdex-modal-close { cursor: pointer; color: var(--itdex-text-secondary); }
        .itdex-modal-body { padding: 12px 0; }

        .itdex-setting-item {
            display: flex; align-items: center; justify-content: space-between;
            padding: 14px 24px; transition: background 0.2s;
        }
        .itdex-setting-item:hover { background: rgba(255,255,255,0.03); }
        .itdex-setting-info { display: flex; flex-direction: column; }
        .itdex-setting-name { font-size: 15px; font-weight: 500; color: var(--itdex-text-primary); }
        .itdex-setting-desc { font-size: 12px; color: var(--itdex-text-secondary); margin-top: 2px; }

        /* Тумблер */
        .itdex-switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .itdex-switch input { opacity: 0; width: 0; height: 0; }
        .itdex-slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--itdex-bg-tertiary); transition: .4s; border-radius: 20px;
        }
        .itdex-slider:before {
            position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px;
            background-color: white; transition: .4s; border-radius: 50%;
        }
        input:checked + .itdex-slider { background-color: var(--itdex-accent-primary); }
        input:checked + .itdex-slider:before { transform: translateX(20px); }
    `);

    const CONFIG = {
        selectors: {
            nav: '.JOIWgkha, .JGhUMn6Z',
            navItem: '.Vxc0MjRf, .GNnsM0Nx',
            iconContainer: '.Yi-2DSIb, .TAGBLFdY',
            label: '.iQtUV16G',
            statContainer: '.hSN99swS' // Ищем любую статистику профиля
        },
        id: 'itdex-main-button'
    };

    function injectPostsCount() {
        if (!SETTINGS.show_posts_count || !profileData || !profileData.postsCount) return;
        if (document.getElementById('itdex-posts-count')) return;

        const stats = document.querySelectorAll(CONFIG.selectors.statContainer);
        if (stats.length === 0) return;

        const lastStat = stats[stats.length - 1];
        const postsStat = lastStat.cloneNode(true);
        postsStat.id = 'itdex-posts-count';

        // Удаляем wD-vYWrg если он есть (чтобы отступы были ок)
        postsStat.classList.add('wD-vYWrg');

        const countSpan = postsStat.querySelector('.LIXEFTYA') || postsStat.querySelector('span:first-child');
        const labelSpan = postsStat.querySelector('.XHEEbVAb') || postsStat.querySelector('span:last-child');

        if (countSpan) countSpan.innerText = profileData.postsCount;
        if (labelSpan) labelSpan.innerText = 'постов';

        lastStat.parentNode.appendChild(postsStat);
    }

    function createModal() {
        const overlay = document.createElement('div');
        overlay.id = 'itdex-modal';
        overlay.className = 'itdex-modal-overlay';
        overlay.innerHTML = `
            <div class="itdex-modal-container">
                <div class="itdex-modal-header">
                    <span class="itdex-modal-title">ITD Extended</span>
                    <div class="itdex-modal-close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg></div>
                </div>
                <div class="itdex-modal-body">
                    <div class="itdex-setting-item">
                        <div class="itdex-setting-info">
                            <span class="itdex-setting-name">Счетчик постов</span>
                            <span class="itdex-setting-desc">Показывать количество постов в профиле</span>
                        </div>
                        <label class="itdex-switch">
                            <input type="checkbox" id="itdex-opt-posts" ${SETTINGS.show_posts_count ? 'checked' : ''}>
                            <span class="itdex-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;

        overlay.onclick = (e) => e.target === overlay && closeModal();
        overlay.querySelector('.itdex-modal-close').onclick = closeModal;

        const checkbox = overlay.querySelector('#itdex-opt-posts');
        checkbox.onchange = (e) => {
            SETTINGS.show_posts_count = e.target.checked;
            GM_setValue('itdex_show_posts_count', SETTINGS.show_posts_count);
            if (!SETTINGS.show_posts_count) {
                const el = document.getElementById('itdex-posts-count');
                if (el) el.remove();
            } else {
                injectPostsCount();
            }
        };

        document.body.appendChild(overlay);
    }

    function openModal() { document.getElementById('itdex-modal').classList.add('active'); }
    function closeModal() { document.getElementById('itdex-modal').classList.remove('active'); }

    function injectExtendedButton() {
        if (document.getElementById(CONFIG.id)) return;
        const nav = document.querySelector(CONFIG.selectors.nav);
        if (!nav) return;
        const template = nav.querySelector(CONFIG.selectors.navItem);
        if (!template) return;

        const btn = template.cloneNode(true);
        btn.id = CONFIG.id;
        btn.href = 'javascript:void(0)';
        btn.classList.remove('VPqB7n6W', 'ZtAKIgsJ');
        btn.classList.add('itdex-nav-item');

        const icon = btn.querySelector(CONFIG.selectors.iconContainer);
        let label = btn.querySelector(CONFIG.selectors.label) || btn.querySelector('span:last-child');

        if (icon) icon.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
        if (label) label.innerText = 'Extended';

        btn.onclick = (e) => { e.preventDefault(); openModal(); };
        nav.appendChild(btn);
    }

    const observer = new MutationObserver(() => {
        injectExtendedButton();
        injectPostsCount();
    });

    function init() {
        createModal();
        injectExtendedButton();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
