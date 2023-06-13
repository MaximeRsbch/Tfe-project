window.addEventListener("load", () => {
    const button = document.querySelector("[toggle-nav]");
    const nav = document.querySelector("[main-nav]");
    const body = document.querySelector("body");
    const hamburger = document.querySelector("#hamburger");
    const logo = document.querySelector("#logo");
    const separator = document.querySelector("#separator");
    const links = document.querySelectorAll("nav ul li a");

    links.forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.add("scale-x-0");
            nav.classList.add("opacity-0");
            body.classList.remove("overflow-hidden");
            logo.classList.remove("z-50");
            separator.classList.remove("z-50");

            hamburger.children[0].classList.remove("rotate-45");
            hamburger.children[0].classList.remove("absolute");
            hamburger.children[0].classList.remove("right-2");
            hamburger.children[1].classList.remove("opacity-0");
            hamburger.children[2].classList.remove("-rotate-45");
            hamburger.children[2].classList.remove("absolute");
            hamburger.children[2].classList.remove("right-2");
        });
    });

    button.addEventListener("click", () => {
        window.scrollTo(0, 0);
        nav.classList.toggle("scale-x-0");
        nav.classList.toggle("opacity-0");
        body.classList.toggle("overflow-hidden");
        logo.classList.toggle("z-50");
        separator.classList.toggle("z-50");
        separator.classList.toggle("hidden");
        hamburger.children[0].classList.toggle("rotate-45");
        hamburger.children[0].classList.toggle("absolute");
        hamburger.children[1].classList.toggle("opacity-0");
        hamburger.children[2].classList.toggle("-rotate-45");
        hamburger.children[2].classList.toggle("absolute");
    });
});
