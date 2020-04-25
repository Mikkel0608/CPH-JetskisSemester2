class User {
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
    }
}


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
    create (customer){
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
}


class Admin extends User{
    constructor(name, email, password) {
        super(name, email, password);
    }
    logIn(){
        console.log(this.name, "har lige logget ind");
    }
}
//We make an instance of this class by creating an object.
