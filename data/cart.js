

export const cart = [
  
];


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
        quantity: 1
      });
    }
}