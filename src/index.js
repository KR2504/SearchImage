import imagesTpl from "./js/markupCard.hbs";
import PixabayApiServer from "./js/fetchPixabay";
import "./css/styles.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import InfiniteScroll from "infinite-scroll"


const fetchPixabay = new PixabayApiServer();
const axios = require('axios');



let infScroll = new InfiniteScroll('.gallery', {
    responseType: 'text',
    history: false,

    path() { fetchPixabay.fetchImages() },
})
infScroll.loadNextPage();
infScroll.on('load', (response, path) => {
    console.log(JSON.parse(response));

});




const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    input: document.querySelector('.search-input'),
    btn: document.querySelector('.load-more'),
}


refs.form.addEventListener('submit', onSubmitForm);
refs.btn.addEventListener('click', onLoadMore);

function onSubmitForm(e) {
    e.preventDefault();

    fetchPixabay.query = e.currentTarget.elements.searchQuery.value;

    if (fetchPixabay.query === '') {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        return;
    }

    clearImagesMarkup();
    fetchPixabay.resetPage();

    renderImages().then(image => {
        const total = Number(image.totalHits)
        Notify.success(`Hooray! We found ${total} images.`)

    })

    e.target.reset();
}

async function renderImages() {
    try {
        refs.btn.disabled = true;
        refs.btn.classList.remove('is-hidden');
        const imageData = await fetchPixabay.fetchImages();
        const image = imageData.hits;
        const amountImage = imageData.totalHits;

        if (amountImage === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            refs.btn.classList.add('is-hidden');
            return
        }

        appendImagesMarkup(image);
        lightbox.refresh();
        fetchPixabay.incrementPage();
        refs.btn.disabled = false;

        return imageData;
    } catch (error) {
        Notify.failure(error)
    }
}

function onLoadMore() {
    renderImages().then(image => {
        if (fetchPixabay.page > Math.ceil(Number(image.totalHits) / 40)) {
            Notify.warning("We're sorry, but you've reached the end of search results.")
            refs.btn.classList.add('is-hidden')
        }
    });
    lightbox.refresh()
}

function appendImagesMarkup(image) {
    refs.gallery.insertAdjacentHTML('beforeend', imagesTpl(image))
}

function clearImagesMarkup() {
    refs.gallery.innerHTML = "";
}

Notify.init({
    width: '280px',
    position: 'right-top',
    distance: '30px',
    borderRadius: '10px',
    timeout: 2000,
    cssAnimationStyle: 'from-right',
})

let lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionsData: 'alt',
});