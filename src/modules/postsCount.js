export default {
    id: 'show_posts_count',
    name: 'Счетчик постов',
    description: 'Показывает количество постов в профиле',
    default: true,

    init(data) {
        if (!data || !data.postsCount) return;
        if (document.getElementById('itdex-posts-count')) return;

        const statContainers = document.querySelectorAll('.hSN99swS');
        if (statContainers.length === 0) return;

        const lastStat = statContainers[statContainers.length - 1];
        const postsStat = lastStat.cloneNode(true);

        postsStat.id = 'itdex-posts-count';
        postsStat.classList.add('wD-vYWrg');

        const countSpan = postsStat.querySelector('span:first-child');
        const labelSpan = postsStat.querySelector('span:last-child');

        if (countSpan) countSpan.innerText = data.postsCount;
        if (labelSpan) labelSpan.innerText = 'постов';

        lastStat.parentNode.appendChild(postsStat);
    }
};
