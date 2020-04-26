import {getOrderId, removeNode, showOrder} from "./modules/showOrderFunctions.js";
import Customer from "./class_Customer.js";

const idSelect = document.getElementById("phoneSelect");
const selection = document.getElementById("orderId");
const nodes = document.getElementById('orderList');
const userInfo = document.getElementById('userInfoList');



const showInfoBtn = document.getElementById('showInfo');
showInfoBtn.onclick=()=>{
    showInfo();
};

const showOrderBtn = document.getElementById('showOrder');
showOrderBtn.onclick=()=>{
    if (selection.value === '0'){
        alert(`Vælg venligst et ordre ID i menuen`)
    } else {
        showOrder(`/profile/ordersbyorderid/${selection.value}`, nodes);
    }
};



window.onload = function getUsers () {

    fetch('/adminpage/allusers')
        .then(response =>
            response.json())
        .then(json => {
            console.log(json);

            for (let i=0; i < json.length; i++){
                if (json[i].userid !== null || undefined) {
                    var option = new Option(`ID ${json[i].userid}`, json[i].userid);
                    document.getElementById("phoneSelect").appendChild(option);
                }
            }
        })
};

function showInfo (){
    removeNode(userInfo);
    removeNode(nodes);
    fetch('/adminpage/allusers')
        .then(response =>
            response.json())
        .then(json => {


            for (let i = 0; i < json.length; i++) {
                if (idSelect.value == json[i].userid) {
                    var customer = new Customer(json[i].username, json[i].streetname, json[i].streetnumber,
                    json[i].postalcode, json[i].city, json[i].phone, json[i].email, '', json[i].created_at, json[i].userid);
                    customer.showUserInfo(userInfo);
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
                }
            }
            getOrderId(`/adminpage/ordersByUser/${idSelect.value}`, selection);
        });
}

