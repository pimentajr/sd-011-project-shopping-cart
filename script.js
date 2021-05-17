const cartItems = '.cart__items';
let totalPrice = 0;

function saveCart() {
  localStorage.savedCart = document.querySelector(cartItems).innerHTML;
}

function loadCart() {
  if (localStorage.savedCart) {
    document.querySelector(cartItems).innerHTML = localStorage.savedCart;
  }
}

function removeAllItems() {
  document.querySelectorAll('.cart__item').forEach((value) => {
    value.remove();
  });
  saveCart();
  document.querySelector('.total-price').innerText = sumTotalPrice();
} 

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

function createProductItemElement(sku, name, image) {
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

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  document.querySelector('.total-price').innerText = sumTotalPrice();
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function fetchItems() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json()).then((data) => {
    data.results.forEach((value) => {
      const item = createProductItemElement(value.id, value.title, value.thumbnail);
      document.querySelector('.items').appendChild(item);
    });
  });
}

function fetchItemToCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((data) => {
    const liCart = createCartItemElement(data.id, data.title, data.price);
    document.querySelector(cartItems).appendChild(liCart);
    saveCart();
    document.querySelector('.total-price').innerText = sumTotalPrice();
  });
}

function sumTotalPrice() {
  totalPrice = 0;
  document.querySelectorAll('.cart__item').forEach((value, index) => { 
    let number = parseInt(value.innerText.split('|')[2].replace(/[^0-9]/g,''));
    totalPrice += number;
  })
  return `Total: R$ ${totalPrice}`;
}

window.onload = function onload() {
  loadCart();
  fetchItems();
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const itemEvent = event.target.parentNode.firstChild.innerText;
      fetchItemToCart(itemEvent);
    }
  });
  document.querySelector('.empty-cart').addEventListener('click', removeAllItems);
  document.querySelector(cartItems).addEventListener('click', cartItemClickListener);
  document.querySelector('.total-price').innerText = sumTotalPrice();
};
