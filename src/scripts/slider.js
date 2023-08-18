import Swiper, { Navigation, A11y, Autoplay } from "swiper";
import "swiper/swiper-bundle.css";

const swiper = new Swiper(".swiper", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    modules: [Navigation, A11y, Autoplay],
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
