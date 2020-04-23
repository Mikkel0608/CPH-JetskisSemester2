const sortBtn = document.getElementById('sortBtn');
const sort = document.getElementById('sort');

const datE = document.getElementById('date');
datE.value = 1;
const id = document.getElementById('id');
id.value = 2;
const price = document.getElementById('price');
price.value = 3;


sortBtn.onclick = ()=>{
    fetch(`/adminpage/allOrders/${sort.value}`, {
        method: 'GET',
    }).then(response => response.json())
        .then(json => {
            console.log(json);
        })
};








