import {getOrderId, removeNode, showOrder} from "./modules/showOrderFunctions.js";
import Customer from "./class_Customer.js";
import Order from "./class_Order.js";


const selection = document.getElementById("orderId");
const nodes = document.getElementById('orderList');
const userInfoList = document.getElementById('userInfoList');


getOrderId('/profile/orders', selection);

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

            //document.getElementById('loginPhone').innerHTML = "Logget ind med ID: <br>" + userInfo.userId;
        })
};

/*
MM: The following function deletes the order that is currently selected.
 */
//Function written by Morten Dyberg
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





