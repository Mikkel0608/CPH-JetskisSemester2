import {getOrderId, removeNode, showOrder} from "./modules/showOrderFunctions.js";


const selection = document.getElementById("orderId");
const nodes = document.getElementById('orderList');


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

                fetch(`http://localhost:3000/profile/user/${json.userid}`, {
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





