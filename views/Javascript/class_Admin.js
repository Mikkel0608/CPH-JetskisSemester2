import User from "./class_User.js";

export default class Admin extends User{
    constructor(name, email, password) {
        super(name, email, password);
    }
    logIn() {
        console.log('adm login');
        window.location = 'http://localhost:3000/Adminpage';
    }
}