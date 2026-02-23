import './styles/main.css';
import { initInterceptor } from './core/interceptor.js';
import { Settings } from './core/settings.js';
import { modules } from './modules/index.js';
import { createModal, openModal } from './ui/modal.js';

let profileData = null;

const CONFIG = {
    selectors: {
        nav: '.JOIWgkha, .JGhUMn6Z',
        navItem: '.Vxc0MjRf, .GNnsM0Nx',
        iconContainer: '.Yi-2DSIb, .TAGBLFdY',
        label: '.iQtUV16G'
    },
    id: 'itdex-main-button'
};

console.log('[ITD-EXT] Script starting (run-at: document-start)');

initInterceptor((event, data) => {
    if (event === 'profile_loaded') {
        console.log('[ITD-EXT] Profile data intercepted:', data.username, data.postsCount);
        profileData = data;
        runModules(data);
    }
});

function runModules(data) {
    if (!data || !document.body) return;
    modules.forEach(mod => {
        if (Settings.get(mod.id, mod.default)) {
            try {
                mod.init(data);
            } catch (e) {
                console.error(`[ITD-EXT] Error in module ${mod.id}:`, e);
            }
        }
    });
}

function injectExtendedButton() {
    if (!document.body || document.getElementById(CONFIG.id)) return;
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

function handleConfigChange(id, enabled) {
    if (!enabled) {
        if (id === 'show_posts_count') document.getElementById('itdex-posts-count')?.remove();
    } else {
        runModules(profileData);
    }
}

// 2. Ждем появления body для запуска UI логики
const bodyCheck = setInterval(() => {
    if (document.body) {
        clearInterval(bodyCheck);
        console.log('[ITD-EXT] Body found, initializing UI...');
        initUI();
    }
}, 50);

function initUI() {
    createModal(modules, handleConfigChange);
    injectExtendedButton();

    const observer = new MutationObserver(() => {
        injectExtendedButton();
        if (profileData) runModules(profileData);
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
