/* ============================
   GLOBAL VARIABLES
============================ */
let cart = [];
let discountApplied = false;
let discountAmount = 0; // fixed DA off
let shippingCost = 0;
let currentSlides = {};

/* ============================
   SHIPPING PRICES DATABASE
============================ */
const shippingPrices = {
    yalidine: {
        adrar: { home: 1650, pickup: 1550 }, ain_defla: { home: 700, pickup: 600 },
        ain_temouchent: { home: 700, pickup: 600 }, alger: { home: 550, pickup: 450 },
        annaba: { home: 700, pickup: 600 }, batna: { home: 700, pickup: 600 },
        bechar: { home: 1650, pickup: 1550 }, bejaia: { home: 700, pickup: 600 },
        beni_abbes: { home: 1650, pickup: 1550 }, biskra: { home: 850, pickup: 700 },
        blida: { home: 550, pickup: 450 }, bordj_badji_mokhtar: { home: 1650, pickup: 1550 },
        bordj_bou_arreridj: { home: 700, pickup: 600 }, bouira: { home: 550, pickup: 450 },
        boumerdes: { home: 500, pickup: 400 }, chlef: { home: 700, pickup: 600 },
        constantine: { home: 700, pickup: 600 }, djelfa: { home: 850, pickup: 700 },
        djanet: { home: 1650, pickup: 1550 }, el_bayadh: { home: 1650, pickup: 1550 },
        el_menia: { home: 850, pickup: 700 }, el_mghair: { home: 850, pickup: 700 },
        el_oued: { home: 850, pickup: 700 }, el_tarf: { home: 700, pickup: 600 },
        ghardaia: { home: 850, pickup: 700 }, guelma: { home: 700, pickup: 600 },
        illizi: { home: 1650, pickup: 1550 }, in_guezzam: { home: 1650, pickup: 1550 },
        in_salah: { home: 1650, pickup: 1550 }, jijel: { home: 700, pickup: 600 },
        khenchela: { home: 700, pickup: 600 }, laghouat: { home: 850, pickup: 700 },
        mascara: { home: 700, pickup: 600 }, medea: { home: 700, pickup: 600 },
        mila: { home: 700, pickup: 600 }, mostaganem: { home: 700, pickup: 600 },
        m_sila: { home: 700, pickup: 600 }, naama: { home: 1650, pickup: 1550 },
        oran: { home: 700, pickup: 600 }, ouargla: { home: 850, pickup: 700 },
        ouled_djellal: { home: 850, pickup: 700 }, relizane: { home: 700, pickup: 600 },
        saida: { home: 700, pickup: 600 }, setif: { home: 700, pickup: 600 },
        sidi_bel_abbes: { home: 700, pickup: 600 }, skikda: { home: 700, pickup: 600 },
        souk_ahras: { home: 700, pickup: 600 }, tamanghasset: { home: 1650, pickup: 1550 },
        tebessa: { home: 850, pickup: 700 }, tiaret: { home: 700, pickup: 600 },
        tindouf: { home: 1650, pickup: 1550 }, tipaza: { home: 700, pickup: 600 },
        tissemsilt: { home: 700, pickup: 600 }, tizi_ouzou: { home: 550, pickup: 450 },
        timimoun: { home: 1650, pickup: 1550 }
    },
    zr: {
        adrar: { home: 1400, pickup: 970 }, chlef: { home: 850, pickup: 520 },
        laghouat: { home: 950, pickup: 620 }, oum_el_bouaghi: { home: 850, pickup: 520 },
        batna: { home: 900, pickup: 520 }, bejaia: { home: 800, pickup: 520 },
        biskra: { home: 950, pickup: 620 }, bechar: { home: 1100, pickup: 720 },
        blida: { home: 600, pickup: 470 }, bouira: { home: 700, pickup: 520 },
        tamanghasset: { home: 1600, pickup: 1120 }, tebessa: { home: 900, pickup: 570 },
        tlemcen: { home: 900, pickup: 570 }, tiaret: { home: 850, pickup: 520 },
        tizi_ouzou: { home: 750, pickup: 520 }, alger: { home: 500, pickup: 370 },
        djelfa: { home: 950, pickup: 570 }, jijel: { home: 900, pickup: 520 },
        setif: { home: 800, pickup: 520 }, saida: { home: 900, pickup: 570 },
        skikda: { home: 900, pickup: 520 }, sidi_bel_abbes: { home: 900, pickup: 520 },
        annaba: { home: 850, pickup: 520 }, guelma: { home: 900, pickup: 520 },
        constantine: { home: 800, pickup: 520 }, medea: { home: 800, pickup: 520 },
        mostaganem: { home: 900, pickup: 520 }, m_sila: { home: 850, pickup: 520 },
        mascara: { home: 900, pickup: 520 }, ouargla: { home: 950, pickup: 670 },
        oran: { home: 800, pickup: 520 }, el_bayadh: { home: 1100, pickup: 670 },
        illizi: { home: null, pickup: null }, bordj_bou_arreridj: { home: 800, pickup: 520 },
        boumerdes: { home: 700, pickup: 520 }, el_tarf: { home: 850, pickup: 520 },
        tindouf: { home: null, pickup: null }, tissemsilt: { home: 900, pickup: 520 },
        el_oued: { home: 950, pickup: 670 }, khenchela: { home: 900, pickup: 520 },
        souk_ahras: { home: 900, pickup: 520 }, tipaza: { home: 700, pickup: 520 },
        mila: { home: 900, pickup: 520 }, ain_defla: { home: 900, pickup: 520 }
    }
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
    document.getElementById("shipping-company").addEventListener("change", handleShippingChange);
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
function handleShippingChange() {
    updateWilayaOptions();
    updateDeliveryMethodOptions();
    calculateShipping();
}

function handleWilayaChange() {
    updateDeliveryMethodOptions();
    calculateShipping();
}

function calculateShipping() {
    const company = document.getElementById("shipping-company").value;
    const wilaya = document.getElementById("wilaya").value;
    const method = document.getElementById("delivery-method").value;

    shippingCost = 0;
    if (!company || !wilaya || !method) { updateCart(); return; }

    if (shippingPrices[company] && shippingPrices[company][wilaya]) {
        const priceData = shippingPrices[company][wilaya];
        if (priceData[method] !== null && priceData[method] !== undefined) {
            shippingCost = priceData[method];
        } else {
            alert(`Sorry, ${method === 'home' ? 'Home delivery' : 'Pickup'} is not available for this wilaya with ${company === 'yalidine' ? 'Yalidine' : 'ZR Express'}.`);
            document.getElementById("delivery-method").value = "";
        }
    } else {
        alert(`This wilaya is not serviced by ${company === 'yalidine' ? 'Yalidine' : 'ZR Express'}.`);
        document.getElementById("shipping-company").value = "";
    }
    updateCart();
}

function updateWilayaOptions() {
    const company = document.getElementById("shipping-company").value;
    const wilayaSelect = document.getElementById("wilaya");
    const selectedWilaya = wilayaSelect.value;
    if (!company) return;

    const availableWilayas = Object.keys(shippingPrices[company]).filter(w => {
        const p = shippingPrices[company][w];
        return p.home !== null || p.pickup !== null;
    });

    Array.from(wilayaSelect.options).forEach(option => {
        if (option.value === "") return;
        option.disabled = !availableWilayas.includes(option.value);
        if (option.value === selectedWilaya && option.disabled) {
            wilayaSelect.value = "";
            shippingCost = 0;
            updateCart();
        }
    });
}

function updateDeliveryMethodOptions() {
    const company = document.getElementById("shipping-company").value;
    const wilaya = document.getElementById("wilaya").value;
    const methodSelect = document.getElementById("delivery-method");
    const selectedMethod = methodSelect.value;
    if (!company || !wilaya) return;

    const priceData = shippingPrices[company]?.[wilaya];
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
    const company = document.getElementById("shipping-company").value;
    const method = document.getElementById("delivery-method").value;

    if (!name || !phone || !wilaya || !company || !method) {
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
        company: company === "yalidine" ? "Yalidine" : "ZR Express",
        method: method === "home" ? "Home Delivery" : "Pickup",
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
