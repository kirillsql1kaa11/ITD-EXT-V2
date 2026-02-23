export function initInterceptor(callback) {
    const originFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originFetch(...args);
        let url = "";
        if (typeof args[0] === 'string') url = args[0];
        else if (args[0] instanceof Request) url = args[0].url;
        else if (args[0] instanceof URL) url = args[0].href;

        // ВРЕМЕННЫЙ ЛОГ: покажет все запросы в консоли
        if (url.includes('/api/')) {
            console.log('[ITD-DEBUG] API Fetch:', url);
        }

        if (url.includes('/api/users/') && !url.includes('/posts') && !url.includes('/media')) {
            const clone = response.clone();
            clone.json().then(data => {
                if (data && data.username) callback('profile_loaded', data);
            }).catch(() => { });
        }
        return response;
    };

    const rawOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', function () {
            const url = this.responseURL;

            if (url.includes('/api/')) {
                console.log('[ITD-DEBUG] API XHR:', url);
            }

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
