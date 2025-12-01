import {cart, removeFromCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from '../scripts/utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions} from '../data/deliveryOptions.js';

hello();

let ordersHTML = ``;

cart.forEach((item) => {
  let itemName = ``;
  let itemImg = ``;
  let itemPrice = 0;

  products.forEach((product) => {
    if (product.id === item.productId) {
      itemName = product.name;
      itemImg = product.image;
      itemPrice = product.priceCents;
    }
  });

  // ✔ Correct property
  const deliveryOptionId = item.deliveryOptionId;

  // Find the correct delivery option
  const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);

  // If still undefined, crash happens — so guard it
  if (!deliveryOption) {
    console.error("No matching delivery option for item:", item);
    return; // prevents crash
  }

  const deliveryDate = dayjs().add(deliveryOption.deliveryDays, 'days');
  const dateString = deliveryDate.format('dddd, MMMM, D');

  ordersHTML += `
    <div class="cart-item-container js-cart-item-container-${item.productId}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${itemImg}">

        <div class="cart-item-details">
          <div class="product-name">
            ${itemName}
          </div>
          <div class="product-price">
            $${(formatCurrency(itemPrice) * item.quantity).toFixed(2)}
          </div>

          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${item.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link"
              data-product-id="${item.productId}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(item)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(item) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const deliveryDate = dayjs().add(
      deliveryOption.deliveryDays,
      'days'
    );

    const dateString = deliveryDate.format(
      'dddd, MMMM, D'
    );

    const priceString =
      deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)}`;

    const isChecked =
      deliveryOption.id === item.deliveryOptionId;

    html += `
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${item.productId}"
          value="${deliveryOption.id}"
          ${isChecked ? 'checked' : ''}>
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div>
    `;
  });

  return html;
}

document.querySelector('.order-summary').innerHTML = ordersHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    container.remove();
  });
});
