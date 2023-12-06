const animeList = new Set(JSON.parse(localStorage.getItem('notInterestedAnime')));
const mangaList = new Set(JSON.parse(localStorage.getItem('notInterestedManga')));

const rxMatchMediaAndId = new RegExp(/((?:anime)|(?:manga))\/(\d+)/);
if (rxMatchMediaAndId.test(document.baseURI)) addNotInterestedButton();
function addNotInterestedButton() {

    if (document.querySelector('.not-interested-button')) return;

    const mediaType = document.baseURI.match(rxMatchMediaAndId)[1];
    const id = document.baseURI.match(rxMatchMediaAndId)[2];
    
    const headerDiv = document.querySelector('.header');
    const actionsDiv = headerDiv.querySelector('.actions');
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('not-interested-button');

    const list = mediaType === 'anime' ? animeList : mangaList;
    let isInterested = !list.has(id);
    
    if (isInterested) {
        buttonDiv.classList.add('add-not-interested');
        buttonDiv.textContent = 'Not Interested';
    }
    else {
        buttonDiv.classList.add('remove-not-interested');
        buttonDiv.textContent = 'Interested';
    }
    
    buttonDiv.addEventListener('click', () => {
        if (isInterested) {
            list.add(id);
            buttonDiv.textContent = 'Interested';
            buttonDiv.classList.add('remove-not-interested');
            buttonDiv.classList.remove('add-not-interested');
        }
        else {
            list.delete(id);
            buttonDiv.textContent = 'Not Interested';
            buttonDiv.classList.add('add-not-interested');
            buttonDiv.classList.remove('remove-not-interested');
        }
        isInterested = !isInterested;
        const storageKey = mediaType === 'anime' ? 'notInterestedAnime' : 'notInterestedManga';
        localStorage.setItem(storageKey, JSON.stringify(Array.from(list)));
    });
    
    actionsDiv.appendChild(buttonDiv);
}

const pageObserver = new MutationObserver(() => {
    if (rxMatchMediaAndId.test(document.baseURI)) addNotInterestedButton();
});
pageObserver.observe(document.querySelector('.page-content'), { childList: true });

const domObserver = new MutationObserver(() => {
    const covers = document.querySelectorAll('a.cover, a.title, div.title > a, a.favourite');
    for (let i = 0; i < covers.length; i++) {
        const path = covers[i].pathname;
        const id = path.split('/')[2];
        if ((path.startsWith('/anime/') && animeList.has(id)) || (path.startsWith('/manga/') && mangaList.has(id))) {
            if (!covers[i].classList.contains('not-interested')) covers[i].classList.add('not-interested'); 
        }
        else if (covers[i].classList.contains('not-interested')) covers[i].classList.remove('not-interested');
    }
});

domObserver.observe(document.querySelector('.page-content'), { childList: true, subtree: true });
