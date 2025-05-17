class CartItem {
    constructor(id, cart_id, food_item, quantity, price) {
      this.id = id;
      this.cart_id = cart_id;
      this.food_item = food_item;
      this.quantity = quantity;
      this.price = price;
    }
  }
  
  module.exports = CartItem;
  