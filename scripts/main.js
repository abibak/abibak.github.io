let shift = 0;

const btns = document.querySelectorAll('.main-section__button');

btns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    scrollingToSection(btn.getAttribute('data-href'));
}));

function scrollingToSection(attr) {
    document.getElementById(attr).scrollIntoView({
        behavior: 'smooth'
    });
}

animateRunningLine();

function animateRunningLine() {
    const tickerContainers = document.querySelectorAll(".ticker__container");

    if (tickerContainers.length === 0) {
        return;
    }

    shift -= 2;

    for (const ticker of tickerContainers) {
        ticker.style.left = shift + 'px';

        if ((ticker.getBoundingClientRect().x + ticker.getBoundingClientRect().width) <= 0) {
            shift = (window.innerWidth + (ticker.getBoundingClientRect().width / 2));
        }
    }

    requestAnimationFrame(animateRunningLine);
}

// slider
const participantSlider = function () {
    const container = document.querySelector('.tournament-participants__slider-container');
    const prevBtn = document.querySelector('.buttons-slider__left-button');
    const nextBtn = document.querySelector('.buttons-slider__right-button');
    const itemSlide = document.querySelector('.tournament-participants__slider-element');
    const maxSlides = document.querySelector('.tournament-participants__counter-length');
    const countSlides = document.querySelectorAll('.tournament-participants__slider-element').length;
    const counterEl = document.querySelector('.tournament-participants__counter-count');

    let padding = 0;
    let index;
    let displaySlides = 0;
    let shiftContainer = 0;
    let loop = true;
    let intervalSlide = null;

    window.addEventListener('resize', () => {
        padding = 0;
        setScreen();
    });

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    setScreen();

    function setScreen() {
        if (window.innerWidth < 1366) {
            init(2, 2, 2);
        } else {
            init(3, 3, 3);
        }

        if (window.innerWidth <= 375) {
            init(1, 1, 1);
        }
    }

    function init() {
        [displaySlides, shiftContainer, index] = [...arguments];
        handle();
    }

    function handle() {
        counterEl.innerHTML = index;
        maxSlides.innerHTML = countSlides;
        container.style.left = -padding + 'px';

        if (loop) {
            if (intervalSlide === null) {
                intervalSlide = setInterval(() => {
                    next();
                }, 4000);
            }
        }
    }

    function next() {
        let diff = Math.abs(displaySlides - countSlides);

        if (index >= countSlides) {
            padding = 0;
            index = displaySlides;
            handle();
            return;
        }

        // если разница остается < 3
        if (diff < displaySlides) {
            shiftContainer = diff;
        }

        index += shiftContainer;
        padding += ((itemSlide.getBoundingClientRect().width * shiftContainer) + (shiftContainer - 1) * 20);

        handle();
    }

    function prev() {
        let diff = Math.abs(index - displaySlides);

        if (index <= displaySlides) {
            return;
        }

        if (diff <= displaySlides) {
            shiftContainer = diff;
        }

        index -= shiftContainer;
        padding -= ((itemSlide.getBoundingClientRect().width * shiftContainer) + (shiftContainer - 1) * 20);

        handle();
    }
}

participantSlider();

const stagesSlider = function () {
    const container = document.querySelector('.stages-section__stages-blocks');
    const slide = document.querySelector('.stages-section__stages-blocks-item');
    const prevBtn = document.querySelector('.stage-section__button-controls-prev');
    const nextBtn = document.querySelector('.stage-section__button-controls-next');
    const paginationItems = document.querySelectorAll('.stage-section__button-controls-pagination-item');
    let lengthSlides = 5;
    let count = 1;
    let shift = 0; // px
    let activeEl = null;

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    setAttributeActive();

    function setAttributeActive(index = null) {
        if (typeof index === "number") {
            paginationItems.forEach(element => element.removeAttribute('data-active'));
            paginationItems[index - 1].setAttribute('data-active', 'on');
            return;
        }

        if (index === null) {
            paginationItems.forEach((element, index) => {
                if (element.hasAttribute('data-active')) {
                    activeEl = paginationItems[index];
                }

                element.addEventListener('click', (event) => {
                    activeEl.removeAttribute('data-active');
                    element.setAttribute('data-active', 'on');
                    activeEl = element;
                    shift = -(slide.getBoundingClientRect().width * index);
                    count = index + 1;
                    handle();
                });
            });
        }
    }

    function handle() {
        container.style.left = shift + 'px';

        setAttributeActive(count);

        if (count === 1) {
            prevBtn.children[0].setAttribute('data-disabled', 'on');
        } else {
            prevBtn.children[0].setAttribute('data-disabled', 'off');
        }

        if (count >= lengthSlides) {
            nextBtn.children[0].setAttribute('data-disabled', 'on');
        } else {
            nextBtn.children[0].setAttribute('data-disabled', 'off');
        }
    }

    function next() {
        if (count >= lengthSlides) {
            return;
        }

        count++;
        shift -= slide.getBoundingClientRect().width;
        handle();
    }

    function prev() {
        if (count <= 1) {
            return;
        }

        shift += slide.getBoundingClientRect().width;
        count--;
        handle();
    }
}

stagesSlider();
