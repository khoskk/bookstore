const storageKey = 'paragraf-cart';

let cart = loadCart();

function findProduct(id) {
  return products.find((product) => product.id === id);
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!Array.isArray(saved)) {
      return [];
    }
    return saved.filter((item) => findProduct(item.id) && Number.isInteger(item.qty) && item.qty > 0);
  } catch (error) {
    // в localStorage битые данные, начинаем с пустой корзины
    return [];
  }
}

function saveCart() {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function addToCart(id) {
  const found = cart.find((item) => item.id === id);
  if (found) {
    found.qty++;
  } else {
    cart.push({ id: id, qty: 1 });
  }
  saveCart();
}

function changeQty(id, delta) {
  const found = cart.find((item) => item.id === id);
  found.qty = Math.max(1, found.qty + delta);
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
}

function clearCart() {
  cart = [];
  localStorage.removeItem(storageKey);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + findProduct(item.id).price * item.qty, 0);
}
