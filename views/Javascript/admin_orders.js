import {removeNode, showOrder} from "./modules/showOrderFunctions.js";

const sortBtn = document.getElementById('sortBtn');
const sort = document.getElementById('sort');
const searchBtn = document.getElementById('searchBtn');
const search = document.getElementById('search');
const node = document.getElementById("orderList");


const datE = document.getElementById('date');
datE.value = 1;
const id = document.getElementById('id');
id.value = 2;
const price = document.getElementById('price');
price.value = 3;


sortBtn.onclick = () => {
    fetch(`/adminpage/allOrders/${sort.value}`, {
        method: 'GET',
    }).then(response => response.json())
        .then(json => {
            console.log(json);
            var fetchedOrders = json;
            removeNode(node);
            for (let i = 0; i < fetchedOrders.length; i++) {

                var day = fetchedOrders[i].orderday;
                var month = fetchedOrders[i].ordermonth;
                var year = fetchedOrders[i].orderyear;
                var timePeriod = fetchedOrders[i].timeperiod;
                var orderPrice = fetchedOrders[i].orderprice;
                var orderID = fetchedOrders[i].orderid;
                var userID = fetchedOrders[i].userid;
                var orderDate = fetchedOrders[i].order_placed_at;
                var orderProducts = fetchedOrders[i].products;

                var order = document.createElement("P");
                order.innerHTML = "<b> Ordre ID: " + orderID + "</b></br></br><b> Bruger ID</b>: " + userID +  "</br></br><b>Dato for udlejning: </b>" + day + "/" + month + "/" + year + "</br></br>" + "<b>Tidspunkt for udlejning: kl. </b>" + timePeriod + "</br></br>" /*+ product + "</br></br"*/ + "<b>Pris total: </b> " + orderPrice + "</br></br> <b> Ordre lavet d. : </b>" + orderDate;
                node.appendChild(order);

                var product = null;
                for (let x = 0; x < orderProducts.length; x++) {
                    product = document.createElement('p');
                    product.innerHTML = '<b>Produkt: </b>' + orderProducts[x].modelname + '<br>' +
                        '<b>Antal: </b>' + orderProducts[x].count + '<br>' +
                        '<b>Pris: </b>' + orderProducts[x].price * orderProducts[x].count;
                    node.appendChild(product);
                }
                var separator = document.createElement('hr');
                node.appendChild(separator);
            }
        })
};


searchBtn.onclick = ()=>{
    if(isNaN(parseInt(search.value))){
           alert("Søg efter ordre-id'et")
    } else {
        showOrder(`/profile/ordersbyorderid/${parseInt(search.value)}`, node);
    }
};







