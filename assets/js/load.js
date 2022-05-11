window.onload = function() {
    let previous = new URL(document.referrer).pathname;
    let element = document.getElementsByClassName("page-header-index")[0];

    if (previous === "/" || previous === "/index") {
        element.classList.remove("page-header-index");
        element.classList.add("page-header-transitioning");
    } else {
        element.classList.remove("page-header-index");
        element.classList.add("page-header");
    }
};