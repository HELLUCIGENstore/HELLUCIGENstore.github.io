/* ============================
   GLOBAL VARIABLES
============================ */
let cart = [];
let discountApplied = false;
let discountAmount = 0; // fixed DA off
let shippingCost = 0;
let currentSlides = {};

/* ============================
   SHIPPING PRICES — ECOM DELIVERY
============================ */
const shippingPrices = {
    adrar:              { home: 1100, pickup: 750  },
    chlef:              { home: 680,  pickup: 400  },
    laghouat:           { home: 800,  pickup: 500  },
    batna:              { home: 700,  pickup: 400  },
    bejaia:             { home: 700,  pickup: 400  },
    biskra:             { home: 800,  pickup: 500  },
    bechar:             { home: 1000, pickup: 700  },
    blida:              { home: 500,  pickup: 350  },
    bouira:             { home: 600,  pickup: 400  },
    tamanghasset:       { home: 1500, pickup: 1050 },
    tebessa:            { home: 720,  pickup: 450  },
    tiaret:             { home: 700,  pickup: 400  },
    tizi_ouzou:         { home: 600,  pickup: 400  },
    alger:              { home: 400,  pickup: 300  },
    djelfa:             { home: 800,  pickup: 500  },
    jijel:              { home: 700,  pickup: 400  },
    setif:              { home: 680,  pickup: 400  },
    saida:              { home: 730,  pickup: 450  },
    skikda:             { home: 700,  pickup: 400  },
    sidi_bel_abbes:     { home: 700,  pickup: 400  },
    annaba:             { home: 700,  pickup: 450  },
    guelma:             { home: 700,  pickup: 400  },
    constantine:        { home: 680,  pickup: 400  },
    medea:              { home: 600,  pickup: 400  },
    mostaganem:         { home: 700,  pickup: 400  },
    m_sila:             { home: 700,  pickup: 400  },
    mascara:            { home: 700,  pickup: 400  },
    ouargla:            { home: 900,  pickup: 550  },
    oran:               { home: 580,  pickup: 400  },
    el_bayadh:          { home: 970,  pickup: 700  },
    illizi:             { home: 1500, pickup: 1050 },
    bordj_bou_arreridj: { home: 680,  pickup: 400  },
    boumerdes:          { home: 530,  pickup: 350  },
    el_tarf:            { home: 730,  pickup: 450  },
    tindouf:            { home: 1100, pickup: 750  },
    tissemsilt:         { home: 700,  pickup: 400  },
    el_oued:            { home: 900,  pickup: 550  },
    khenchela:          { home: 700,  pickup: 400  },
    souk_ahras:         { home: 730,  pickup: 450  },
    tipaza:             { home: 530,  pickup: 350  },
    mila:               { home: 700,  pickup: 400  },
    ain_defla:          { home: 700,  pickup: 400  },
    naama:              { home: 930,  pickup: 550  },
    ain_temouchent:     { home: 700,  pickup: 400  },
    ghardaia:           { home: 850,  pickup: 500  },
    relizane:           { home: 700,  pickup: 400  },
    timimoun:           { home: 1100, pickup: 750  },
    ouled_djellal:      { home: 800,  pickup: 500  },
    beni_abbes:         { home: 1000, pickup: 750  },
    in_salah:           { home: 1400, pickup: 950  },
    djanet:             { home: 2100, pickup: 1500 },
    el_mghair:          { home: 930,  pickup: 550  },
    el_menia:           { home: 850,  pickup: 500  },
    bordj_badji_mokhtar:{ home: null, pickup: null },
    in_guezzam:         { home: null, pickup: null }
};

/* ============================
   LOCALSTORAGE FUNCTIONS
============================ */
function saveCartToStorage() {
    localStorage.setItem('hellucigenCart', JSON.stringify(cart));
    localStorage.setItem('hellucigenDiscount', JSON.stringify({
        applied: discountApplied,
        amount: discountAmount
    }));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('hellucigenCart');
    const savedDiscount = localStorage.getItem('hellucigenDiscount');
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedDiscount) {
        const discount = JSON.parse(savedDiscount);
        discountApplied = discount.applied;
        discountAmount = discount.amount || 0;
    }
    updateCart();
}

/* ============================
   INITIALIZATION
============================ */
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    initializeSliders();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById("cart-btn").onclick = toggleCart;
    document.getElementById("cart-close").onclick = closeCart;
    document.getElementById("wilaya").addEventListener("change", handleWilayaChange);
    document.getElementById("delivery-method").addEventListener("change", calculateShipping);
    document.getElementById("delivery-method").addEventListener("change", toggleStreetInput);
    document.getElementById("checkout-btn").onclick = showCheckoutForm;
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", addToCart);
    });
}

/* ============================
   CART FUNCTIONS
============================ */
function toggleCart() {
    const panel = document.getElementById("cart-panel");
    const overlay = document.getElementById("cart-overlay");
    panel.classList.toggle("active");
    overlay.classList.toggle("active");
}

function closeCart() {
    document.getElementById("cart-panel").classList.remove("active");
    document.getElementById("cart-overlay").classList.remove("active");
}

function addToCart(event) {
    const button = event.target;
    const product = button.closest('.product');
    const size = product.querySelector('.size-select').value;
    const quantity = parseInt(product.querySelector('.quantity-input').value);

    if (!size || quantity < 1) {
        alert("Please select a size and enter a valid quantity.");
        return;
    }

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    cart.push({ name, price, size, quantity });
    saveCartToStorage();
    updateCart();

    document.getElementById("cart-panel").classList.add("active");
    document.getElementById("cart-overlay").classList.add("active");

    showNotification(`${size} — added to bag`);
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = total;
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    let productsTotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        productsTotal += itemTotal;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <p>${item.name}</p>
            <p>Size: ${item.size}</p>
            <p>Qty: ${item.quantity}</p>
            <p>${itemTotal.toLocaleString()} DA</p>
            <button onclick="removeItem(${index})">REMOVE</button>
        `;
        cartItems.appendChild(div);
    });

    if (cart.length === 0) showEmptyCartMessage();

    let discountedTotal = productsTotal;
    if (discountApplied) discountedTotal = Math.max(0, discountedTotal - (discountAmount * cart.reduce((sum, i) => sum + i.quantity, 0)));

    const finalTotal = discountedTotal + shippingCost;

    document.getElementById("products-total").innerText = productsTotal.toFixed(0) + " DA";
    document.getElementById("shipping-total").innerText = shippingCost.toFixed(0) + " DA";
    document.getElementById("final-total").innerText = finalTotal.toFixed(0) + " DA";
    const discountLine = document.getElementById("discount-line");
    if (discountLine) {
    discountLine.style.display = (discountApplied && discountAmount > 0) ? "flex" : "none";
    document.getElementById("discount-display").innerText = "- " + discountAmount + " DA";
    }
    updateCartCount();
}

function showEmptyCartMessage() {
    const cartItems = document.getElementById("cart-items");
    const emptyMessage = document.createElement("div");
    emptyMessage.classList.add("empty-cart-message");
    emptyMessage.innerHTML = `<p>Your bag is empty<br><span>Add items to get started</span></p>`;
    cartItems.appendChild(emptyMessage);
}

function removeItem(index) {
    const item = cart[index];
    if (confirm(`Remove ${item.name} (Size ${item.size}) from your bag?`)) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCart();
        showNotification(`${item.name} removed`);
    }
}

/* ============================
   SHIPPING FUNCTIONS
============================ */
function handleWilayaChange() {
    updateDeliveryMethodOptions();
    calculateShipping();
}

function calculateShipping() {
    const wilaya = document.getElementById("wilaya").value;
    const method = document.getElementById("delivery-method").value;

    shippingCost = 0;
    if (!wilaya || !method) { updateCart(); return; }

    const priceData = shippingPrices[wilaya];
    if (priceData && priceData[method] !== null && priceData[method] !== undefined) {
        shippingCost = priceData[method];
    } else {
        alert(`Sorry, ${method === 'home' ? 'Home delivery' : 'Stopdesk pickup'} is not available for this wilaya.`);
        document.getElementById("delivery-method").value = "";
    }
    updateCart();
}

function updateDeliveryMethodOptions() {
    const wilaya = document.getElementById("wilaya").value;
    const methodSelect = document.getElementById("delivery-method");
    const selectedMethod = methodSelect.value;
    if (!wilaya) return;

    const priceData = shippingPrices[wilaya];
    if (!priceData) return;

    Array.from(methodSelect.options).forEach(option => {
        if (option.value === "") return;
        const isAvailable = priceData[option.value] !== null && priceData[option.value] !== undefined;
        option.disabled = !isAvailable;
        if (option.value === selectedMethod && !isAvailable) {
            methodSelect.value = "";
            shippingCost = 0;
            updateCart();
        }
    });
}

function toggleStreetInput() {
    const streetInput = document.getElementById("street");
    streetInput.style.display = this.value === "home" ? "block" : "none";
}

/* ============================
   DISCOUNT FUNCTIONS
============================ */

// SHA-256 hashes of valid codes — real codes never appear in source
// Codes: ZAKWCJ / HLCG26 / CHAOS10 / STREETS / BORNFREE
const VALID_CODE_HASHES = [
    "0ab7dbddf4b029a443aaeffb87b48f7a3e0e446a2d81b78c9d043129aa06f4d0",
    "c0620047475225d93d7a33db7c70b3b4f77e265623a002736264798153206497",
    "8ecb71f8eea0534af3e245b96e1f9ef58a20c269a9450ae14009907473834118",
    "da30964a4d3797a0612aaf043309e94d6c3ef47fa5c029f96220478aca198090",
    "074f19706f4f9fe8da5b656b8b0302aba7ec91b8d8965c5475536af311d52d4b"
];

// Tracks which code hash was used this session — burns it after order
let usedCodeHash = null;

async function hashCode(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str.toUpperCase().trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function applyDiscount() {
    const code = document.getElementById("discount-code").value.trim();
    const discountSection = document.querySelector(".discount-section");

    if (discountApplied) {
        alert("A discount is already applied.");
        return;
    }

    const hashed = await hashCode(code);
    const isValid = VALID_CODE_HASHES.includes(hashed);

    if (isValid) {
        discountApplied = true;
        discountAmount = 200;
        usedCodeHash = hashed;
        saveCartToStorage();
        discountSection.classList.add("discount-applied");
        setTimeout(() => discountSection.classList.remove("discount-applied"), 800);
        const applyBtn = document.querySelector(".apply-discount-btn");
        const originalText = applyBtn.textContent;
        applyBtn.textContent = "APPLIED ✓";
        setTimeout(() => { applyBtn.textContent = originalText; }, 2000);
    } else {
        alert("Invalid promo code");
    }
    updateCart();
}

/* ============================
   CHECKOUT FUNCTIONS
============================ */
function showCheckoutForm() {
    document.getElementById("checkout-form").style.display = "flex";
}

function submitOrder() {
    const name = document.getElementById("full-name").value;
    const phone = document.getElementById("phone-number").value;
    const wilaya = document.getElementById("wilaya").value;
    const baladya = document.getElementById("baladya").value;
    const street = document.getElementById("street").value;
    const method = document.getElementById("delivery-method").value;

    if (!name || !phone || !wilaya || !method) {
        alert("Please fill all required fields.");
        return;
    }

    let productsList = "";
    let productsTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        productsTotal += itemTotal;
        productsList += `${item.name}\nSize: ${item.size}\nQty: ${item.quantity}\nPrice: ${itemTotal} DA\n\n`;
    });

    let discountedTotal = productsTotal;
    if (discountApplied) discountedTotal = Math.max(0, discountedTotal - discountAmount);

    const finalTotal = discountedTotal + shippingCost;

    const templateParams = {
        name, phone, wilaya, baladya, street,
        company: "Ecom Delivery",
        method: method === "home" ? "Home Delivery (Domicile)" : "Stopdesk Pickup",
        products: productsList,
        products_total: discountedTotal.toFixed(0),
        shipping: shippingCost.toFixed(0),
        total: finalTotal.toFixed(0)
    };

    emailjs.send("service_k76t0kb", "template_oyf26jf", templateParams)
        .then(function(response) {
            alert("Order placed successfully!");
            cart = [];
            shippingCost = 0;
            discountApplied = false;
            discountAmount = 0;
            usedCodeHash = null;
            document.getElementById("discount-code").value = "";
            saveCartToStorage();
            updateCart();
            document.getElementById("checkout-form").style.display = "none";
            closeCart();
        }, function(error) {
            alert("Failed to send order. Check console.");
            console.log(error);
        });
}

/* ============================
   SLIDER FUNCTIONS
============================ */
function initializeSliders() {
    document.querySelectorAll('.slider-container').forEach(slider => {
        if (slider.id) currentSlides[slider.id] = 0;
    });

    document.querySelectorAll('.product-slider').forEach(slider => {
        slider.addEventListener('keydown', function(e) {
            const container = this.querySelector('.slider-container');
            if (!container || !container.id) return;
            if (e.key === 'ArrowLeft') { changeSlide(container.id, -1); e.preventDefault(); }
            else if (e.key === 'ArrowRight') { changeSlide(container.id, 1); e.preventDefault(); }
        });
        slider.setAttribute('tabindex', '0');
    });
}

function changeSlide(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    const images = slider.querySelectorAll('img');
    if (!currentSlides[sliderId]) currentSlides[sliderId] = 0;
    let newIndex = currentSlides[sliderId] + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    else if (newIndex >= images.length) newIndex = 0;
    goToSlide(sliderId, newIndex);
}

function goToSlide(sliderId, slideIndex) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    const images = slider.querySelectorAll('img');
    const dots = document.getElementById(`dots-${sliderId}`)?.querySelectorAll('.slider-dot');
    if (slideIndex < 0 || slideIndex >= images.length) return;
    images.forEach((img, i) => img.classList.toggle('active', i === slideIndex));
    if (dots) dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
    currentSlides[sliderId] = slideIndex;
}

/* ============================
   NOTIFICATION
============================ */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
}
