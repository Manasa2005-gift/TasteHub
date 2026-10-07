const STORAGE_KEY = "tastehubCart";
const DELIVERY_CHARGE = 40;

const menuItems = [
    { id: 1, name: "Veg Biryani", category: "Biryani", price: 180, description: "Flavorful rice with fresh vegetables and aromatic spices.", emoji: "🍛" },
    { id: 2, name: "Paneer Butter Masala", category: "Main Course", price: 220, description: "Soft paneer cooked in a rich and creamy tomato gravy.", emoji: "🥘" },
    { id: 3, name: "Chicken Biryani", category: "Biryani", price: 250, description: "Aromatic basmati rice served with delicious spicy chicken.", emoji: "🍗" },
    { id: 4, name: "Masala Dosa", category: "Starters", price: 140, description: "Golden crispy dosa filled with a flavorful potato masala.", emoji: "🥞" },
    { id: 5, name: "Butter Naan", category: "Main Course", price: 80, description: "Soft, fluffy naan brushed with butter and served hot.", emoji: "🫓" },
    { id: 6, name: "Gulab Jamun", category: "Desserts", price: 90, description: "Soft milk dumplings soaked in warm saffron syrup.", emoji: "🍮" },
    { id: 7, name: "Veg Pulao", category: "Main Course", price: 170, description: "Aromatic rice with vegetables and fragrant herbs.", emoji: "🥗" },
    { id: 8, name: "Paneer Tikka", category: "Starters", price: 210, description: "Smoky grilled cottage cheese cubes with tangy marinade.", emoji: "🍢" },
    { id: 9, name: "Mango Lassi", category: "Drinks", price: 120, description: "Refreshing yogurt-based drink blended with ripe mango.", emoji: "🥭" },
    { id: 10, name: "Cold Coffee", category: "Drinks", price: 110, description: "Chilled coffee blended to perfection with creamy texture.", emoji: "☕" },
    { id: 11, name: "Samosa", category: "Starters", price: 60, description: "Crispy pastry pockets with spiced potato filling.", emoji: "🥟" },
    { id: 12, name: "Chocolate Brownie", category: "Desserts", price: 130, description: "Rich, fudgy brownie with a deep chocolate taste.", emoji: "🍫" }
];

let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let activeCategory = "All";
let currentSearch = "";

function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function showMessage(message, type = "success") {
    const messageElement = document.getElementById("order-message");
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
}

function calculateTotal() {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryCharge = cart.length > 0 ? DELIVERY_CHARGE : 0;
    const grandTotal = subtotal + deliveryCharge;

    return { subtotal, deliveryCharge, grandTotal };
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function renderMenu() {
    const menuElement = document.getElementById("menu-items");
    if (!menuElement) return;

    const filteredItems = menuItems.filter((item) => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(currentSearch) || item.description.toLowerCase().includes(currentSearch);
        return matchesCategory && matchesSearch;
    });

    if (filteredItems.length === 0) {
        menuElement.innerHTML = "<p class='no-results'>No dishes match your search.</p>";
        return;
    }

    menuElement.innerHTML = filteredItems.map((item) => `
        <article class="food-card">
            <div class="food-image" aria-label="${item.name}">${item.emoji}</div>
            <div class="food-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="food-bottom">
                    <strong>₹${item.price}</strong>
                    <button type="button" class="add-to-cart" data-id="${item.id}">Add to Cart</button>
                </div>
            </div>
        </article>
    `).join("");
}

function searchFood() {
    const searchInput = document.getElementById("search-input");
    currentSearch = searchInput.value.trim().toLowerCase();
    renderMenu();
}

function filterCategory(category) {
    activeCategory = category;

    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach((button) => {
        button.classList.toggle("active", button.dataset.category === category);
    });

    renderMenu();
}

function addToCart(itemId) {
    const item = menuItems.find((product) => product.id === itemId);
    if (!item) return;

    const existingItem = cart.find((cartItem) => cartItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: item.id, name: item.name, price: item.price, quantity: 1 });
    }

    saveCart();
    updateCart();
    showMessage(`${item.name} added to cart.`, "success");
}

function updateCart() {
    const cartItemsElement = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const deliveryChargeElement = document.getElementById("delivery-charge");
    const grandTotalElement = document.getElementById("grand-total");

    if (!cartItemsElement || !subtotalElement || !deliveryChargeElement || !grandTotalElement) return;

    const { subtotal, deliveryCharge, grandTotal } = calculateTotal();

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    } else {
        cartItemsElement.innerHTML = cart.map((item) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                </div>

                <div class="cart-item-controls">
                    <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>

                <div class="cart-item-price">
                    <strong>₹${item.price * item.quantity}</strong>
                    <button type="button" class="remove-btn" data-action="remove" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join("");
    }

    subtotalElement.textContent = subtotal;
    deliveryChargeElement.textContent = deliveryCharge;
    grandTotalElement.textContent = grandTotal;
    updateCartCount();
    saveCart();
}

function increaseQuantity(itemId) {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    if (!item) return;

    item.quantity += 1;
    updateCart();
}

function decreaseQuantity(itemId) {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    if (!item) return;

    item.quantity -= 1;

    if (item.quantity <= 0) {
        cart = cart.filter((cartItem) => cartItem.id !== itemId);
    }

    updateCart();
}

function removeFromCart(itemId) {
    cart = cart.filter((cartItem) => cartItem.id !== itemId);
    updateCart();
}

function checkout(event) {
    event.preventDefault();

    const form = event.target;
    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const paymentMethod = form.querySelector('input[name="payment"]:checked');

    if (cart.length === 0) {
        showMessage("Your cart is empty. Add items before checkout.", "error");
        return;
    }

    if (!name || !address || !phone || !paymentMethod) {
        showMessage("Please complete all checkout fields before placing the order.", "error");
        return;
    }

    if (!/^[A-Za-z\s]{2,}$/.test(name)) {
        showMessage("Please enter a valid name with at least 2 letters.", "error");
        return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        showMessage("Please enter a valid 10-digit Indian phone number.", "error");
        return;
    }

    if (address.length < 10) {
        showMessage("Please enter a complete delivery address.", "error");
        return;
    }

    const orderId = `TH${Math.floor(10000 + Math.random() * 90000)}`;
    const { grandTotal } = calculateTotal();
    const orderItems = cart.map((item) => `${item.name} x ${item.quantity}`).join(", ");

    document.getElementById("order-confirmation").innerHTML = `
        <h3>Order Confirmed</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Items:</strong> ${orderItems}</p>
        <p><strong>Total:</strong> ₹${grandTotal}</p>
        <p><strong>Delivery:</strong> Your order will be delivered in approximately 30–40 minutes.</p>
    `;
    document.getElementById("order-confirmation").classList.remove("hidden");
    showMessage(`Order placed successfully! Thank you for ordering from TasteHub.`, "success");

    cart = [];
    form.reset();
    updateCart();
    saveCart();
}

function initializeContactForm() {
    const contactForm = document.getElementById("contact-form");
    const contactStatus = document.getElementById("contact-status");

    if (!contactForm || !contactStatus) return;

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const message = document.getElementById("contact-message").value.trim();

        if (!name || !email || !message) {
            contactStatus.textContent = "Please fill in all contact form fields.";
            contactStatus.className = "message error";
            return;
        }

        contactStatus.textContent = "Thank you for contacting TasteHub! We will get back to you soon.";
        contactStatus.className = "message success";
        contactForm.reset();
    });
}

function initializeEvents() {
    const searchInput = document.getElementById("search-input");
    const cartButton = document.getElementById("cart-button");
    const checkoutForm = document.getElementById("checkout-form");
    const menuElement = document.getElementById("menu-items");
    const cartItemsElement = document.getElementById("cart-items");

    if (searchInput) {
        searchInput.addEventListener("input", searchFood);
    }

    document.querySelectorAll(".filter-btn").forEach((button) => {
        button.addEventListener("click", () => filterCategory(button.dataset.category));
    });

    if (cartButton) {
        cartButton.addEventListener("click", () => {
            document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", checkout);
    }

    if (menuElement) {
        menuElement.addEventListener("click", (event) => {
            const button = event.target.closest(".add-to-cart");
            if (!button) return;
            addToCart(Number(button.dataset.id));
        });
    }

    if (cartItemsElement) {
        cartItemsElement.addEventListener("click", (event) => {
            const button = event.target.closest("[data-action]");
            if (!button) return;

            const itemId = Number(button.dataset.id);
            const action = button.dataset.action;

            if (action === "increase") {
                increaseQuantity(itemId);
            } else if (action === "decrease") {
                decreaseQuantity(itemId);
            } else if (action === "remove") {
                removeFromCart(itemId);
            }
        });
    }

    initializeContactForm();
}

renderMenu();
updateCart();
initializeEvents();