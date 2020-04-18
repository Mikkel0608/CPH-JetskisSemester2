class User {
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
    }
}


class Customer extends User{
    constructor(name, streetName, streetNumber, postalCode, city, phone, email, password){
        super(name, email, password);
        this.streetName = streetName;
        this.streetNumber = streetNumber;
        this.postalCode = postalCode;
        this.city = city;
        this.phone = phone;
    }
}
//var xhr = new XMLHttpRequest();

/*MD:
The purpose of the code is validate the input in the registration form. We achieve this by using a boolean value
that returns false if some of the text fields are invalid.
 */
//This code is written by Morten Dyberg
function register() {
    var name = document.getElementById("customerName").value;
    var streetName = document.getElementById("streetName").value;
    var streetNumber = document.getElementById("streetNumber").value;
    var postalCode = document.getElementById("postalCode").value;
    var city = document.getElementById("city").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    //The following lines of code will validate whether the inputs are valid.
    //1. Validating the form
    var form_valid = true;
    var validation_message = "";

    //2. Validating the name
    if (customerName==null || customerName=="")
    {
        document.getElementById('customerName').style.borderColor = "red";
        validation_message += "Venligst udfyld navn! \n";
        form_valid = false;
    }

    //3. Validating the address (same method as the name)
    if (streetName==null || streetName=="")
    {
        document.getElementById('streetName').style.borderColor = "red";
        validation_message += "Venligst udfyld vejnavn!\n";
        form_valid = false;
    }

    //4. Validating the City
    if (city==null || city=="")
    {
        document.getElementById('city').style.borderColor = "red";
        validation_message += "Venligst udfyld by!\n";
        form_valid = false;
    }

    //5. Validating the phone number using isNaN method
    if (isNaN(phone) || phone==null || phone=="")
    {
        document.getElementById('phone').style.borderColor = "red";
        validation_message += "Venligst udfyld telefonnummer!\n";
        form_valid = false;
    }

    //6. Validating the e-mail
    if (email==null || email=="")
    {
        document.getElementById('email').style.borderColor = "red";
        validation_message += "Venligst udfyld E-mail!\n";
        form_valid = false;
    }

    /*7. Validating the password(s).
     */
    if (password==null || password=="" || confirmPassword==null || confirmPassword=="")
    {
        document.getElementById('password').style.borderColor = "red";
        document.getElementById('confirmPassword').style.borderColor = "red";
        validation_message += "Venligst udfyld password!\n";
        form_valid = false;
    }

    //This if statement checks whether the password and confirmPassword values are equal to eachother.
    if (document.getElementById("password").value!=document.getElementById("confirmPassword").value) {
        document.getElementById('confirmPassword').style.borderColor = "red";
        validation_message += "Passwords er ikke ens";
        form_valid = false;
    }

/*MD:
This statement checks whether the form is valid. If it is valid, that means that none of the above conditions have
been met in order to make the form_valid = false.
The JSON.parse command takes some JSON data and converts it back to JavaScript values.
The JSON.stringify command does the opposite, and converts JavaScript values to a JSON-encoded string.
The method .push is used to introduce a new customer object into the back of the userArray.
.setItem is used to put data into the localStorage.
*/

    if (form_valid) {
        const customer = new Customer(name, streetName, streetNumber, postalCode, city, phone, email, password);
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        }).then(response => response.json())
            .then(json => {
                if (!json.ok){
                    console.log(json);
                    alert(json);
                } else if (json.ok === true){
                    console.log(json.ok);
                    window.location = 'http://localhost:3000/loginpage.html';
                }
            });
        /*xhr.open("POST", 'http://localhost:3000/register', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(customer));
        //window.location = "http://localhost:3000/register";
        //window.location = "/loginpage.html";*/
        return true;

    } else {
        alert(validation_message);
        return false;
    }

}


//A class is created for the admin. The only properties in this class are username and password.
//Class written by Markus Kronborg
class Admin extends User{
    constructor(name, email, password) {
        super(name, email, password);
    }
    logIn(){
        console.log(this.name, "har lige logget ind");
    }
}
//We make an instance of this class by creating an object.
admin1 = new Admin('admin', 12345);



var idSelect = document.getElementById("phoneSelect");
function getUsers () {

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
}


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
            getOrderId(`/adminpage/order/${idSelect.value}`)
        });
}

const selection = document.getElementById("orderId");
const nodes = document.getElementById('orderList');

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

function showOrder(path){
    //while-loop that removes the existing nodes in the orderList div
    //Using a while loop since the amount of iterations can differ
    if (selection.value === '0'){
        alert(`Vælg venligst et ordre ID i menuen`)
    } else {
        removeNode(nodes);

        fetch(path)
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



