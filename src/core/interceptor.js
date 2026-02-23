export function initInterceptor(callback) {
    const originFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originFetch(...args);

        // Проверяем, что это запрос профиля
        if (args[0] && args[0].includes('/api/users/') && !args[0].includes('/posts')) {
            const clone = response.clone();
            clone.json().then(data => {
                callback('profile_loaded', data);
            });
        }

        return response;
    };
}
