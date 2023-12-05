console.log('Hello from AniList Not Interested!');
const animeList = new Set(JSON.parse(localStorage.getItem('notInterestedAnime')));
const mangaList = new Set(JSON.parse(localStorage.getItem('notInterestedManga')));

const observer = new MutationObserver(() => {
    const covers = document.querySelectorAll('a.cover');
    for (let i = 0; i < covers.length; i++) {
        const path = covers[i].pathname;
        const id = path.split('/')[2];
        if (path.startsWith('/anime/') && animeList.has(id)) {
            if (!covers[i].classList.contains('not-interested')) covers[i].classList.add('not-interested');
        };
        if (path.startsWith('/manga/') && mangaList.has(id)) {
            if (!covers[i].classList.contains('not-interested')) covers[i].classList.add('not-interested');
        };
    }
});

observer.observe(document, { childList: true, subtree: true });
