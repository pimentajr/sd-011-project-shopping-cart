const classOl = '.cart__items';

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getTotalPrice() {
  const totalPrice = document.querySelector('.total-price');
  let price = 0;
  const cartItems = document.querySelectorAll('li');
  cartItems.forEach((item) => {
    const product = item.innerText.split('$');
    price += Number(product[1]);
  });
  totalPrice.innerHTML = `${price}`;
}

function saveCart() {
  const cartItems = document.querySelector(classOl).innerHTML;
  localStorage.setItem('savedCart', cartItems);
}

function cartItemClickListener(event) {
  event.target.remove();
  getTotalPrice();
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchToCart(itemId) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const product = await response.json();
  const { id, title, price } = product;
  const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
  const cart = document.querySelector(classOl);
  cart.appendChild(cartItem);
  saveCart();
  getTotalPrice();
}

function addItemToCart(event) {
  const id = getSkuFromProductItem(event.target.parentElement);
  fetchToCart(id);
}

function buttonsAddEventListener() {
  document.querySelectorAll('.item__add').forEach((button) => button
    .addEventListener('click', addItemToCart));
}

function showLoading() {
  const loading = document.querySelector('.loading');
  loading.innerText = 'Loading :/';
}

function hideLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

async function fetchProducts(query) {
  showLoading();
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const json = await response.json(); 
  json.results.forEach((result) => {
    const { id, title, thumbnail } = result;
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items').appendChild(item);
  });
  hideLoading();
  buttonsAddEventListener();
}

function getCart() {
  const savedCart = localStorage.getItem('savedCart');
  const cart = document.querySelector(classOl);
  cart.innerHTML = savedCart;
  const items = document.querySelectorAll('li');
  items.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

function emptyCart() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    document.querySelector(classOl).innerHTML = '';
    localStorage.clear();
    getTotalPrice();
  });
}

window.onload = function onload() {
  fetchProducts('computador');
  emptyCart();
  getCart();
  getTotalPrice();
 };
