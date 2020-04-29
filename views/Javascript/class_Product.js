export default class Product {
    constructor(productId, price, modelName, modelDescription, quantity, imageSRC) {
        this.productId = productId;
        this.price = price;
        this.modelName = modelName;
        this.modelDescription = modelDescription;
        this.quantity = quantity;
        this.imageSRC = imageSRC;
    }

    generateProduct(clonedElement, i) {
        var container = document.getElementById(clonedElement);
        var clone = container.cloneNode(true);
        //MM: Gives each product clone its own id
        clone.id = "modelContainer" + i;
        //MM: Makes each product clone visible
        clone.style.display = "initial";
        //MM: Inserts each product clone onto the "productContainer" node
        document.getElementById(clonedElement).parentElement.appendChild(clone);
        //MM: The following lines insert the fetched product information onto each clone
        //MM: Inserts product title
        document.getElementById(clonedElement + i).getElementsByTagName('div')[0].getElementsByTagName("h2")[0].innerHTML = this.modelName;
        //MM: Inserts product photo source
        document.getElementById(clonedElement + i).getElementsByTagName('div')[1].getElementsByTagName('img')[0].src = this.imageSRC;
        //MM: Inserts product description
        document.getElementById(clonedElement + i).getElementsByTagName('div')[2].getElementsByTagName('p')[0].innerHTML = this.modelDescription;
        //MM: Inserts maximum amount of available products. It cycles through the product quantity and creates the amount of select options needed.
        var selectElement = document.getElementById(clonedElement + i).getElementsByTagName('div')[2].getElementsByTagName('select')[0];
        for (let x = 0; x < this.quantity; x++) {
            selectElement.options[selectElement.options.length] = new Option([x + 1], [x + 1]);
        }
    }
}