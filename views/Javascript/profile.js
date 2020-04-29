import {getOrderId, removeNode, showOrder} from "./modules/showOrderFunctions.js";
import Customer from "./class_Customer.js";
import Order from "./class_Order.js";

//html elements
const selection = document.getElementById("orderId");
const nodes = document.getElementById('orderList');
const userInfoList = document.getElementById('userInfoList');

//This function populates the select menu with order ID's from the orders the user has made
getOrderId('/profile/orders', selection);

//The showOrder is called. The url is made dynamic by using the select menu value.
//The function displays the chosen order on the page.
const showOrderBtn = document.getElementById('showOrderBtn');
showOrderBtn.onclick = ()=>{
    if (selection.value === '0'){
        alert(`Vælg venligst et ordre ID i menuen`)
    } else {
        showOrder(`/profile/ordersbyorderid/${selection.value}`, nodes);
    }
};


const delOrderBtn = document.getElementById('delOrderBtn');
delOrderBtn.onclick = ()=>{
    deleteOrder();
};

const delUserBtn = document.getElementById('delUserBtn');
delUserBtn.onclick = ()=>{
    deleteUser();
};


//The function makes a get request to the /profile/user endpoint where the server sends back user data of the user
//that is currently logged in.
//Customer object is created so the method showUserInfo can be called.
window.onload = function getCustomerInfo() {
    fetch('/profile/user')
        .then(response => response.json())
        .then(json => {
            var userInfo = json;
            console.log(userInfo);
            var customer = new Customer(userInfo.username, userInfo.streetname, userInfo.streetnumber,
            userInfo.postalcode, userInfo.city, userInfo.phone, userInfo.email, '', userInfo.created_at, userInfo.userid);
            console.log(customer);
            customer.showUserInfo(userInfoList);
            /*

            MM:
            The code retrieves information from local storage by using the "getItem" command, and specifying the key that the
            information should be retrieved from. This retrieved information is then saved to the newly created variables.
             */
            //console.log(userInfo);
/*
            document.getElementById('userid').innerHTML = '<b>Bruger ID: </b>' + customer.userId;
            document.getElementById('customerName').innerHTML = '<b>Navn: </b>' + customer.name;
            document.getElementById('customerStreetName').innerHTML = '<b>Vejnavn: </b>' + customer.streetName;
            document.getElementById('customerStreetNumber').innerHTML = '<b>Vejnummer: </b>' + customer.streetNumber;
            document.getElementById('customerPostalCode').innerHTML = '<b>Postnummer: </b>' + customer.postalCode;
            document.getElementById('customerCity').innerHTML = '<b>By: </b>' + customer.city;
            document.getElementById('customerPhone').innerHTML = '<b>Telefonnummer: </b>' + customer.phone;
            document.getElementById('customerEmail').innerHTML = '<b>E-mail: </b>' + customer.email;
            document.getElementById('created_at').innerHTML = '<b>Bruger oprettet d. : </b>' + customer.created_At;

 */

            document.getElementById('loginPhone').innerHTML = "Logget ind med ID: <br>" + customer.userId;
        })
};


//The following function deletes the order that is currently selected.
//An order object is created depending on which order ID has been chosen by the user.
//deleteOrder method is then called.
function deleteOrder (){
    if (selection.value === '0'){
        alert(`Vælg venligst et ordre ID i menuen`)
    } else {
        var choice = window.confirm(`Er du sikker på, at du vil slette ordre med ordre ID ${selection.value}?`);
        if (choice === true) {
            var order = new Order();
            order.orderId = selection.value;
            order.deleteOrder(selection);
            removeNode(nodes);
            alert(`Ordren er blevet slettet`);
            /*
            fetch(`http://localhost:3000/profile/orders/${selection.value}`, {
                method: 'DELETE'
            }).then(response => response.json())
                .then(json => {
                    if (json === 'ok') {
                        for (let i = 0; i < selection.length; i++) {
                            if (selection[i].value === selection.value) {
                                selection.remove(i);
                            }
                        }
                        removeNode(nodes);
                        alert(`Ordren er blevet slettet`);
                    }
                })
            */
        }
    }
}

/*
MM: The deleteUser function deletes the current user.
 */

//Function that retrieves info about the user that is currently logged in.
//Creates Customer object and calls the deleteCustomer method. The method makes a DELETE request to the server.
function deleteUser() {
    var choice = window.confirm("Er du sikker på, at du vil slette din bruger?");
    if (choice === true) {
        fetch('http://localhost:3000/profile/user')
            .then(response => response.json())
            .then(json => {
                var customer = new Customer();
                customer.userid = json.userid;
                customer.deleteCustomer();
/*
                fetch(`http://localhost:3000/profile/user/${json.userid}`, {
                    method: 'DELETE'
                }).then(response => response.json())
                    .then(json => {
                        if (json === 'ok'){
                            alert('Brugeren er blevet slettet.');
                            window.location = 'http://localhost:3000';
                        }
                    })

 */
            });
    }
}





