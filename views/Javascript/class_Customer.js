import User from "./class_User.js";


export default class Customer extends User{
    constructor(name, streetName, streetNumber, postalCode, city, phone, email, password, created_At, userId, userTypeId){
        super(name, email, password);
        this.streetName = streetName;
        this.streetNumber = streetNumber;
        this.postalCode = postalCode;
        this.city = city;
        this.phone = phone;
        this.created_At = created_At;
        this.userId = userId;
        this.userTypeId = userTypeId;
    }
    createCustomer (customer){
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
    }
    logIn(){
        console.log('customer login');
        window.location = 'http://localhost:3000'
    }
    deleteCustomer (){
        fetch(`http://localhost:3000/profile/user/${this.userid}`, {
            method: 'DELETE'
        }).then(response => response.json())
            .then(json => {
                if (json === 'ok'){
                    alert('Brugeren er blevet slettet.');
                    window.location = 'http://localhost:3000';
                }
            })
    }
    updatePassword(password){
        console.log(typeof this.userid);
        fetch(`http://localhost:3000/profile/updatepassword/update/${this.userId}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(password)
        }).then(response => response.json())
            .then(json => {
                if (json === 'ok'){
                    window.location = 'http://localhost:3000';
                }
            })
    }
    showUserInfo(element){
        element.appendChild(document.createElement('hr'));
        var userInfo = document.createElement('p');
        userInfo.innerHTML = '<b>Bruger ID: </b>' + this.userId + '<br><br><b>Navn: </b>' + this.name + '<br><br><b>Vejnavn: </b>'
                            + this.streetName + '<br><br><b>Vejnummer: </b>' + this.streetNumber + '<br><br><b>Postnummer: </b>'
                            + this.postalCode + '<br><br><b>By: </b>' + this.city + '<br><br><b>Telefonnummer: </b>' + this.phone
                            + '<br><br><b>E-mail: </b>' + this.email + '<br><br><b>Bruger oprettet d. : </b>' + this.created_At;
        element.appendChild(userInfo);
        element.appendChild(document.createElement('hr'));
    }
}
