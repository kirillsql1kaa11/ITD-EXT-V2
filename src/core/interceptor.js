export function initInterceptor(callback) {
    // --- Перехват FETCH ---
    const originFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originFetch(...args);
        let url = "";
        if (typeof args[0] === 'string') url = args[0];
        else if (args[0] instanceof Request) url = args[0].url;
        else if (args[0] instanceof URL) url = args[0].href;

        // DEBUG: Раскомментируй строку ниже, если хочешь видеть ВООБЩЕ ВСЕ запросы
        // console.log('[ITD-DEBUG] Fetch:', url);

        if (url.includes('/api/users/') && !url.includes('/posts') && !url.includes('/media')) {
            const clone = response.clone();
            clone.json().then(data => {
                if (data && data.username) callback('profile_loaded', data);
            }).catch(() => { });
        }
        return response;
    };

    // --- Перехват XMLHttpRequest ---
    const rawOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', function () {
            const url = this.responseURL;
            if (url.includes('/api/users/') && !url.includes('/posts') && !url.includes('/media')) {
                try {
                    const data = JSON.parse(this.responseText);
                    if (data && data.username) callback('profile_loaded', data);
                } catch (e) { }
            }
        });
        rawOpen.apply(this, arguments);
    };
}
