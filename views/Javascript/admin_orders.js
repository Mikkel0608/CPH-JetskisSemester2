import {showOrder, removeNode} from "./modules/showOrderFunctions.js";

const sortBtn = document.getElementById('sortBtn');
const node = document.getElementById('orderList');

sortBtn.onclick = ()=>{
    fetch('/adminpage/allorders')
        .then(response => response.json())
        .then(json => {
            console.log(json);
    });
};




