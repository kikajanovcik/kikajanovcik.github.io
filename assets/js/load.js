window.onload = function() {
    const header = document.getElementsByClassName("page-header-index")[0];
    const div = header.querySelector('.banner-index');

    const previous = document.referrer !== '' ? new URL(document.referrer).pathname : '';
    
    if (previous === "/" || previous === "/index") {
        header.classList.remove("page-header-index");
        header.classList.add("page-header-transitioning");

        div.classList.remove("banner-index");
        div.classList.add("banner");
    } else {
        header.classList.remove("page-header-index");
        header.classList.add("page-header");
        div.classList.remove("banner-index");
    }
};