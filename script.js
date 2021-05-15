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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// requisito 5 - Antes de todos por causa da função sumPrices

const sumPrices = () => {
  const totalPrice = document.querySelector('.total-price');
  const getList = [...document.querySelectorAll('.cart__item')];
  totalPrice.innerText = 0;
  const sum = getList.reduce((accumulator, currentValue) =>
  accumulator + Number(currentValue.innerText.split('PRICE: $')[1]), 0);
 totalPrice.innerText = sum;
};

// requisito 3 - ficou após o 5 por causa do sumPrices

function cartItemClickListener(event) {
  event.target.remove();
  sumPrices();
}

// requisito 2
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
}

const getItem = () => {
  const elementFather = document.querySelector('.cart__items');
  const button = document.querySelectorAll('.item__add');
  button.forEach((element) => element.addEventListener('click', () => {
    const id = element.parentElement.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((data) => elementFather.appendChild(createCartItemElement(data)))
      .then(() => sumPrices());
  }));
}; 

// requisito 1 - após o requisito 2 por causa da função getItem

const list = () => {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  
  fetch(api, myObject)
    .then((response) => response.json())
    .then((data) => data.results
    .forEach(({ id, title, thumbnail }) => {
      const section = document.querySelector('.items');
      const listObject = createProductItemElement({ sku: id, name: title, image: thumbnail });
      section.appendChild(listObject);
    })).then(() => getItem());
};

// requisito 6

const deleteCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });
};

// requisito 7

const loadShop = async (computador) => {
  const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`);
  const data = await api.json();
  document.querySelector('.loading').remove();
  data.results.forEach((value) => createProductItemElement(value));
};

window.onload = function onload() {
  loadShop();
  list();
  deleteCart();
};
