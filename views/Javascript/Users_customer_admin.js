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




