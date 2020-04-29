import {getOrderId, removeNode, showOrder} from "./modules/showOrderFunctions.js";
import Customer from "./class_Customer.js";

//html elements
const idSelect = document.getElementById("phoneSelect");
const selection = document.getElementById("orderId");
const nodes = document.getElementById('orderList');
const userInfo = document.getElementById('userInfoList');


//onclick event that calls the showInfo function
const showInfoBtn = document.getElementById('showInfo');
showInfoBtn.onclick=()=>{
    showInfo();
};

//onclick event that calls the showOrder function if a selection has been made
const showOrderBtn = document.getElementById('showOrder');
showOrderBtn.onclick=()=>{
    if (selection.value === '0'){
        alert(`Vælg venligst et ordre ID i menuen`)
    } else {
        showOrder(`/profile/ordersbyorderid/${selection.value}`, nodes);
    }
};


//onload function that sends a get request for all users to populate a select menu.
//Response contains an array of objects containing user-info. Looping through the array to make options in a select menu.
window.onload = function getUsers () {
    fetch('/adminpage/allusers')
        .then(response =>
            response.json())
        .then(json => {
            console.log(json);

            for (let i=0; i < json.length; i++){
                    var option = new Option(`ID ${json[i].userid}`, json[i].userid);
                    document.getElementById("phoneSelect").appendChild(option);
            }
        })
};

//Function that makes a request for a specific customer. Customer object is created from the response data
//and the showUserInfo method is called to display the objects' property values on the site.
//The getOrderId function is called to populate the select menu for the users' orders
function showInfo (){
    removeNode(userInfo);
    removeNode(nodes);
    fetch(`/adminpage/user/${idSelect.value}`)
        .then(response =>
            response.json())
        .then(json => {

            var customer = new Customer(json.username, json.streetname, json.streetnumber,
            json.postalcode, json.city, json.phone, json.email, '', json.created_at, json.userid);
            customer.showUserInfo(userInfo);
            getOrderId(`/adminpage/ordersByUser/${idSelect.value}`, selection);

            /*
                                document.getElementById("userid").innerHTML = `<b>Bruger ID:</b> ${customer.userId}`;
                                document.getElementById("type").innerHTML = `<b>Brugertype:</b> ${json[i].type}`;
                                document.getElementById("customerName").innerHTML = `<b>Navn:</b> ${customer.name}`;
                                document.getElementById("customerStreetName").innerHTML = `<b>Vejnavn:</b> ${customer.streetName}`;
                                document.getElementById("customerStreetNumber").innerHTML = `<b>Vejnummer:</b> ${customer.streetNumber}`;
                                document.getElementById("customerPostalCode").innerHTML = `<b>Postnummer:</b> ${customer.postalCode}`;
                                document.getElementById("customerCity").innerHTML = `<b>By:</b> ${customer.city}`;
                                document.getElementById("customerPhone").innerHTML = `<b>Telefonnummer:</b> ${customer.phone}`;
                                document.getElementById("customerEmail").innerHTML = `<b>E-mail:</b> ${customer.email}`;
                                document.getElementById("created_at").innerHTML = `<b>Oprettet den:</b> ${customer.created_At}`;

             */
        });
}

