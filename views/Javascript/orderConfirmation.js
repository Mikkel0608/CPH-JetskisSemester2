window.onload = function getActiveID() {
    fetch('/profile/user')
        .then(response => response.json())
        .then(json => {
            console.log(json);
            document.getElementById('loginPhone').innerHTML="Logget ind med ID: <br>" + json.userid;
        });
}