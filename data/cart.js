import {products} from './products.js';

export let cart = JSON.parse(localStorage.getItem('cart'));
if (!cart) {
  cart = [];
}


export function getCartQuantity(){
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity
  });
  return cartQuantity;
}

function getItemPrice(productId) {
  for (let product of products) {
    if (product.id === productId) {
      return product.priceCents;
    }
  }
  return 0; // fallback
}


export function getCartTotalPrice(){
  let cartTotalPrice = 0;

  cart.forEach((item) => {
    cartTotalPrice += item.quantity * getItemPrice(item.productId);
  });
  
  //console.log(cartTotalPrice);

  return cartTotalPrice;
}


function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function addToCart(productId){
    let matchingItem;
    cart.forEach((product) => {
      if(productId === product.productId){
        matchingItem = product;
      }
    });
    if(matchingItem){
      matchingItem.quantity +=1;
    }else{
      cart.push({
        productId: productId,
        quantity: 1,
        deliveryOptionId: '1'
      });
    }

    saveToStorage();
}

export function removeFromCart(productId){
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((product) => {
    if(productId === product.productId){
      matchingItem = product;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

export function getTotalShippingAndHandling(){
  let totalShippingAndHandling = 0;
  cart.forEach((item) => {
    if (item.deliveryOptionId === '2'){
      totalShippingAndHandling += 499;
    } else if (item.deliveryOptionId === '3'){
      totalShippingAndHandling += 999
    }
  });
  return totalShippingAndHandling;
}