const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader')


// NASA API

const count = 10;
const apiKey = 'DEMO_KEY';

const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({top: 0, behavior: 'instant'});
    if(page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDomNode(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites)
    
    currentArray.forEach(result => {
        // Card
        const card = document.createElement('div');
        card.classList.add('card');
        // link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full image';
        link.target = '_blank';
        // Image 
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = "NASA Picture Of The Day";
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.textContent = result.title
        // save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results') {
            saveText.textContent = 'Add To Favorites';
            saveText.setAttribute('onclick', `saveFavorites('${result.url}')`);
        } else {
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
       
        // Card Tetx
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date 
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright;
        const resultCopyRight = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = `   ${resultCopyRight}`

        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        
        imagesContainer.appendChild(card);
    })
}

function updateDOM(page) {
    // GET fAVOrites from  lOCALSTORAGE 
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));

    }
    imagesContainer.textContent = ''
    createDomNode(page)
    showContent(page);
  
}

// Get 10 Images from NASA API

async function getNasapictures(){
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
          resultsArray = await response.json();
        updateDOM('results');

    } catch(error) {
        // catch error here
        console.log('oops, error with fetching api from NASA APOD')
    }

}

// Add results to favorites

function saveFavorites(itemUrl) {
    // Looop through results Array
    resultsArray.forEach(item => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            // show save confirmation for 2seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
            saveConfirmed.hidden = true;
            }, 2000)
        //    Set favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    })
}

// Remove item from favorites

function removeFavorite(itemUrl) {
    if(favorites[itemUrl]) {
        delete favorites[itemUrl];
        //    Set favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

// On load 
getNasapictures();