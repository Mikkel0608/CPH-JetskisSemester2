export default class Product {
    constructor(productId, price, modelName, modelDescription, maxAmount, imageSRC) {
        this.productId = productId;
        this.price = price;
        this.modelName = modelName;
        this.modelDescription = modelDescription;
        this.maxAmount = maxAmount;
        this.imageSRC = imageSRC;
    }
}