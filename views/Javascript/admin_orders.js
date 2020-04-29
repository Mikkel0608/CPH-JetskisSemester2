import {removeNode, showOrder} from "./modules/showOrderFunctions.js";
import Order from "./class_Order.js";
import OrderProduct from "./class_OrderProduct.js";

//Html elements
const sortBtn = document.getElementById('sortBtn');
const sort = document.getElementById('sort');
const searchBtn = document.getElementById('searchBtn');
const search = document.getElementById('search');
const node = document.getElementById("orderList");

//Setting the values of the options in the select menu
const datE = document.getElementById('date');
datE.value = 1;
const id = document.getElementById('id');
id.value = 2;
const price = document.getElementById('price');
price.value = 3;


//onclick function that makes a get request for all orders depending on a specific sorting criteria.
//The function creates Orderproduct objects as well as order objects. The showOrder method is then called on all the
//order objects, so the orders will get displayed on the site.
sortBtn.onclick = () => {
    fetch(`/adminpage/allOrders/${sort.value}`, {
        method: 'GET',
    }).then(response => response.json())
        .then(json => {
            console.log(json);
            var orders = json;
            removeNode(node);
            let i;
            for (i = 0; i < orders.length; i++) {
                var orderProducts = [];
                orders[i].products.forEach((item)=>{
                    var orderProduct = new OrderProduct(item.productId, item.price, item.modelname, item.count);
                    orderProducts.push(orderProduct);
                });
                var order = new Order(orderProducts, orders[i].orderday, orders[i].ordermonth, orders[i].orderyear, orders[i].timeperiod,
                    orders[i].orderprice, orders[i].orderid, orders[i].userid, orders[i].order_placed_at);
                order.showOrder(node);
/*
                var day = fetchedOrders[i].orderday;
                var month = fetchedOrders[i].ordermonth;
                var year = fetchedOrders[i].orderyear;
                var timePeriod = fetchedOrders[i].timeperiod;
                var orderPrice = fetchedOrders[i].orderprice;
                var orderID = fetchedOrders[i].orderid;
                var userID = fetchedOrders[i].userid;
                var orderDate = fetchedOrders[i].order_placed_at;
                var orderProducts = fetchedOrders[i].products;

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

 */
/*
                var product = null;
                for (let x = 0; x < order.products.length; x++) {
                    console.log(orders[i].products);
                    product = document.createElement('p');
                    product.innerHTML = '<b>Produkt: </b>' + order.products[x].modelName + '<br>' +
                        '<b>Antal: </b>' + order.products[x].count + '<br>' +
                        '<b>Pris: </b>' + order.products[x].price * order.products[x].count;
                    node.appendChild(product);



                }
                */
/*
                var product = null;
                order.products.forEach((item)=>{
                    product = document.createElement('p');
                    product.innerHTML = '<b>Produkt: </b>' + item.modelname +'<br>' +
                        '<b>Antal: </b>' + item.count + '<br>' +
                        '<b>Pris: </b>' + item.price * item.count;
                    node.appendChild(product);

                });
                var separator = document.createElement('hr');
                node.appendChild(separator);

 */
            }
        })
};

//Function that makes a request for an endpoint with an order Id as a route parameter.
//The function makes sure that the search contains a value of type number.
searchBtn.onclick = ()=>{
    if(isNaN(parseInt(search.value))){
           alert("Søg efter ordre-id'et")
    } else {
        showOrder(`/profile/ordersbyorderid/${parseInt(search.value)}`, node);
    }
};







