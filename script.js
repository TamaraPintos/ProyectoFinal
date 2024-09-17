// Obtener productos desde un archivo JSON
const fetchProducts = async () => {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('No se pudo obtener los productos');
        return await response.json();
    } catch (error) {
        console.error('Error en fetchProducts:', error);
        return []; // Retorna un array vacío si ocurre un error
    }
};

// Guardar carrito en localStorage
const saveCart = (cart = []) => {
    if (!Array.isArray(cart)) return;
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Obtener carrito desde localStorage
const loadCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
};

// Añadir un producto al carrito
const addToCart = (product = {}) => {
    if (!product.id || !product.name || !product.price) return; // Validación básica
    const cart = loadCart();
    cart.push(product);
    saveCart(cart);
    renderCart();
};

// Eliminar producto del carrito
const removeFromCart = (productId = 0) => {
    if (!productId) return;
    let cart = loadCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
};

// Renderizar productos en el DOM, incluyendo imagen
const renderProducts = async () => {
    const productList = document.getElementById('product-list');
    const products = await fetchProducts();

    products.forEach(product => {
        const li = document.createElement('li');
        li.classList.add('product-item');

        // Crear imagen del producto
        const img = document.createElement('img');
        img.src = product.image || 'images/default.jpg'; // Ruta de la imagen, con validación
        img.alt = product.name;
        img.classList.add('product-image');
        
        const productDetails = document.createElement('span');
        productDetails.textContent = `${product.name} - $${product.price}`;
        
        // Botón para añadir al carrito
        const addButton = document.createElement('button');
        addButton.textContent = 'Añadir al carrito';
        addButton.addEventListener('click', () => addToCart(product));

        // Añadir imagen, detalles y botón al producto
        li.appendChild(img);
        li.appendChild(productDetails);
        li.appendChild(addButton);
        productList.appendChild(li);
    });
};

// Renderizar carrito en el DOM
const renderCart = () => {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Limpiar contenido actual
    const cart = loadCart();

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.addEventListener('click', () => removeFromCart(item.id));

        li.appendChild(removeButton);
        cartList.appendChild(li);
    });
};

// Vaciar carrito
const clearCart = () => {
    localStorage.clear();
    renderCart();
};

// Función para finalizar la compra
const checkout = () => {
    const cart = loadCart();
    if (cart.length === 0) {
        alert('El carrito está vacío. No puedes finalizar la compra.');
        return;
    }
    alert('Gracias por tu compra. ¡Disfruta de tu whisky!');
    clearCart(); // Vaciar el carrito después de finalizar la compra
};

// Inicializar la página
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    document.getElementById('checkout').addEventListener('click', checkout); // Añadir el evento al botón de finalizar compra
    await renderProducts();
    renderCart();
});
