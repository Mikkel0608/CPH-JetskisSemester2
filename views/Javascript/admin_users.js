import {getOrderId, removeNode, showOrder} from "./modules/showOrderFunctions.js";


var idSelect = document.getElementById("phoneSelect");


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
                    var option = document.createElement("option");
                    option.innerHTML = json[i].userid;

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

