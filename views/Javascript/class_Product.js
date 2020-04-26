export default class Product {
    constructor(productId, price, modelName, modelDescription, quantity, imageSRC) {
        this.productId = productId;
        this.price = price;
        this.modelName = modelName;
        this.modelDescription = modelDescription;
        this.quantity = quantity;
        this.imageSRC = imageSRC;
    }
}