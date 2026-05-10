/* ============================
   PRODUCT DATA
============================ */
const PRODUCTS = {
    'W-CAMO': {
        name: 'white CAMO tee',
        price: 3300,
        priceDisplay: '3 300 DA',
        description: 'Limited edition camo print tee with oversized fit and screen printed graphics.',
        details: '100% heavyweight cotton — 250 GSM\nOversized fit\nScreen printed graphics\nWash inside out at 30°C',
        images: [
            'images/white-camo-front.png',
            'images/white-boxy-back.PNG',
            'images/white-boxy-detail.png'
        ],
        sizes: ['S', 'M', 'L', 'XL']
    },
    'B-CAMO': {
        name: 'BLACK CAMO',
        price: 3300,
        priceDisplay: '3 300 DA',
        description: 'Bold black camo tee with contrasting graphics. Made for the underground.',
        details: '100% heavyweight cotton — 250 GSM\nOversized fit\nScreen printed graphics\nWash inside out at 30°C',
        images: [
            'images/black-camo-front.png',
            'images/black-boxy-back.png',
            'images/black-boxy-detail.png'
        ],
        sizes: ['S', 'M', 'L', 'XL']
    },
    'WHITE-BASIC': {
        name: 'basic boxy fit white tee',
        price: 2999,
        priceDisplay: '2 999 DA',
        description: 'Essential boxy fit tee in crisp white. Pre-shrunk and reinforced for daily wear.',
        details: '100% combed ring-spun cotton — 250 GSM\nBoxy oversized fit\nReinforced collar and shoulder seams\nPre-shrunk fabric\nWash inside out at 30°C',
        images: [
            'images/white-boxy-front1.png',
            'images/white-boxy-back.png',
            'images/white-boxy-detail.png',
            'images/white-boxy-model1.png',
            'images/white-boxy-model2.png'
        ],
        sizes: ['S', 'M', 'L', 'XL']
    },
    'BLACK-BASIC': {
        name: 'basic boxy fit black tee',
        price: 2999,
        priceDisplay: '2 999 DA',
        description: 'Essential boxy fit tee in deep black. Pre-shrunk and reinforced for daily wear.',
        details: '100% combed ring-spun cotton — 250 GSM\nBoxy oversized fit\nReinforced collar and shoulder seams\nPre-shrunk fabric\nWash inside out at 30°C',
        images: [
            'images/black-boxy-front1.png',
            'images/black-boxy-back.png',
            'images/black-boxy-detail.png',
            'images/black-boxy-model1.png',
            'images/black-boxy-model2.png'
        ],
        sizes: ['S', 'M', 'L', 'XL']
    }
};

/* ============================
   PRODUCT PAGE STATE
============================ */
let currentProduct = null;
let selectedSize = null;
let activeImageIndex = 0;

/* ============================
   INIT PRODUCT PAGE
============================ */
document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    currentProduct = PRODUCTS[id];

    if (!currentProduct) {
        window.location.href = 'index.html';
        return;
    }

    document.title = 'HELLUCIGEN — ' + currentProduct.name.toUpperCase();
    renderProduct();
    setupZoom();
    setupAddToCart();
});

/* ============================
   RENDER PRODUCT
============================ */
function renderProduct() {
    const p = currentProduct;

    document.getElementById('pd-title').textContent = p.name;
    document.getElementById('pd-price').textContent = p.priceDisplay;
    document.getElementById('pd-desc').textContent = p.description;  // Fixed: now uses description

    // Details accordion
    const detailsEl = document.getElementById('pd-acc-details');
    detailsEl.innerHTML = p.details.split('\n').map(line => '<p>' + line + '</p>').join('');

    // Main image
    const mainImg = document.getElementById('pd-main-img');
    mainImg.src = p.images[0];
    mainImg.alt = p.name;

    // Thumbnails
    const thumbsEl = document.getElementById('pd-thumbs');
    thumbsEl.innerHTML = '';
    p.images.forEach(function (src, i) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = p.name;
        img.className = 'pd-thumb' + (i === 0 ? ' active' : '');
        img.onclick = function () { switchImage(i); };
        thumbsEl.appendChild(img);
    });

    // Size buttons
    const sizesEl = document.getElementById('pd-sizes');
    sizesEl.innerHTML = '';
    p.sizes.forEach(function (size) {
        const btn = document.createElement('button');
        btn.className = 'pd-size-btn';
        btn.textContent = size;
        btn.onclick = function () { selectSize(size, btn); };
        sizesEl.appendChild(btn);
    });
}

/* ============================
   SWITCH IMAGE
============================ */
function switchImage(index) {
    const p = currentProduct;
    activeImageIndex = index;

    const mainImg = document.getElementById('pd-main-img');
    mainImg.src = p.images[index];

    // Update thumbnails
    document.querySelectorAll('.pd-thumb').forEach(function (t, i) {
        t.classList.toggle('active', i === index);
    });

    // Reset zoom box background
    const zoomBox = document.getElementById('pd-zoom-box');
    zoomBox.style.backgroundImage = 'url(' + p.images[index] + ')';
}

/* ============================
   SELECT SIZE
============================ */
function selectSize(size, btn) {
    selectedSize = size;
    document.querySelectorAll('.pd-size-btn').forEach(function (b) {
        b.classList.remove('selected');
    });
    btn.classList.add('selected');
}

/* ============================
   ZOOM — cursor-following lens
============================ */
function setupZoom() {
    const wrap = document.getElementById('pd-main-wrap');
    const lens = document.getElementById('pd-zoom-lens');
    const zoomBox = document.getElementById('pd-zoom-box');
    const mainImg = document.getElementById('pd-main-img');

    const ZOOM = 3;

    wrap.addEventListener('mouseenter', function () {
        if (window.innerWidth <= 900) return;
        lens.style.display = 'block';
        zoomBox.style.display = 'block';
        zoomBox.style.backgroundImage = 'url(' + mainImg.src + ')';
    });

    wrap.addEventListener('mouseleave', function () {
        lens.style.display = 'none';
        zoomBox.style.display = 'none';
    });

    wrap.addEventListener('mousemove', function (e) {
        if (window.innerWidth <= 900) return;

        const rect = wrap.getBoundingClientRect();
        const lensW = lens.offsetWidth;
        const lensH = lens.offsetHeight;

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        x = Math.max(lensW / 2, Math.min(x, rect.width - lensW / 2));
        y = Math.max(lensH / 2, Math.min(y, rect.height - lensH / 2));

        lens.style.left = (x - lensW / 2) + 'px';
        lens.style.top  = (y - lensH / 2) + 'px';

        const boxLeft = rect.right + 12;
        const boxTop  = rect.top;
        zoomBox.style.left = boxLeft + 'px';
        zoomBox.style.top  = boxTop  + 'px';

        const zoomW = zoomBox.offsetWidth;
        const zoomH = zoomBox.offsetHeight;

        const bgX = (x * ZOOM) - (zoomW / 2);
        const bgY = (y * ZOOM) - (zoomH / 2);

        zoomBox.style.backgroundSize     = (rect.width * ZOOM) + 'px ' + (rect.height * ZOOM) + 'px';
        zoomBox.style.backgroundPosition = '-' + bgX + 'px -' + bgY + 'px';
    });
}

/* ============================
   ADD TO BAG FROM PRODUCT PAGE
============================ */
function setupAddToCart() {
    document.getElementById('pd-add-btn').addEventListener('click', function () {
        if (!selectedSize) {
            alert('Please select a size.');
            return;
        }

        const qty = parseInt(document.getElementById('pd-qty').value) || 1;
        const p = currentProduct;

        // Add to global cart (from script.js)
        if (typeof cart !== 'undefined') {
            cart.push({
                name: p.name,
                price: p.price,
                size: selectedSize,
                quantity: qty
            });
            saveCartToStorage();
            updateCart();

            document.getElementById('cart-panel').classList.add('active');
            document.getElementById('cart-overlay').classList.add('active');

            showNotification(selectedSize + ' — added to bag');
        } else {
            alert('Cart system not loaded. Please refresh the page.');
        }
    });
}

/* ============================
   ACCORDION TOGGLE
============================ */
function toggleAcc(btn) {
    const body = btn.nextElementSibling;
    const isOpen = body.classList.contains('open');

    // Close all
    document.querySelectorAll('.pd-acc-body').forEach(function (b) { b.classList.remove('open'); });
    document.querySelectorAll('.pd-acc-head').forEach(function (h) { h.classList.remove('open'); });

    // Open clicked if it was closed
    if (!isOpen) {
        body.classList.add('open');
        btn.classList.add('open');
    }
}