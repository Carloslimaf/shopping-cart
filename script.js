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

function cartItemClickListener() {
  // coloque seu código aqui
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
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
  .then((response) => {
    response.json()
      .then((data) => appendData(data.results));
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

window.onload = () => { 
  fetchMl('computador');
  buttonAddCart();
};
