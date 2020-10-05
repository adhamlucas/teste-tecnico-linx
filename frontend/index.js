/* global document, fetch */
const url = 'http://localhost:3001/showcases';

const MAX_PRODUCT = '16';

const transictionToRight = (event, row) => {
  event.preventDefault();
  let leftMargin = row.style.marginLeft.match(/\d+/);
  if (leftMargin === null) {
    row.style.marginLeft = '-1200px';
    return;
  }
  leftMargin = parseInt(leftMargin[0], 10);
  const newMarginLeft = (leftMargin + 1200) < (MAX_PRODUCT * 300)
    ? (leftMargin + 1200) : -leftMargin;
  row.style.marginLeft = `-${newMarginLeft}px`;
};

const transictionToLeft = (event, row) => {
  event.preventDefault();
  let leftMargin = row.style.marginLeft.match(/\d+/);
  if (leftMargin === null) {
    return;
  }
  leftMargin = parseInt(leftMargin[0], 10);
  const newMarginLeft = (-leftMargin + 1200) < 0 ? (-leftMargin + 1200) : 0;
  row.style.marginLeft = `${newMarginLeft}px`;
};

const popularRightButton = document.getElementById('popular-right-button');
const popularLeftButton = document.getElementById('popular-left-button');
const popularCarouselRow = document.getElementById('popular-carousel-row');
popularRightButton.addEventListener('click', (event) => transictionToRight(event, popularCarouselRow));
popularLeftButton.addEventListener('click', (event) => transictionToLeft(event, popularCarouselRow));

const priceReductionRightButton = document.getElementById('price-reduction-right-button');
const priceReductionLeftButton = document.getElementById('price-reduction-left-button');
const priceReductionRow = document.getElementById('price-reduction-carousel-row');
priceReductionRightButton.addEventListener('click', (event) => transictionToRight(event, priceReductionRow));
priceReductionLeftButton.addEventListener('click', (event) => transictionToLeft(event, priceReductionRow));


// popularLeftButton.addEventListener('click', )


const getShowCases = async (maxProduct) => {
  const response = await fetch(`${url}?max_product=${maxProduct}`);
  if (response.ok) {
    const data = await response.json();
    return (data);
  }
  console.error(`HTTP-Error: ${response.status}`);
};

const limitDescriptionProduct = (name) => {
  if (name.length > 60) {
    return (`${name.slice(0, 57)}...`);
  }
  return name;
};

const createPopularBadge = (index) => {
  const popularBox = document.createElement('div');
  popularBox.className = 'most-popular-box';
  const square = document.createElement('div');
  square.className = 'most-popular-square';
  const triangule = document.createElement('div');
  triangule.className = 'most-popular-triangule';
  const number = document.createElement('p');
  number.className = 'most-popular-index';
  number.innerHTML = `${index + 1}°`;
  popularBox.appendChild(square);
  popularBox.appendChild(triangule);
  popularBox.appendChild(number);

  return popularBox;
};

const createProductCard = ({
  name, images, oldPrice, price,
}, showCase, index) => {
  const product = document.createElement('div');
  product.className = 'product';

  if (showCase === 'price') {
    const priceReductionBox = document.createElement('div');
    priceReductionBox.className = 'price-reduction-box';
    const priceReductionPercent = parseInt(((1 - (parseFloat(price) / parseFloat(oldPrice))) * 100), 10);
    priceReductionBox.innerHTML = `-${priceReductionPercent}%`;
    product.appendChild(priceReductionBox);
  } else if (showCase === 'popular') {
    product.appendChild(createPopularBadge(index));
  }

  const imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';
  const img = document.createElement('img');
  img.src = `http:${images.default}`;
  imageContainer.appendChild(img);

  const description = document.createElement('p');
  description.className = 'description';
  description.innerHTML = limitDescriptionProduct(name);

  const oldPriceElement = document.createElement('p');
  oldPriceElement.className = 'old-price';
  const oldPriceFormated = parseFloat(oldPrice).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  oldPriceElement.innerHTML = `<s>R$ ${oldPriceFormated}<s>`;

  const actualPriceContainer = document.createElement('div');
  actualPriceContainer.className = 'actual-price-container';
  const actualPricePreposition = document.createElement('p');
  actualPricePreposition.className = 'actual-price-preposition';
  actualPricePreposition.innerHTML = 'Por ';
  const actualPriceValue = document.createElement('p');
  actualPriceValue.className = 'actual-price-value';
  const actualPriceFormated = parseFloat(price).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  actualPriceValue.innerHTML = `R$ ${actualPriceFormated}`;
  actualPriceContainer.appendChild(actualPricePreposition);
  actualPriceContainer.appendChild(actualPriceValue);

  const parceledPriceContainer = document.createElement('div');
  parceledPriceContainer.className = 'parceled-price-container';
  const parceledPricePrepostion = document.createElement('p');
  parceledPricePrepostion.className = 'parceled-price-preposition';
  parceledPricePrepostion.innerHTML = '10x ';
  const parceledPriceValue = document.createElement('p');
  parceledPriceValue.className = 'parceled-price-value';
  const parceledPriceValueFormated = (price / 10).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  parceledPriceValue.innerHTML = `R$ ${parceledPriceValueFormated}`;
  parceledPriceContainer.appendChild(parceledPricePrepostion);
  parceledPriceContainer.appendChild(parceledPriceValue);

  product.appendChild(imageContainer);
  product.appendChild(description);
  product.appendChild(oldPriceElement);
  product.appendChild(actualPriceContainer);
  product.appendChild(parceledPriceContainer);

  return product;
};

const main = async () => {
  const { mostPopular, priceReduction } = await getShowCases(MAX_PRODUCT);
  const popularCarouselRow = document.getElementById('popular-carousel-row');
  const priceReductionCarouselRow = document.getElementById('price-reduction-carousel-row');

  mostPopular.map((item, index) => {
    popularCarouselRow.appendChild(createProductCard(item, 'popular', index));
  });

  priceReduction.map((item) => {
    priceReductionCarouselRow.appendChild(createProductCard(item, 'price'));
  });
};

main();
