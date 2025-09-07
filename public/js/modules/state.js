export const state = {
    token: localStorage.getItem('token'),
    currentPage: 'items',
    localCart: JSON.parse(localStorage.getItem('localCart')) || [],
};
export const selectors = {
    pages: {
        auth: document.getElementById('auth-page'),
        items: document.getElementById('items-page'),
        cart: document.getElementById('cart-page'),
    },
    nav: {
        homeBtn: document.getElementById('home-button'),
        cartBtn: document.getElementById('cart-button'),
        authBtn: document.getElementById('auth-button'),
    },
    itemGrid: document.getElementById('item-grid'),
    cartItemsContainer: document.getElementById('cart-items-container'),
    cartTotalEl: document.getElementById('cart-total'),
    cartCountEl: document.getElementById('cart-count'),
    emptyCartMsg: document.getElementById('empty-cart-message'),
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
};
console.log("Checking for auth page element:", selectors.pages.auth);