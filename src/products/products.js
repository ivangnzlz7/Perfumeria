const firstContent = document.querySelector('.primero');
const searchProduct = document.querySelector('#search');
const btnCard = document.querySelector('.btn-car');
const contentCarrito = document.querySelector('#lista-carrito tbody');
const carrito = document.querySelector('#carrito2');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const main = document.querySelector('main');
const menu = document.querySelector('#menu');
const navegacion = document.querySelector('nav .nav');
let productosCarrito = [];


loadedEventListeners();
function loadedEventListeners() {
    //Carga los productos
    window.addEventListener('DOMContentLoaded', colection);

    //Mostrar menu
    menu.addEventListener('click', () => {
        navegacion.classList.add('visible');
    })
    
    //Elimina la navegacion
    main.addEventListener('click', () => {
        navegacion.classList.remove('visible');
    })

    //Filtra los productos
    searchProduct.addEventListener('input', filterProduct);

    //Agregar productos
    firstContent.addEventListener('click', agregarProducto);
    

    //Local storage
    productosCarrito = JSON.parse(localStorage.getItem('carrito')) || []
    carritoHTML();
}

//Agregar Producto
function agregarProducto(e) {
    if(e.target.classList.contains('btn-car')) {
        const productSelect = e.target.parentElement;
        leerDatosProductos(productSelect);
    }
    if(e.target.classList.contains('image-product')){
        const productSelect = e.target.parentElement;
        overlay(productSelect);
    }
}

//Creamos un overlay
async function overlay(selectProduct){
    let id = selectProduct.querySelector('button').getAttribute('data-id');

     //Obtenemos el ID del producto en JSON
     const response = await fetch('/products.json');
     const data = await response.json();
     const productId = data.find( product => product.id == id);
     const { descripcion } = productId;

    if(document.querySelectorAll('.overlay').length > 0){
        let overlay = document.querySelectorAll('.overlay');
        overlay[overlay.length - 1].remove();
    } 

    const overlay = document.createElement('section');
    overlay.classList.add('overlay');
    overlay.style.backgroundImage = `url(${selectProduct.querySelector('img').src})`;
    overlay.style.backgroundRepeat = 'no-repeat';
    overlay.style.backgroundSize = 'cover';
    overlay.style.backgroundPosition = 'center';
    
    overlay.innerHTML = `
        <p>${descripcion}</p>
    `
    main.appendChild(overlay);
    
    overlay.addEventListener('mouseout', () => {
        main.addEventListener('click', () => {
            overlay.classList.add('overlay-visibility');
        });
    }); 
    return;
}


// Lee el contenido del HTML y extrae informacion del producto
async function leerDatosProductos(producto) {
    //Obtenemos la cantidad del producto con fetch
    const response = await fetch('/products.json')
    const data = await response.json();

    // Crear un producto nuevo
    const infoProduct = {
        image: producto.querySelector('img').src,
        titulo: producto.querySelector('p').textContent,
        precio: producto.querySelector('h2').textContent,
        id: producto.querySelector('button').getAttribute('data-id'),
        cantidad: 1
    }

    //Buscamos el producto y la cantidad
    const product = data.find( product => product.id == infoProduct.id )
    const { cantidad } = product;

    //Comprobamos si existe
    let searchCopy = productosCarrito.find(producto => producto.id === infoProduct.id)
    if (searchCopy) {
        const productos = productosCarrito.map(producto => {
            if (producto.id === infoProduct.id) {
                if(producto.cantidad >= cantidad){
                    alert(`Producto ${producto.titulo} sin stock`);
                    producto.cantidad = cantidad
                    return producto
                }
                producto.cantidad++;
                return producto;
            }
            return producto;
        })

        productosCarrito = [...productos];
        carritoHTML();
        return;
    }

    //Agregando al carrito
    productosCarrito = [...productosCarrito, infoProduct]
    setTimeout(() => {
        alert('Se agrego producto');
    }, 1000)
    carritoHTML();

}

function carritoHTML() {

    let check = productosCarrito.every(producto => producto === false);
    if (check) {
        productosCarrito = []
    }
    sincronizarStorage();
}

async function colection() {
    const response = await fetch("/products.json");
    const data = await response.json()

    data.forEach((product) => {
        const galeria = document.createElement('article');
        const { nombre, image, precio, id } = product

        galeria.innerHTML = `
            <img src='${image}' alt='ImagenX' width='200' height='200' class='image-product'>
            <h2>$${precio}</h2>
            <p>${nombre}</p>
            <button class='btn-car' data-id='${id}'>Carrito</button>
            <br>
            `
        firstContent.appendChild(galeria)
        return;
    })
}

async function filterProduct(){
    const response = await fetch("/products.json");
    const data = await response.json()
    const searchTerm = searchProduct.value.charAt(0).toUpperCase() + searchProduct.value.slice(1);
    
    // Filtramos valores de acuerdo al nombre, categoria o precio
    const filterProducts = data.filter(product => {
        return product.nombre === searchTerm || product.categoria === searchTerm || product.precio == searchTerm;
    })

    if (filterProducts.length == 0) {
        console.log('Vacio');
            return;
        }

        limpiarHTML()

        filterProducts.forEach(filproducts => {
            const galeria = document.createElement('article');
            const { nombre, image, precio, id } = filproducts

            galeria.innerHTML = `
            <img src='${image}' alt='ImagenX' width='200' height='200' class='image-product'>
            <h2>$${precio}</h2>
            <p>${nombre}</p>
            <button class='btn-car' data-id='${id}'>Carrito</button>
            <br>
            `
            firstContent.appendChild(galeria)
        })

        setTimeout(() => {
            searchProduct.value = '';
        }, 1000)
        return;
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(productosCarrito));
}

function limpiarHTML() {
    while (firstContent.firstChild) {
        firstContent.removeChild(firstContent.firstChild)
    }
}

