const cartItems = document.querySelector('.cart__items');
const allitemsPrice = document.querySelector('.total-price');
const cart = document.querySelector('.cart');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function cartItemClickListener(event, price) {
  cartItems.removeChild(event.target);
  allitemsPrice.innerText = parseFloat(Number(allitemsPrice.innerText) - price);
}

function createCartItemElement({ id: sku, title: name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  localStorage.setItem(`Produto${cartItems.childElementCount}`, `${sku}|${name}|${price}`);
  li.addEventListener('click', (event) => cartItemClickListener(event, price));
  allitemsPrice.innerText = parseFloat(Number(allitemsPrice.innerText) + price);
  return li;
}

function createProductList() {
  const sectionItems = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((json) => {
    json.results.forEach((result) => {
      sectionItems.appendChild(createProductItemElement(result));
    });
  })
  .then(() => {
    cart.removeChild(document.querySelector('.loading'));
    for (let index = 0; index < localStorage.length; index += 1) {
      const [id, title, price] = localStorage.getItem(`Produto${index}`).split('|');
      const result2 = { id, title, price };
      cartItems.appendChild(createCartItemElement(result2));
    }
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addProduct(event) {
  if (event.target.className === 'item__add') {
    const itemID = getSkuFromProductItem(event.target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((json) => {
      const itemsList = document.querySelector('.cart__items');
      itemsList.appendChild(createCartItemElement(json));
    });
  }
}

window.onload = function onload() {
  createProductList();
  const items = document.querySelector('.items');
  items.addEventListener('click', addProduct);
  const eraseButton = document.querySelector('.empty-cart');
  eraseButton.addEventListener('click', () => {
    cartItems.innerHTML = '';
    allitemsPrice.innerText = '0';
    localStorage.clear();
  });
};