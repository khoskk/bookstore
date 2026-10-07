const catalogGrid = document.querySelector('#catalog-grid');
const catalogCount = document.querySelector('#catalog-count');

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

renderCatalog();
