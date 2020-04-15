/*  MM: The following function is activated whenever the window has loaded. This is done by using the "window.onload"
event handler.
 */
//Function written by Mikkel Marcher
window.onload = function getCustomerInfo() {
    fetch('/profile/userinfo')
        .then(response => response.json())
        .then(json => {
            var userInfo = json;
            console.log(userInfo);
            /*
            MM:
            The code retrieves information from local storage by using the "getItem" command, and specifying the key that the
            information should be retrieved from. This retrieved information is then saved to the newly created variables.
             */
            //console.log(userInfo);

            document.getElementById('userid').innerHTML = '<b>Bruger ID: </b>' + userInfo.userid;
            document.getElementById('customerName').innerHTML = '<b>Navn: </b>' + userInfo.username;
            document.getElementById('customerStreetName').innerHTML = '<b>Vejnavn: </b>' + userInfo.streetname;
            document.getElementById('customerStreetNumber').innerHTML = '<b>Vejnummer: </b>' + userInfo.streetnumber;
            document.getElementById('customerPostalCode').innerHTML = '<b>Postnummer: </b>' + userInfo.postalcode;
            document.getElementById('customerCity').innerHTML = '<b>By: </b>' + userInfo.city;
            document.getElementById('customerPhone').innerHTML = '<b>Telefonnummer: </b>' + userInfo.phone;
            document.getElementById('customerEmail').innerHTML = '<b>E-mail: </b>' + userInfo.email;
            document.getElementById('created_at').innerHTML = '<b>Bruger oprettet d. : </b>' + userInfo.created_at;

            document.getElementById('loginPhone').innerHTML = "Logget ind med ID: <br>" + userInfo.userid;
    })
};


const selection = document.getElementById("orderId");
const nodes = document.getElementById('orderList');

function removeNode (node){
    while (node.firstChild){
        node.removeChild(node.lastChild);
    }
}

function showOrder(){
    //while-loop that removes the existing nodes in the orderList div
    //Using a while loop since the amount of iterations can differ
    removeNode(nodes);

    fetch('/profile/orderinfo')
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


(function getOrderId() {
    fetch('/profile/orderinfo')
        .then(response => response.json())
        .then(json => {

    var orderArray = json;
    for (var i = 0; i < orderArray.length; i++) {
            var orderId = document.createElement("option");
            orderId.innerHTML = orderArray[i].orderid;
            document.getElementById("orderId").appendChild(orderId);
        }
    })
}());

/*
MM: The following function deletes the order that is currently selected.
 */
//Function written by Morten Dyberg
var selectMenu = document.getElementById('orderId');
function deleteOrder (){
    if (selection.value === '0'){
        alert(`Vælg venligst et ordre ID i menuen`)
    } else {
        var choice = window.confirm(`Er du sikker på, at du vil slette ordre med ordre ID ${selection.value}?`);
        if (choice === true) {
            fetch(`http://localhost:3000/profile/deleteorder/${selection.value}`, {
                method: 'DELETE'
            }).then(response => response.json())
                .then(json => {
                    if (json === 'ok') {
                        for (let i = 0; i < selectMenu.length; i++) {
                            if (selectMenu[i].value === selection.value) {
                                selectMenu.remove(i);
                            }
                        }
                        removeNode(nodes);
                        alert(`Ordren er blevet slettet`);
                    }
                })
        }
    }
}

/*
MM: The deleteUser function deletes the current user.
 */
function deleteUser() {
    var choice = window.confirm("Er du sikker på, at du vil slette din bruger?");
    if (choice === true) {
        fetch('http://localhost:3000/profile/userinfo')
            .then(response => response.json())
            .then(json => {

                fetch(`http://localhost:3000/profile/deleteuser/${json.userid}`, {
                    method: 'DELETE'
                }).then(response => response.json())
                    .then(json => {
                        if (json === 'ok'){
                            alert('Brugeren er blevet slettet.');
                            window.location = 'http://localhost:3000';
                        }
                    })
            });
    }
}

