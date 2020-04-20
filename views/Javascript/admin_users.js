import {getOrderId, removeNode, showOrder} from "./modules/showOrderFunctions.js";

const idSelect = document.getElementById("phoneSelect");
const selection = document.getElementById("orderId");
const nodes = document.getElementById('orderList');



const showInfoBtn = document.getElementById('showInfo');
showInfoBtn.onclick=()=>{
    showInfo();
};

const showOrderBtn = document.getElementById('showOrder');
showOrderBtn.onclick=()=>{
    showOrder(`/adminpage/order/${selection.value}`, selection, nodes);
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
    fetch('/adminpage/allusers')
        .then(response =>
            response.json())
        .then(json => {

            for (let i = 0; i < json.length; i++) {
                if (idSelect.value == json[i].userid) {
                    document.getElementById("userid").innerHTML = `<b>Bruger ID:</b> ${json[i].userid}`;
                    document.getElementById("type").innerHTML = `<b>Brugertype:</b> ${json[i].type}`;
                    document.getElementById("customerName").innerHTML = `<b>Navn:</b> ${json[i].username}`;
                    document.getElementById("customerStreetName").innerHTML = `<b>Vejnavn:</b> ${json[i].streetname}`;
                    document.getElementById("customerStreetNumber").innerHTML = `<b>Vejnummer:</b> ${json[i].streetnumber}`;
                    document.getElementById("customerPostalCode").innerHTML = `<b>Postnummer:</b> ${json[i].postalcode}`;
                    document.getElementById("customerCity").innerHTML = `<b>By:</b> ${json[i].city}`;
                    document.getElementById("customerPhone").innerHTML = `<b>Telefonnummer:</b> ${json[i].phone}`;
                    document.getElementById("customerEmail").innerHTML = `<b>E-mail:</b> ${json[i].email}`;
                    document.getElementById("created_at").innerHTML = `<b>Oprettet den:</b> ${json[i].created_at}`;
                }
            }
            getOrderId(`/adminpage/ordersByUser/${idSelect.value}`, selection);
            removeNode(nodes);
        });
}

