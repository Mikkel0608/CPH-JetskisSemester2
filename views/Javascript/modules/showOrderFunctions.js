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

function showOrder(path, select, node){
    //while-loop that removes the existing nodes in the orderList div
    //Using a while loop since the amount of iterations can differ
    if (select.value === '0'){
        alert(`Vælg venligst et ordre ID i menuen`)
    } else {
        removeNode(node);

        fetch(path)
            .then(response => response.json())
            .then(json => {
                var orderInfo = json;
                console.log(orderInfo);

                var i;
                for (i = 0; i < orderInfo.length; i++) {
                    if (select.value == orderInfo[i].orderid) {
                        var day = orderInfo[i].orderday;
                        var month = orderInfo[i].ordermonth;
                        var year = orderInfo[i].orderyear;
                        var timePeriod = orderInfo[i].timeperiod;
                        var orderPrice = orderInfo[i].orderprice;
                        var orderID = orderInfo[i].orderid;
                        var orderDate = orderInfo[i].order_placed_at;
                        var product = null;

                        var order = document.createElement("P");
                        order.innerHTML = "<b>Dato for udlejning: </b>" + day + "/" + month + "/" + year + "</br></br>" + "<b>Tidspunkt for udlejning: kl. </b>" + timePeriod + "</br></br>" /*+ product + "</br></br"*/ + "<b>Pris total: </b> " + orderPrice + "</br></br> <b>Ordre ID: </b>  " + orderID + "</br></br> <b> Ordre lavet d. : </b>" + orderDate;
                        node.appendChild(order);
                    }
                }
                fetch(`/profile/orderproduct/${select.value}`)
                    .then(response => response.json())
                    .then(json => {
                        console.log(json);
                        for (let X = 0; X < json.length; X++) {
                            product = document.createElement('p');
                            product.innerHTML = '<b>Produkt: </b>' + json[X].modelname + '<br>' +
                                '<b>Antal: </b>' + json[X].count + '<br>' +
                                '<b>Pris: </b>' + json[X].price * json[X].count;
                            node.appendChild(product);
                        }
                    });
            });
    }
}

export {getOrderId, removeNode, showOrder};




