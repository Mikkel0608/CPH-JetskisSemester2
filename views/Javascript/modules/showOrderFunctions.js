function getOrderId(path, node) {
    removeNode(node);
    fetch(path)
        .then(response => response.json())
        .then(json => {

            var orderArray = json;
            for (var i = 0; i < orderArray.length; i++) {
                var orderId = new Option(`Ordre ${orderArray[i].orderid}`, orderArray[i].orderid);
                document.getElementById("orderId").appendChild(orderId);
            }
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

                var orderInfo = json;
                console.log(orderInfo);

                        var day = orderInfo.orderday;
                        var month = orderInfo.ordermonth;
                        var year = orderInfo.orderyear;
                        var timePeriod = orderInfo.timeperiod;
                        var orderPrice = orderInfo.orderprice;
                        var orderID = orderInfo.orderid;
                        var userID = orderInfo.userid;
                        var orderDate = orderInfo.order_placed_at;

                        var order = document.createElement("P");
                        order.innerHTML = "<b> Ordre ID: </b>" + orderID + "</b></br></br><b> Bruger ID</b>: " + userID +  "</br></br><b>Dato for udlejning: </b>" + day + "/" + month + "/" + year + "</br></br>" + "<b>Tidspunkt for udlejning: kl. </b>" + timePeriod + "</br></br>" /*+ product + "</br></br"*/ + "<b>Pris total: </b> " + orderPrice + "</br></br> <b> Ordre lavet d. : </b>" + orderDate;
                        node.appendChild(order);

                        var product = null;
                        for (let i=0; i<orderInfo.products.length; i++){
                            product = document.createElement('p');
                            product.innerHTML = '<b>Produkt: </b>' + orderInfo.products[i].modelname +'<br>' +
                                '<b>Antal: </b>' + orderInfo.products[i].count + '<br>' +
                                '<b>Pris: </b>' + orderInfo.products[i].price * orderInfo.products[i].count;
                            node.appendChild(product);
                        }
            });
}

export {getOrderId, removeNode, showOrder};




