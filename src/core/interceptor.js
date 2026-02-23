export function initInterceptor(callback) {
    const originFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originFetch(...args);

        let url = "";
        if (typeof args[0] === 'string') url = args[0];
        else if (args[0] instanceof Request) url = args[0].url;
        else if (args[0] instanceof URL) url = args[0].href;

        if (url.includes('/api/users/') && !url.includes('/posts') && !url.includes('/media')) {
            const clone = response.clone();
            clone.json().then(data => {
                if (data && data.username) {
                    callback('profile_loaded', data);
                }
            }).catch(() => { });
        }

        return response;
    };
}
