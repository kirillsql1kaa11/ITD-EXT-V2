export default {
    id: 'show_posts_count',
    name: 'Счетчик постов',
    description: 'Показывает количество постов в профиле',
    default: true,

    init(data) {
        if (!data || data.postsCount === undefined) return;
        if (document.getElementById('itdex-posts-count')) return;

        // Ищем контейнер с подписками (может быть несколько на странице)
        const stats = document.querySelectorAll('.hSN99swS');
        if (stats.length === 0) return;

        // Вставляем после последнего найденного элемента статистики
        const lastStat = stats[stats.length - 1];
        if (!lastStat.parentNode) return;

        const postsStat = lastStat.cloneNode(true);
        postsStat.id = 'itdex-posts-count';
        postsStat.classList.add('wD-vYWrg');

        const countSpan = postsStat.querySelector('span:first-child') || postsStat.querySelector('.LIXEFTYA');
        const labelSpan = postsStat.querySelector('span:last-child') || postsStat.querySelector('.XHEEbVAb');

        if (countSpan) countSpan.innerText = data.postsCount;
        if (labelSpan) labelSpan.innerText = 'постов';

        lastStat.parentNode.appendChild(postsStat);
    }
};
