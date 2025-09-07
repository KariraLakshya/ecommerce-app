import { selectors, state } from './state.js';

export const renderItems = (items) => {
    selectors.itemGrid.innerHTML = items.map(item => `
        <div class="item-card">
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="category">${item.category}</p>
                <div class="item-footer">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${item._id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
};

export const renderCart = (cartItems = []) => {
    const cartTotalSection = document.getElementById('cart-total');
    const itemsContainer = document.getElementById('cart-items-container');

    if (cartItems.length === 0) {
        if (itemsContainer) itemsContainer.style.display = 'none';
        if (cartTotalSection) cartTotalSection.style.display = 'none';
        selectors.emptyCartMsg.style.display = 'block';
        return;
    }

    if (itemsContainer) itemsContainer.style.display = 'block';
    if (cartTotalSection) cartTotalSection.style.display = 'block';
    selectors.emptyCartMsg.style.display = 'none';

    selectors.cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <img src="${item.itemId.imageUrl}" alt="${item.itemId.name}">
            <div class="cart-item-info">
                <h4>${item.itemId.name}</h4>
                <p>$${item.itemId.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-change" data-id="${item.itemId._id}" data-change="-1">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-change" data-id="${item.itemId._id}" data-change="1">+</button>
            </div>
            <button class="remove-from-cart-btn" data-id="${item.itemId._id}">Remove</button>
        </div>
    `).join('');

    // 1. Calculate the subtotal
    const subtotal = cartItems.reduce((sum, item) => sum + (item.itemId.price * item.quantity), 0);
    
    // 2. Calculate the tax (e.g., 8.5%)
    const tax = subtotal * 0.085;
    
    // 3. Calculate the final total
    const total = subtotal + tax;

    document.getElementById('subtotal-amount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax-amount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
};


  

export const updateCartCount = () => {
    const totalQuantity = state.localCart.reduce((sum, item) => sum + item.quantity, 0);
    selectors.cartCountEl.textContent = totalQuantity;
    selectors.cartCountEl.style.display = totalQuantity > 0 ? 'block' : 'none';
};

export const showPage = (pageName) => {
    state.currentPage = pageName;
    Object.values(selectors.pages).forEach(page => page.classList.remove('active'));
    selectors.pages[pageName].classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (pageName === 'items') selectors.nav.homeBtn.classList.add('active');
    if (pageName === 'cart') selectors.nav.cartBtn.classList.add('active');
};

export const updateUIForAuthState = () => {
    selectors.nav.authBtn.textContent = state.token ? 'Logout' : 'Login';
    updateCartCount();
};