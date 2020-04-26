export default class OrderProduct {
    constructor(productId, price, modelName, quantity){
        this.productId = productId;
        this.price = price;
        this.modelName = modelName;
        this.quantity = quantity;
    }
    showProducts (product, element){
        product = document.createElement('p');
        product.innerHTML = '<b>Produkt: </b>' + this.modelName +'<br>' +
            '<b>Antal: </b>' + this.quantity + '<br>' +
            '<b>Pris pr. : </b>' + this.price;
        element.appendChild(product);
    }
}