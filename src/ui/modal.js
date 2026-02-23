import { Settings } from '../core/settings.js';

export function createModal(modules, onConfigChange) {
    if (document.getElementById('itdex-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'itdex-modal';
    overlay.className = 'itdex-modal-overlay';

    const modulesHtml = modules.map(mod => `
        <div class="itdex-setting-item">
            <div class="itdex-setting-info">
                <span class="itdex-setting-name">${mod.name}</span>
                <span class="itdex-setting-desc">${mod.description}</span>
            </div>
            <label class="itdex-switch">
                <input type="checkbox" id="itdex-opt-${mod.id}" ${Settings.get(mod.id, mod.default) ? 'checked' : ''}>
                <span class="itdex-slider"></span>
            </label>
        </div>
    `).join('');

    overlay.innerHTML = `
        <div class="itdex-modal-container">
            <div class="itdex-modal-header">
                <span class="itdex-modal-title">ITD Extended</span>
                <div class="itdex-modal-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </div>
            </div>
            <div class="itdex-modal-body">
                ${modulesHtml}
            </div>
        </div>
    `;

    overlay.onclick = (e) => e.target === overlay && closeModal();
    overlay.querySelector('.itdex-modal-close').onclick = closeModal;

    modules.forEach(mod => {
        const checkbox = overlay.querySelector(`#itdex-opt-${mod.id}`);
        checkbox.onchange = (e) => {
            const enabled = e.target.checked;
            Settings.set(mod.id, enabled);
            onConfigChange(mod.id, enabled);
        };
    });

    document.body.appendChild(overlay);
}

export function openModal() {
    document.getElementById('itdex-modal')?.classList.add('active');
}

export function closeModal() {
    document.getElementById('itdex-modal')?.classList.remove('active');
}
