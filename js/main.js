const catalogGrid = document.querySelector('#catalog-grid');
const catalogCount = document.querySelector('#catalog-count');
const cartList = document.querySelector('#cart-list');
const cartEmpty = document.querySelector('#cart-empty');
const cartSum = document.querySelector('#cart-sum');
const cartCount = document.querySelector('#cart-count');
const checkoutBtn = document.querySelector('#checkout-btn');
const orderMessage = document.querySelector('#order-message');
const orderDialog = document.querySelector('#order-dialog');
const orderForm = document.querySelector('#order-form');
const orderSummary = document.querySelector('#order-summary');
const closeBtn = document.querySelector('#close-btn');

function formatPrice(price) {
  return price.toLocaleString('ru-RU') + ' ₽';
}

function renderCatalog() {
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-cover">
        <img src="${product.image}" alt="Обложка: ${product.title}" width="200" height="300">
      </div>
      <div class="card-body">
        <p class="card-author">${product.author}</p>
        <h3 class="card-title">${product.title}</h3>
        <p class="card-price">${formatPrice(product.price)}</p>
        <button class="btn btn-outline card-btn" type="button" data-id="${product.id}">Добавить в корзину</button>
      </div>
    `;
    catalogGrid.append(card);
  });

  catalogCount.textContent = 'Книг: ' + products.length;
}

function renderCart() {
  cartList.innerHTML = '';

  cart.forEach((item) => {
    const product = findProduct(item.id);
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img class="cart-thumb" src="${product.image}" alt="Обложка: ${product.title}" width="44" height="66">
      <div class="cart-info">
        <p class="cart-name">${product.title}</p>
        <p class="cart-price">${formatPrice(product.price)} за шт.</p>
        <button class="remove-btn" type="button" data-action="remove" data-id="${product.id}">Удалить</button>
      </div>
      <div class="cart-controls">
        <button class="qty-btn" type="button" data-action="minus" data-id="${product.id}" aria-label="Уменьшить количество" ${item.qty === 1 ? 'disabled' : ''}>-</button>
        <span class="cart-qty">${item.qty}</span>
        <button class="qty-btn" type="button" data-action="plus" data-id="${product.id}" aria-label="Увеличить количество">+</button>
        <span class="cart-item-sum">${formatPrice(product.price * item.qty)}</span>
      </div>
    `;
    cartList.append(li);
  });

  cartEmpty.hidden = cart.length > 0;
  checkoutBtn.disabled = cart.length === 0;
  cartSum.textContent = formatPrice(getCartTotal());
  cartCount.textContent = getCartCount();
}

catalogGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.card-btn');
  if (!button) {
    return;
  }
  orderMessage.hidden = true;
  addToCart(Number(button.dataset.id));
  renderCart();
});

cartList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) {
    return;
  }
  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'plus') {
    changeQty(id, 1);
  } else if (action === 'minus') {
    changeQty(id, -1);
  } else if (action === 'remove') {
    removeFromCart(id);
  }
  renderCart();
});

checkoutBtn.addEventListener('click', () => {
  orderSummary.textContent = 'Книг в заказе: ' + getCartCount() + '. Сумма: ' + formatPrice(getCartTotal());
  orderDialog.showModal();
});

closeBtn.addEventListener('click', () => {
  orderDialog.close();
});

// клик мимо формы, то есть по затемненному фону
orderDialog.addEventListener('click', (event) => {
  if (event.target === orderDialog) {
    orderDialog.close();
  }
});

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearCart();
  renderCart();
  orderForm.reset();
  orderDialog.close();
  orderMessage.hidden = false;
});

renderCatalog();
renderCart();
