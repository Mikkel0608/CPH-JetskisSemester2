import Admin from "./class_Admin.js";
import Customer from "./class_Customer.js";
const nameField = document.getElementById('name');
const passField = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');

loginBtn.onclick = ()=>{
    const data = {
        email: nameField.value,
        password: passField.value
    };
    fetch('http://localhost:3000/loginpage/auth', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(json =>{
            if (json === 'adm'){
                var admin = new Admin('Admin', data.email, data.password);
                admin.logIn();
            } else if (json === 'cus'){
                var customer = new Customer();
                customer.email = data.email;
                customer.password = data.password;
                customer.logIn();
            }
        })

};

