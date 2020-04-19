var idSelect = document.getElementById("phoneSelect");
window.onload = function getUsers () {

    fetch('/adminpage/allusers')
        .then(response =>
            response.json())
        .then(json => {
            console.log(json);

            for (let i=0; i < json.length; i++){
                if (json[i].userid !== null || undefined) {
                    var option = document.createElement("option");
                    option.innerHTML = json[i].userid;

                    document.getElementById("phoneSelect").appendChild(option);
                }
            }
        })
};

const selection = document.getElementById("orderId");
const nodes = document.getElementById('orderList');

const showInfoBtn = document.getElementById('showInfo');
showInfoBtn.onclick=()=>{
    showInfo();
};
function showInfo (){
    fetch('/adminpage/allusers')
        .then(response =>
            response.json())
        .then(json => {

            for (let i = 0; i < json.length; i++) {
                if (idSelect.value == json[i].userid) {
                    document.getElementById("userid").innerHTML = json[i].userid;
                    document.getElementById("type").innerHTML = json[i].type;
                    document.getElementById("customerName").innerHTML = json[i].username;
                    document.getElementById("customerStreetName").innerHTML = json[i].streetname;
                    document.getElementById("customerStreetNumber").innerHTML = json[i].streetnumber;
                    document.getElementById("customerPostalCode").innerHTML = json[i].postalcode;
                    document.getElementById("customerCity").innerHTML = json[i].city;
                    document.getElementById("customerPhone").innerHTML = json[i].phone;
                    document.getElementById("customerEmail").innerHTML = json[i].email;
                    document.getElementById("created_at").innerHTML = json[i].created_at;
                }
            }
            getOrderId(`/adminpage/ordersByUser/${idSelect.value}`);
            removeNode(nodes);
        });
}

function removeNode (node){
    while (node.firstChild){
        node.removeChild(node.lastChild);
    }
}

function getOrderId(path) {
    removeNode(selection);
    fetch(path)
        .then(response => response.json())
        .then(json => {

            var orderArray = json;
            for (var i = 0; i < orderArray.length; i++) {
                var orderId = document.createElement("option");
                orderId.innerHTML = orderArray[i].orderid;
                document.getElementById("orderId").appendChild(orderId);
            }
        })
}

const showOrderBtn = document.getElementById('showOrder');
showOrderBtn.onclick=()=>{
    showOrder();
};
function showOrder(){
    //while-loop that removes the existing nodes in the orderList div
    //Using a while loop since the amount of iterations can differ
    if (selection.value === '0'){
        alert(`Vælg venligst et ordre ID i menuen`)
    } else {
        removeNode(nodes);

        fetch(`/adminpage/order/${selection.value}`)
            .then(response => response.json())
            .then(json => {
                var orderInfo = json;
                console.log(orderInfo);

                var i;
                for (i = 0; i < orderInfo.length; i++) {
                    if (selection.value == orderInfo[i].orderid) {
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
                        document.getElementById('orderList').appendChild(order);
                    }
                }
                fetch(`/profile/orderproduct/${selection.value}`)
                    .then(response => response.json())
                    .then(json => {
                        console.log(json);
                        for (let X = 0; X < json.length; X++) {
                            product = document.createElement('p');
                            product.innerHTML = '<b>Produkt: </b>' + json[X].modelname + '<br>' +
                                '<b>Antal: </b>' + json[X].count + '<br>' +
                                '<b>Pris: </b>' + json[X].price * json[X].count;
                            document.getElementById('orderList').appendChild(product);
                        }
                    });
            });
    }
}


