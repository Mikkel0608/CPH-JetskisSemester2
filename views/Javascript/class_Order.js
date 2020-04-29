
export default class Order {
    constructor(products, orderDay, orderMonth, orderYear, timePeriod, orderPrice, orderId, userId, order_placed_at) {
        this.products = products;
        this.orderDay = orderDay;
        this.orderMonth = orderMonth;
        this.orderYear = orderYear;
        this.timePeriod = timePeriod;
        this.orderPrice = orderPrice;
        this.orderId = orderId;
        this.userId = userId;
        this.order_placed_at = order_placed_at;
    }
    showOrder (element){
        element.appendChild(document.createElement('hr'));
        var orderEl = document.createElement("P");
        orderEl.innerHTML = "<b> Ordre ID: </b>" + this.orderId + "</b></br></br><b> Bruger ID</b>: "
            + this.userId +  "</br></br><b>Dato for udlejning: </b>" + this.orderDay
            + "/" + this.orderMonth + "/" + this.orderYear + "</br></br>"
            + "<b>Tidspunkt for udlejning: kl. </b>" + this.timePeriod + "</br></br>"
            + "<b>Pris total: </b> " + this.orderPrice
            + "</br></br> <b> Ordre lavet d. : </b>" + this.order_placed_at;
        element.appendChild(orderEl);

        var product = null;
        this.products.forEach((item)=>{
            item.showProducts(product, element);
            /*product = document.createElement('p');
            product.innerHTML = '<b>Produkt: </b>' + item.modelName +'<br>' +
                '<b>Antal: </b>' + item.quantity + '<br>' +
                '<b>Pris pr. : </b>' + item.price;
            element.appendChild(product);

             */

        });
        element.appendChild(document.createElement('hr'));
    }
    deleteOrder(selection){
        fetch(`http://localhost:3000/profile/orders/${this.orderId}`, {
            method: 'DELETE'
        }).then(response => response.json())
            .then(json => {
                if (json === 'ok') {
                    for (let i = 0; i < selection.length; i++) {
                        if (selection[i].value === this.orderId) {
                            selection.remove(i);
                            break;
                        }
                    }
                }
            })
    }
    createOrder() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost:3000/orderPage/submitOrder', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(this));
        window.location = "http://localhost:3000/orderconfirmation.html";
    }
}