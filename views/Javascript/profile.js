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

            document.getElementById('userid').innerHTML = userInfo.userid;
            document.getElementById('customerName').innerHTML = userInfo.username;
            document.getElementById('customerStreetName').innerHTML = userInfo.streetname;
            document.getElementById('customerStreetNumber').innerHTML = userInfo.streetnumber;
            document.getElementById('customerPostalCode').innerHTML = userInfo.postalcode;
            document.getElementById('customerCity').innerHTML = userInfo.city;
            document.getElementById('customerPhone').innerHTML = userInfo.phone;
            document.getElementById('customerEmail').innerHTML = userInfo.email;
            document.getElementById('created_at').innerHTML = userInfo.created_at;

            document.getElementById('loginPhone').innerHTML = "Logget ind med ID: <br>" + userInfo.userid;

            /* MM: This if statement checks if there is a "phone" value stored in local storage. If there is no value saved, it
            links the user to the login page.
             */
            /*    if (localStorage.getItem('phone') == null) {
                    window.location = "Loginpage.html"
                }*/
            /* MM: This line of code retrieves the innerHTML part of the HTML tag with id "loginPhone" and sets it equal to some text and
            the phone key's value stored in local storage.
             */
            /*
            MM:
            Two variables are created. The variable "orderAmount" is set equal to the length of the array "orderArray" that is saved in local storage.
            The array is retrieved from local storage by using JSON.parse. The array from local storage is saved as the "orderArray" variable.
             */
    })
};
const selection = document.getElementById("orderId");


/*function clearOrder(){
    const node = document.getElementById('orderList');
    node.textContent = "";
    showOrder();
}*/

function showOrder(){
    const node = document.getElementById('orderList');
    node.textContent = "";
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
                    order.innerHTML = "Dato for udlejning: " + day + "/" + month + "/" + year + "</br></br>" + "Tidspunkt for udlejning: kl." + timePeriod + "</br></br>" /*+ product + "</br></br"*/ + "Samlet pris til betaling ved udlejning: " + orderPrice + "</br></br> Ordre ID: " + orderID + "</br></br> Ordre lavet d.:" + orderDate + "</br></br>";
                    document.getElementById('orderList').appendChild(order);
                }
            }
            fetch(`/profile/orderproduct/${selection.value}`)
                .then(response => response.json())
                .then(json => {
                    console.log(json);
                    for (let X = 0; X < json.length; X++) {
                        product = document.createElement('p');
                        product.innerHTML = `Produkt: ${json[X].modelname}
                                             antal: ${json[X].count}
                                             pris: ${json[X].price}`;
                        document.getElementById('orderList').appendChild(product);
                    }
                });
            });
}




/*
MM: Two variables are created. The "selection" variable is set equal to the HTML select tag with the ID "orderID".
The "option" variable is set equal to the options of the "selection" variable.
 */

/*
MM: This function goes through all the stored orders in localStorage and adds the orderID to the order selector if the phone
attribute in the stored order matches the phone of the active user.
 */
//Function written by Morten Dyberg
(function getOrderId() {
    fetch('/profile/orderinfo')
        .then(response => response.json())
        .then(json => {

    var orderArray = json;
    /*
    MM: This for loop cycles through all the orders in the orderArray. For each repetition, variable i is increased by 1.
    The loop only stops once i is greater than the length of the orderArray.
     */
    for (var i = 0; i < orderArray.length; i++) {
        if (localStorage.getItem("phone") == orderArray[i].phone) {
            var orderId = document.createElement("option");
            orderId.innerHTML = orderArray[i].orderid;
            document.getElementById("orderId").appendChild(orderId);
            }
        }
    })
}());

/*
MM: The following function deletes the order that is currently selected.
 */
//Function written by Morten Dyberg
function deleteOrder() {
    var orderArray = JSON.parse(localStorage.getItem("orderArray"));
    /*
    MM: The following for loop cycles through all the stored orders. If the currently selected order is equal to
    the stored order's orderId attribute, the order is removed from the order array.
     */
    for (var i = 0; i < orderArray.length; i++) {
        if (selection.value == orderArray[i].orderId) {
            /*
            MM: The page is reloaded using the location property.
             */
            window.location = "profile.html";
            /*
            MM: The splice method is used to remove a section of the orderArray. It specifies that at position i, it should
            remove 1 item.
             */
            orderArray.splice(i, 1);
            /*
            MM: Using the JSON.stringify method, the orderArray array is saved as a string in the variable "orderArrayString".
            The variable is saved to the key "orderArray" in local storage using the localStorage.setItem method.
             */
            var orderArrayString = JSON.stringify(orderArray);
            localStorage.setItem("orderArray", orderArrayString);
        }
    }
}
/*
MM: The following function prompts the user to confirm that they want to delete their order.
 */
//Function written by Morten Dyberg
function deleteOrderAlert() {
    /*
    MM: The window.confirm method prompts the user to either confirm or cancel the cancellation action.
     */
    var choice = window.confirm("Er du sikker på, at du vil slette din ordre?");
    /*
    MM: If the user confirms to delete their order, an alert appears and the deleteOrder function is called.
     */
    if (choice == true) {
        alert("Ordren er blevet slettet");
        deleteOrder();
    }
}
/*
MM: The deleteUser function deletes the current user from the userArray.
 */
//Function written by Morten Dyberg
function deleteUser() {
    //var userArray = JSON.parse(localStorage.getItem("userArray"));
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

