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
        if (window.itdexOpenModal) window.itdexOpenModal();
    };
    nav.appendChild(extButton);
}

const observer = new MutationObserver(() => {
    injectExtendedButton();
});

function init() {
    injectExtendedButton();
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
