import Customer from "./class_Customer.js";

const form = document.getElementById('updatepassword');

/*
Fetches the userid, which is used to make a parameterized query in the PUT request.
New password is sent through the request body.
 */
window.onload = function(){
    fetch('http://localhost:3000/profile/user')
        .then(response => response.json())
        .then(json => {
            console.log(json.userid);

            form.onsubmit = (event)=>{
                event.preventDefault();
                var password = {
                    password: document.getElementById('newPassword').value
                };
                var customer = new Customer();
                customer.userId = json.userid;
                customer.updatePassword(password);
/*
                fetch(`http://localhost:3000/profile/updatepassword/update/${json.userid}`,{
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

 */
            };
        });
};