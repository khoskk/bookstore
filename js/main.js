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

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  el.className = className;
  if (text !== undefined) {
    el.textContent = text;
  }
  return el;
}

function createImage(product, width, height) {
  const img = document.createElement('img');
  img.src = product.image;
  img.alt = 'Обложка: ' + product.title;
  img.width = width;
  img.height = height;
  return img;
}

function createCartButton(className, action, id, text) {
  const button = createEl('button', className, text);
  button.type = 'button';
  button.dataset.action = action;
  button.dataset.id = id;
  return button;
}

function renderCatalog() {
  products.forEach((product) => {
    const cover = createEl('div', 'card-cover');
    cover.append(createImage(product, 200, 300));

    const button = createEl('button', 'btn btn-outline card-btn', 'Добавить в корзину');
    button.type = 'button';
    button.dataset.id = product.id;

    const body = createEl('div', 'card-body');
    body.append(
      createEl('p', 'card-author', product.author),
      createEl('h3', 'card-title', product.title),
      createEl('p', 'card-price', formatPrice(product.price)),
      button
    );

    const card = createEl('article', 'card');
    card.append(cover, body);
    catalogGrid.append(card);
  });

  catalogCount.textContent = 'Книг: ' + products.length;
}

function renderCart() {
  cartList.textContent = '';

  cart.forEach((item) => {
    const product = findProduct(item.id);

    const info = createEl('div', 'cart-info');
    info.append(
      createEl('p', 'cart-name', product.title),
      createEl('p', 'cart-price', formatPrice(product.price) + ' за шт.'),
      createCartButton('remove-btn', 'remove', product.id, 'Удалить')
    );

    const minus = createCartButton('qty-btn', 'minus', product.id, '-');
    minus.title = 'Уменьшить количество';
    minus.disabled = item.qty === 1;

    const plus = createCartButton('qty-btn', 'plus', product.id, '+');
    plus.title = 'Увеличить количество';

    const controls = createEl('div', 'cart-controls');
    controls.append(
      minus,
      createEl('span', 'cart-qty', item.qty),
      plus,
      createEl('span', 'cart-item-sum', formatPrice(product.price * item.qty))
    );

    const thumb = createImage(product, 44, 66);
    thumb.className = 'cart-thumb';

    const li = createEl('li', 'cart-item');
    li.append(thumb, info, controls);
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
