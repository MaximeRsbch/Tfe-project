<template>
    <div class="swiper relative pt-8 lg:hidden">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper h-full w-full min-h-[350px]">
            <div class="swiper-slide">
                <picture>
                    <source
                        class="max-w-xs object-cover rounded-2xl"
                        srcset="/assets/img/webp/monument-funeraire-2.webp"
                        type="image/webp"
                    />
                    <img
                        src="assets/img/showroom/monument-funeraire-2.jpg"
                        class="max-w-xs object-cover rounded-2xl"
                        alt=""
                    />
                </picture>
            </div>
            <div class="swiper-slide">
                <picture>
                    <source
                        class="max-w-xs max-h-56 object-cover rounded-2xl"
                        srcset="/assets/img/webp/monument-funeraire-4.webp"
                        type="image/webp"
                    />
                    <img
                        src="assets/img/showroom/monument-funeraire-4.jpg"
                        class="max-w-xs max-h-56 object-cover rounded-2xl"
                        alt=""
                    />
                </picture>
            </div>
            <div class="swiper-slide">
                <picture>
                    <source
                        class="max-w-xs max-h-56 object-cover rounded-2xl"
                        srcset="/assets/img/webp/monument-funeraire-3.webp"
                        type="image/webp"
                    />
                    <img
                        src="assets/img/showroom/monument-funeraire-3.jpg"
                        class="max-w-xs max-h-56 object-cover rounded-2xl"
                        alt=""
                    />
                </picture>
            </div>
        </div>

        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>

    <script>
        import "../../scripts/slider";
        import "../../styles/slider.css";
    </script>
</template>
