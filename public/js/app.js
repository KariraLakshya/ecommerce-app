console.log("app.js file has started running.");
import { state, selectors } from './modules/state.js';
import { apiFetch } from './modules/api.js';
import { 
    renderItems, 
    renderCart, 
    updateCartCount, 
    showPage, 
    updateUIForAuthState 
} from './modules/ui.js';

// --- DATA FETCHING & SYNCING ---

const loadItems = async () => {
    const category = document.getElementById('category-filter').value;
    const minPrice = document.getElementById('min-price-filter').value;
    const maxPrice = document.getElementById('max-price-filter').value;

    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    const query = params.toString() ? `?${params.toString()}` : '';

    try {
        const items = await apiFetch(`/items${query}`, 'GET', null, null);
        renderItems(items);
    } catch (error) {
        console.error('Failed to load items:', error);
        selectors.itemGrid.innerHTML = '<p>Could not load items. Please try again later.</p>';
    }
};

const loadCart = async () => {
    // If user is logged out, render the cart from local storage
    if (!state.token) {
        if (state.localCart.length > 0) {
            try {
                // To render full item details, we need to fetch all items.
                // In a large-scale app, you'd create a specific endpoint to fetch details for a list of IDs.
                const allItems = await apiFetch('/items', 'GET', null, null);
                const cartItems = state.localCart.map(localItem => {
                    const itemDetails = allItems.find(item => item._id === localItem.itemId);
                    return itemDetails ? { itemId: itemDetails, quantity: localItem.quantity } : null;
                }).filter(Boolean); // Filter out any items that might have been deleted from the DB
                renderCart(cartItems);
            } catch (error) {
                 console.error("Could not fetch item details for local cart:", error);
                 selectors.cartItemsContainer.innerHTML = "<p>Error loading cart details.</p>";
            }
        } else {
            renderCart([]); // Render an empty cart
        }
        return;
    }

    // If user is logged in, fetch from the database
    try {
        const cart = await apiFetch('/cart');
        // Update local state to be in sync with the database
        state.localCart = cart.items.map(item => ({ itemId: item.itemId._id, quantity: item.quantity }));
        localStorage.setItem('localCart', JSON.stringify(state.localCart));
        renderCart(cart.items);
        updateCartCount();
    } catch (error) {
        console.error('Failed to load cart:', error);
    }
};

const syncCart = async () => {
    if (!state.token || state.localCart.length === 0) {
        if (state.token) await loadCart(); // If logged in but local cart is empty, still load DB cart
        return;
    }

    // Sync local items to the DB one by one upon login
    try {
        const dbCart = await apiFetch('/cart');
        const dbItemIds = dbCart.items.map(item => item.itemId._id);

        const itemsToSync = state.localCart.filter(localItem => !dbItemIds.includes(localItem.itemId));

        for (const item of itemsToSync) {
           await apiFetch('/cart', 'POST', { itemId: item.itemId, quantity: item.quantity });
        }
        
        // After syncing, reload the cart to get fully populated data
        await loadCart();
    } catch (error) {
        console.error('Failed to sync cart:', error);
    }
};

// --- EVENT HANDLERS ---

function setupEventListeners() {
    console.log("setupEventListeners function has been called.")
    // Navigation
    selectors.nav.homeBtn.addEventListener('click', () => showPage('items'));
    selectors.nav.cartBtn.addEventListener('click', () => {
        showPage('cart');
        loadCart();
    });

    selectors.nav.authBtn.addEventListener('click', () => {
        if (state.token) { // Handle Logout
            state.token = null;
            localStorage.removeItem('token');
            // Clear local cart on logout to avoid merging with another user's cart on the same browser
            state.localCart = [];
            localStorage.removeItem('localCart');
            updateUIForAuthState();
            showPage('items');
        } else { // Handle Show Login
            showPage('auth');
        }
    });

    // Auth Forms Toggle
    document.getElementById('show-signup').addEventListener('click', () => {
        console.log(" 'show-signup' link was clicked!");
        selectors.loginForm.style.display = 'none';
        selectors.signupForm.style.display = 'block';
    });
    document.getElementById('show-login').addEventListener('click', () => {
        selectors.signupForm.style.display = 'none';
        selectors.loginForm.style.display = 'block';
    });

    // Auth Form Submissions
    selectors.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const data = await apiFetch('/auth/login', 'POST', { email, password });
            console.log("Received successful response from server:", data);
            state.token = data.token;
            localStorage.setItem('token', data.token);
            updateUIForAuthState();
            await syncCart();
            showPage('items');
        } catch (error) {
            document.getElementById('login-error').textContent = error.message;
        }
    });

    selectors.signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const payload = { email, password };

        try {
            const data = await apiFetch('/auth/register', 'POST', payload, null);
            console.log("Received successful response from server:", data);
            state.token = data.token;
            localStorage.setItem('token', data.token);
            updateUIForAuthState();
            await syncCart();
            showPage('items');
        } catch (error) {
            document.getElementById('signup-error').textContent = error.message;
        }
    });

    // Item Page Actions
    document.getElementById('apply-filters-btn').addEventListener('click', loadItems);
    
    selectors.itemGrid.addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const itemId = e.target.dataset.id;
            const existingItem = state.localCart.find(item => item.itemId === itemId);
            const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
            
            if (state.token) {
                await apiFetch('/cart', 'POST', { itemId, quantity: newQuantity });
                await loadCart();
            } else {
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    state.localCart.push({ itemId, quantity: 1 });
                }
                localStorage.setItem('localCart', JSON.stringify(state.localCart));
                updateCartCount();
                alert('Item added to cart!');
            }
        }
    });
    // Inside the setupEventListeners function in app.js
    document.getElementById('clear-filters-btn').addEventListener('click', () => {
        document.getElementById('category-filter').value = '';
        document.getElementById('min-price-filter').value = '';
        document.getElementById('max-price-filter').value = '';
        loadItems();
    });
    // Cart Page Actions
    selectors.cartItemsContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const itemId = target.dataset.id;
        if (!itemId) return;

        if (target.classList.contains('remove-from-cart-btn')) {
            if (state.token) {
                await apiFetch(`/cart/${itemId}`, 'DELETE');
            }
            state.localCart = state.localCart.filter(item => item.itemId !== itemId);
        }
        
        if (target.classList.contains('quantity-change')) {
            const change = parseInt(target.dataset.change, 10);
            const itemInCart = state.localCart.find(item => item.itemId === itemId);
            if (!itemInCart) return;

            const newQuantity = itemInCart.quantity + change;
            
            if (newQuantity < 1) {
                state.localCart = state.localCart.filter(item => item.itemId !== itemId);
                if (state.token) await apiFetch(`/cart/${itemId}`, 'DELETE');
            } else {
                itemInCart.quantity = newQuantity;
                if (state.token) await apiFetch('/cart', 'POST', { itemId, quantity: newQuantity });
            }
        }

        localStorage.setItem('localCart', JSON.stringify(state.localCart));
        await loadCart();
    });
}

// --- INITIALIZATION ---
function initializeApp() {
    console.log("Initializing the application...");
    updateUIForAuthState();
    loadItems();
    if (state.token) {
        syncCart();
    } else {
        // If not logged in, show the items page by default, but check if local cart exists to update count
        showPage('items');
        updateCartCount();
    }
    setupEventListeners();
}

// Start the application
initializeApp();
window.continueShopping = function() {
    showPage('items');
}
window.proceedToCheckout = function() {
    alert('Coming Soon');
}