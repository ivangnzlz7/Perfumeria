const carrito = document.querySelector('#carrito2');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const main = document.querySelector('main');
const menu = document.querySelector('#menu');
const navegacion = document.querySelector('nav .nav');
let col = document.querySelector('.col');
let col2 = document.querySelector('.col2');
let col3 = document.querySelector('.col3');
let col4 = document.querySelector('.col4');
let products = JSON.parse(localStorage.getItem('carrito'));

carOperation();
function carOperation(){
    //Mostrar menu
    menu.addEventListener('click', () => {
        navegacion.classList.add('visible');
    })

    main.addEventListener('click', () => {
        navegacion.classList.remove('visible');
    })

    //Elimina los productos
    carrito.addEventListener('click', eliminarProducto);
    
    //Vacia los productos agregados
    vaciarCarrito.addEventListener('click', () => {
        if(confirm('Estas por vaciar el carrito')){
            products = [];
            sincronizarStorage();
            limpiarCarrito();
            setTimeout(() => {
                alert('La operacion fue exitosa');
            }, 1000)
        }
    }) 

    //Local storage
    products = JSON.parse(localStorage.getItem('carrito')) || []
    productosLoaded();
}


function productosLoaded(){
    let check = products.every(producto => producto === false);
    
    if (check) {
        console.log('Arreglo vacio');
        products = []
    }

    limpiarCarrito();

    products.forEach(product => {
        if (!product.image) {
            console.log('no existe producto');
            return;
        }

        const { image, titulo, precio, cantidad, id  } = product

        const columna = document.createElement('td');
        const columna2 = document.createElement('td');
        const columna3 = document.createElement('td');
        const columna4 = document.createElement('td');

        columna.innerHTML = `
                            <img src="${image}" width="120">
                            `
        columna2.innerHTML = `
                            ${titulo}
        `
        columna3.innerHTML = `
                            ${precio}
        `
        columna4.innerHTML = `
                            ${cantidad}
                            <a href="#" class="borrar-producto" data-id="${id}">X</a>
        `


        // Agregar en el cuerpo de la tabla
        col.appendChild(columna);
        col2.appendChild(columna2);
        col3.appendChild(columna3);
        col4.appendChild(columna4);

        
    });
    sincronizarStorage();
}

function eliminarProducto(e) {
    if (e.target.classList.contains('borrar-producto')) {
        const productoId = e.target.getAttribute('data-id');

        //Eliminar si tiene mas de un mismo producto
        const productAmount = products.find(producto => producto.id === productoId)

        if (productAmount) {
            const productos = products.map(producto => {
                if (producto.id === productoId) {
                    if (producto.cantidad < 2) {
                            return false;
                    }
                    producto.cantidad--;
                    return producto;
                }
                return producto;
            })
            products = [...productos]
            productosLoaded();
            return;
        }
    }
}


function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(products));
}


function limpiarCarrito() {
    while (document.querySelectorAll('.col td').length > 0) {
        col.removeChild(col.lastChild);
        col2.removeChild(col2.lastChild);
        col3.removeChild(col3.lastChild);
        col4.removeChild(col4.lastChild);
    }
}