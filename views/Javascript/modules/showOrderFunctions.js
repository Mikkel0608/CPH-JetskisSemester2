import Order from "../class_Order.js";
import OrderProduct from "../class_OrderProduct.js";
function getOrderId(path, node) {
    removeNode(node);
    fetch(path)
        .then(response => response.json())
        .then(json => {
            var orderArray = json;
            orderArray.forEach((item) => {
                var orderId = new Option(`Ordre ${item.orderid}`, item.orderid);
                document.getElementById("orderId").appendChild(orderId);
            })
            /*
            for (var i = 0; i < orderArray.length; i++) {
                var orderId = new Option(`Ordre ${orderArray[i].orderid}`, orderArray[i].orderid);
                document.getElementById("orderId").appendChild(orderId);
            }
             */
        })
}

function removeNode (node){
    while (node.firstChild){
        node.removeChild(node.lastChild);
    }
}

function showOrder(path, node){
    //while-loop that removes the existing nodes in the orderList div
    //Using a while loop since the amount of iterations can differ
        removeNode(node);

        fetch(path)
            .then(response => response.json())
            .then(json => {
                var orderProducts = [];
                json.products.forEach((item)=>{
                    var orderProduct = new OrderProduct(item.productId, item.price, item.modelname, parseInt(item.count));
                    orderProducts.push(orderProduct);
                });
                var order = new Order(orderProducts, json.orderday, json.ordermonth, json.orderyear, json.timeperiod,
                            json.orderprice, json.orderid, json.userid, json.order_placed_at);
                console.log(order);

                order.showOrder(node);
/*
                        var day = orderInfo.orderday;
                        var month = orderInfo.ordermonth;
                        var year = orderInfo.orderyear;
                        var timePeriod = orderInfo.timeperiod;
                        var orderPrice = orderInfo.orderprice;
                        var orderID = orderInfo.orderid;
                        var userID = orderInfo.userid;
                        var orderDate = orderInfo.order_placed_at;

 */
/*
                        var orderEl = document.createElement("P");
                        orderEl.innerHTML = "<b> Ordre ID: </b>" + order.orderId + "</b></br></br><b> Bruger ID</b>: "
                                            + order.userId +  "</br></br><b>Dato for udlejning: </b>" + order.orderDay
                                            + "/" + order.orderMonth + "/" + order.orderYear + "</br></br>"
                                            + "<b>Tidspunkt for udlejning: kl. </b>" + order.timePeriod + "</br></br>"
                                            + "<b>Pris total: </b> " + order.orderPrice
                                            + "</br></br> <b> Ordre lavet d. : </b>" + order.order_placed_at;
                        node.appendChild(orderEl);

                        var product = null;
                        order.products.forEach((item)=>{
                            product = document.createElement('p');
                            product.innerHTML = '<b>Produkt: </b>' + item.modelname +'<br>' +
                                '<b>Antal: </b>' + item.count + '<br>' +
                                '<b>Pris: </b>' + item.price * item.count;
                            node.appendChild(product);

 */

                        /*
                        for (let i=0; i<orderInfo.products.length; i++){
                            product = document.createElement('p');
                            product.innerHTML = '<b>Produkt: </b>' + orderInfo.products[i].modelname +'<br>' +
                                '<b>Antal: </b>' + orderInfo.products[i].count + '<br>' +
                                '<b>Pris: </b>' + orderInfo.products[i].price * orderInfo.products[i].count;
                            node.appendChild(product);
                        }
                        */
            });
}

export {getOrderId, removeNode, showOrder};




