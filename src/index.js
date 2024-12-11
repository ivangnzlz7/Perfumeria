let currentIndex = 0;
let autoPlayInterval;
const itemsCarousel = document.querySelector('.carousel-inner');
const menu = document.querySelector('#menu');
const navegacion = document.querySelector('nav .nav');
const main = document.querySelector('main');

window.addEventListener('DOMContentLoaded', mounth)

async function mounth() {
    // Traemos las mejores prendas
    const response = await fetch("/products.json");
    const data = await response.json();

    const newData = data.slice(0, 9);
    

    
    newData.forEach( product => {
        const carousel = document.createElement('span');
        const { image } = product;
         
        if(document.querySelectorAll('.carousel-inner span').length < 1){
            carousel.classList.add('carousel-item');
            carousel.classList.add('active');
        }

        carousel.classList.add('carousel-item')

        carousel.innerHTML = `
        <img src='${image}' alt='ImagenX'>
        `

        itemsCarousel.appendChild(carousel);
    }) 
    
}

// Mostramos el menu
menu.addEventListener('click', () => { 
    navegacion.classList.add('visible');
})

//Cerrando el menu
main.addEventListener('click', () => {
    navegacion.classList.remove('visible');
})


function showSlide(index) {
    const totalItems = document.querySelectorAll('.carousel-item').length;
    
    // Ajustar índice si se sale del rango
    if (index >= totalItems) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalItems - 1;
    } else {
        currentIndex = index;
    }

    // Mover las imágenes
    const offset = -currentIndex * 100;
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
}

const nextSlide = () => showSlide(currentIndex + 1)

const prevSlide = () => showSlide(currentIndex - 1)


function startAutoPlay() {
    // Reproduce el carrusel cada 4 segundos
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 4000);
}

const stopAutoPlay = () => clearInterval(autoPlayInterval)

// Detener la reproducción automática cuando el usuario interactúa
document.querySelector('.carousel').addEventListener('mouseover', stopAutoPlay);
document.querySelector('.carousel').addEventListener('mouseout', startAutoPlay);


// Iniciar en el primer slide y comenzar la reproducción automática
showSlide(currentIndex);
startAutoPlay(); 