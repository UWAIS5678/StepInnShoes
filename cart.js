document.addEventListener('DOMContentLoaded', () => {
  // ==== CART SETUP ====
  const cartToggle = document.getElementById('cart-toggle');
  const cartPanel = document.getElementById('cartPanel');
  const cartItemsContainer = document.getElementById('cartItems');
  const totalPriceEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cart-count');
  const closeCartBtn = document.getElementById('closeCart');
  const checkoutBtn = document.getElementById('checkout-btn');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // ==== SAVE + RENDER CART ====
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }

  function renderCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>R${item.price.toFixed(2)}</p>
          ${item.size ? `<p>Size: ${item.size}</p>` : ''}
          ${item.color ? `<p>Color: ${item.color}</p>` : ''}
          <div class="quantity-controls">
            <button class="decrease" data-id="${item.id}" data-size="${item.size || ''}" data-color="${item.color || ''}">−</button>
            <span class="quantity">${item.quantity}</span>
            <button class="increase" data-id="${item.id}" data-size="${item.size || ''}" data-color="${item.color || ''}">+</button>
          </div>
        </div>
        <button class="remove-btn" data-id="${item.id}" data-size="${item.size || ''}" data-color="${item.color || ''}">✕</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalPriceEl.textContent = `Total: R${total.toFixed(2)}`;
    cartCountEl.textContent = count;
  }

  // ==== ENABLE ADD BUTTONS ON DROPDOWNS ====
  document.body.addEventListener('change', e => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    const addBtn = card.querySelector('.btn-add');
    const sizeSelect = card.querySelector('.size-select');
    const colorSelect = card.querySelector('.color-select');

    const sizeOk = sizeSelect ? sizeSelect.value : true;
    const colorOk = colorSelect ? colorSelect.value : true;

    addBtn.disabled = !(sizeOk && colorOk);
  });

  // ==== ADD TO CART ====
  document.body.addEventListener('click', e => {
    if (!e.target.classList.contains('btn-add')) return;
    e.stopPropagation();

    const productCard = e.target.closest('.product-card');
    if (!productCard) return;

    const product = {
      id: productCard.dataset.id.toString(),
      name: productCard.querySelector('h3').textContent,
      price: parseFloat(productCard.querySelector('p').textContent.replace('R', '')),
      image: productCard.querySelector('img').src,
      quantity: 1,
      size: productCard.querySelector('.size-select') ? productCard.querySelector('.size-select').value : null,
      color: productCard.querySelector('.color-select') ? productCard.querySelector('.color-select').value : null
    };

    const existing = cart.find(
      p => p.id === product.id && p.size === product.size && p.color === product.color
    );

    if (existing) existing.quantity++;
    else cart.push(product);

    saveCart();
  });

  // ==== CART BUTTONS ====
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      e.stopPropagation();

      const id = btn.dataset.id;
      const size = btn.dataset.size || null;
      const color = btn.dataset.color || null;

      const itemIndex = cart.findIndex(p => p.id === id && p.size === size && p.color === color);
      if (itemIndex === -1) return;

      if (btn.classList.contains('increase')) {
        cart[itemIndex].quantity++;
      } else if (btn.classList.contains('decrease')) {
        cart[itemIndex].quantity--;
        if (cart[itemIndex].quantity <= 0) {
          cart.splice(itemIndex, 1);
        }
      } else if (btn.classList.contains('remove-btn')) {
        cart.splice(itemIndex, 1);
      }

      saveCart();
    });
  }

  // ==== TOGGLE CART PANEL ====
  if (cartToggle) {
    cartToggle.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const isShown = cartPanel.classList.toggle('show');

      // Hide cart toggle when cart is open, show when closed
      cartToggle.style.display = isShown ? 'none' : 'flex';
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', e => {
      e.stopPropagation();
      cartPanel.classList.remove('show');
      cartToggle.style.display = 'flex'; // Show cart toggle again on close
    });
  }

  // Stop clicks inside the cart from closing it
  if (cartPanel) {
    cartPanel.addEventListener('click', e => e.stopPropagation());
  }

  // Close on outside click
  document.addEventListener('click', e => {
    if (!cartPanel.contains(e.target) && !cartToggle.contains(e.target)) {
      cartPanel.classList.remove('show');
      cartToggle.style.display = 'flex'; // Show cart toggle again on outside click close
    }
  });

  // ==== CHECKOUT ====
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return alert('Your cart is empty!');

      let message = 'Hello! I want to order the following products:%0A';
      cart.forEach(item => {
        message += `• ${item.name}`;
        if (item.size) message += ` (Size: ${item.size})`;
        if (item.color) message += ` (Color: ${item.color})`;
        message += ` x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}%0A`;
      });

      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      message += `%0ATotal: R${total.toFixed(2)}`;

      const phoneNumber = '27621886345'; // replace with your WhatsApp number
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappURL, '_blank');
    });
  }

  // ==== INITIAL RENDER ====
  renderCart();
});
