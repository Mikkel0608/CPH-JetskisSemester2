(function checkLogin (){
    fetch('http://localhost:3000/profile/userinfo')
    .then(response => response.json())
    .then(json => {
        if (json == 0){
            alert('venligst log ind for at se denne side');
            window.location = 'http://localhost:3000/loginpage.html';
        }
    })
}());



