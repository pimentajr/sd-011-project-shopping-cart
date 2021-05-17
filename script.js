function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

let itemsList;
function updateVar() {
  itemsList = document.querySelector('.cart__items');
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

function productML() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => {
      json.results.forEach((result) => {
        const sectionItems = document.querySelector('.items');
        sectionItems.appendChild(createProductItemElement(result));
      });
    });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function listStore() {
  window.localStorage.myList = itemsList.innerHTML;
}

function cartItemClickListener(event) {
  itemsList.removeChild(event.target);
  listStore();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductToCart(event) {
  if (event.target.className === 'item__add') {
    const itemID = getSkuFromProductItem(event.target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
      .then((response) => response.json())
      .then((json) => {
        itemsList.appendChild(createCartItemElement(json));
        listStore();
      });
  }
}

function getListCart() {
  const list = document.querySelector('.cart__items');
  const { myList } = window.localStorage;

  if (!myList) list.innerHTML = '';
  else list.innerHTML = myList;
}

function removeList() {
  const li = document.querySelectorAll('.cart__item');
  li.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() {
  productML();
  const items = document.querySelector('.items');
  items.addEventListener('click', addProductToCart);
  getListCart();
  removeList();
  updateVar();
};