const olClass = '.cart__items';

const sumItems = () => {
  const ol = document.querySelector(olClass);
  const olChildren = [...ol.children];
  const priceTotal = olChildren.reduce((acc, li) => {
    let acumulador = acc;
    acumulador += Number(li.innerText.split('$')[1]);
    return acumulador;
  }, 0);
  return priceTotal;
};

const pullDiv = () => {
  const div = document.querySelector('.total-price');
  div.innerText = `${Math.round(sumItems() * 100) / 100}`;
};

const saveStorage = () => {
  const olItems = document.querySelector(olClass);
  const html = olItems.innerHTML;
  localStorage.setItem('lista', html);
};

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
 event.target.remove();
 saveStorage();
 pullDiv();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendData = (results) => {
  results.forEach((result) => {
   const createProduct = createProductItemElement(result);
   const sectionItem = document.querySelector('.items');
   sectionItem.appendChild(createProduct);
  });
};

const fetchMl = (item) => {
  const loading = document.querySelector('.loading');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
  .then((response) => {
    response.json()
      .then((data) => {
        appendData(data.results);
        loading.remove();
      });
  });
};

const fetchMlID = (event) => {
  const elementPai = event.target.parentElement;
  const getID = getSkuFromProductItem(elementPai);
  fetch(`https://api.mercadolibre.com/items/${getID}`)
  .then((response) => {
    response.json()
      .then((data) => {
        const liItemCart = createCartItemElement(data);
        const olItems = document.querySelector('.cart__items');
        olItems.appendChild(liItemCart);
        saveStorage();
        pullDiv();
      });
  });
};

const buttonAddCart = () => {
  const sectionItem = document.querySelector('.items');
  sectionItem.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      fetchMlID(event);
    }
  });
};

const getItemSave = () => {
  const olItems = document.querySelector(olClass);
  olItems.innerHTML = localStorage.getItem('lista');
  olItems.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
};

const esvaziarCartBtn = () => {
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    const olItems = document.querySelector(olClass);
    olItems.innerHTML = '';
    localStorage.removeItem('lista');
    const totalPrice = document.querySelector('.total-price');
    totalPrice.innerText = 0;
  });
};

window.onload = () => { 
  fetchMl('computador');
  buttonAddCart();
  getItemSave();
  pullDiv();
  esvaziarCartBtn();
};
