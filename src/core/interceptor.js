export function initInterceptor(callback) {
    const originFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originFetch(...args);

        let url = "";
        try {
            if (typeof args[0] === 'string') url = args[0];
            else if (args[0] instanceof Request) url = args[0].url;
            else if (args[0] instanceof URL) url = args[0].href;
        } catch (e) { return response; }

        // Если в URL есть 'api/users/' и это не посты/медиа - значит наш профиль
        if (url.includes('/api/users/') && !url.includes('/posts') && !url.includes('/media')) {
            console.log('[ITD-EXT] Caught Profile Request:', url);
            const clone = response.clone();
            clone.json().then(data => {
                if (data && (data.username || data.postsCount !== undefined)) {
                    console.log('[ITD-EXT] Data parsed successfully!');
                    callback('profile_loaded', data);
                }
            }).catch(err => console.error('[ITD-EXT] JSON Parse error:', err));
        }

        return response;
    };

    const rawOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', function () {
            const url = this.responseURL;
            if (url.includes('/api/users/') && !url.includes('/posts') && !url.includes('/media')) {
                console.log('[ITD-EXT] Caught Profile XHR:', url);
                try {
                    const data = JSON.parse(this.responseText);
                    if (data && (data.username || data.postsCount !== undefined)) {
                        callback('profile_loaded', data);
                    }
                } catch (e) {
                    console.error('[ITD-EXT] XHR Parse error:', e);
                }
            }
        });
        rawOpen.apply(this, arguments);
    };
}
