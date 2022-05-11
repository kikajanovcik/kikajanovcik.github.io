window.onload = function() {
    let element = document.getElementsByClassName("page-header-index")[0];
    let previous = document.referrer !== '' ? new URL(document.referrer).pathname : '';
    
    if (previous === "/" || previous === "/index") {
        element.classList.remove("page-header-index");
        element.classList.add("page-header-transitioning");
    } else {
        element.classList.remove("page-header-index");
        element.classList.add("page-header");
    }
};