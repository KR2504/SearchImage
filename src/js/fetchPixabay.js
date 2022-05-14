const axios = require('axios');

export default class PixabayApiServer {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    };

    async fetchImages() {

        const pixabayParams = new URLSearchParams({
            key: '27293440-fcc002e8220f402dd59aadebd',
            q: `${this.searchQuery}`,
            orientation: "horizontal",
            safesearch: true,
            image_type: "photo",
            page: `${this.page}`,
            per_page: 40,

        })
        return (await axios.get(`https://pixabay.com/api/?${pixabayParams}`)).data

    };

    incrementPage() {
        this.page += 1;
    };

    resetPage() {
        this.page = 1;
    };

    get query() {
        return this.searchQuery;
    };

    set query(newQuery) {
        this.searchQuery = newQuery;
    };
}