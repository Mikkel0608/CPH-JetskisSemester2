import Product from "./class_Product.js";
import Order from "./class_Order.js";
import OrderProduct from "./class_OrderProduct.js";

//MM: Gets the active user ID and inserts in the navibar
window.onload = function getActiveID() {
    fetch('/profile/user')
        .then(response => response.json())
        .then(json => {
            console.log(json);
            document.getElementById('loginPhone').innerHTML = "Logget ind med ID: <br>" + json.userid;
        });
};
//MM: Creating the product class. This class is used to create objects for each products fetched from the database

//MM: Creating the Order class. This class is used to create the newOrder object that is send to the API and into the database.
/*MM: The following function is activated by the confirm time button. It requests the products from the API, and clones the modelContainer for each product in the DB.
The product information stored for each product in the database is then inserted into each clone. The API automatically adjusts the quantity available to adjust for existing reservations.
 */
//Function written by: MM
//MM: The global variable storedProducts stores the product objects that are received from the database
const confirmTimeBtn = document.getElementById('confirmTime');
confirmTimeBtn.onclick = (event) => {
    event.preventDefault();
    confirmTime();
};
var storedProducts = [];
var shownProducts = [];
function confirmTime() {
    // MM: Creating variables that represent the user selection of date and time on the page
    var rentDayID = document.getElementById("rentDay");
    var rentDayValue = rentDayID.options[rentDayID.selectedIndex].value;
    var rentMonthID = document.getElementById("rentMonth");
    var rentMonthValue = rentMonthID.options[rentMonthID.selectedIndex].value;
    var rentYearID = document.getElementById("rentYear");
    var rentYearValue = rentYearID.options[rentYearID.selectedIndex].value;

    var rentTimeID = document.getElementById("rentTime");
    var rentTimeValue = rentTimeID.options[rentTimeID.selectedIndex].value;

    //MM: Checks that all date/time fields have been filled out.
    if (rentDayValue != "00" && rentMonthValue != "00" && rentYearValue != "00" && rentTimeValue != "00") {
        var selectedDate = {
            rentDayValue: rentDayValue,
            rentMonthValue: rentMonthValue,
            rentYearValue: rentYearValue,
            rentTimeValue: rentTimeValue
        };
        //MM: Locks the date/time selection elements so that they can't be changed once a date/time has been confirmed.
        document.getElementById('rentDay').disabled = true;
        document.getElementById('rentMonth').disabled = true;
        document.getElementById('rentYear').disabled = true;
        document.getElementById('rentTime').disabled = true;
        //MM: Fetches the products from the database.
        fetch('http://localhost:3000/orderPage/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedDate)
        }).then(response => response.json())
            .then(json => {
                console.log(json);
                console.log(json.length);
                //MM: Checks if the products have already been generated on the page. This is to avoid JS creating duplicates of the same products if the button is pressed repeatedly
                if (storedProducts.length !== json.length) {
                    //MM: Clones "modelContainer" for each product fetched from database, and creates objects for each product
                    for (let i = 0; i < json.length; i++) {
                        //MM: Creates a new Product object from the received information and pushes it to the storedProducts array
                        var newProduct = new Product(json[i].productid, json[i].price, json[i].modelname, json[i].modeldescription, json[i].quantity, json[i].imagesrc);
                        storedProducts.push(newProduct);
                        if (json[i].quantity !== 0) {
                            //MM: The shown products array only contains the objects that are shown on the page
                            shownProducts.push(newProduct);
                            newProduct.generateProduct("modelContainer", [i]);
                            /*
                            var container = document.getElementById("modelContainer");
                            var clone = container.cloneNode(true);
                            //MM: Gives each product clone its own id
                            clone.id = "modelContainer" + [i];
                            //MM: Makes each product clone visible
                            clone.style.display = "initial";
                            //MM: Inserts each product clone onto the "productContainer" node
                            document.getElementById("productContainer").appendChild(clone);
                            //MM: The following lines insert the fetched product information onto each clone
                            //MM: Inserts product title
                            document.getElementById("modelContainer" + [i]).getElementsByTagName('div')[0].getElementsByTagName("h2")[0].innerHTML = json[i].modelname;
                            //MM: Inserts product photo source
                            document.getElementById("modelContainer" + [i]).getElementsByTagName('div')[1].getElementsByTagName('img')[0].src = json[i].imagesrc;
                            //MM: Inserts product description
                            document.getElementById("modelContainer" + [i]).getElementsByTagName('div')[2].getElementsByTagName('p')[0].innerHTML = json[i].modeldescription;
                            //MM: Inserts maximum amount of available products. It cycles through the product quantity and creates the amount of select options needed.
                            var selectElement = document.getElementById("modelContainer" + [i]).getElementsByTagName('div')[2].getElementsByTagName('select')[0];
                            for (let x = 0; x < json[i].quantity; x++) {
                                selectElement.options[selectElement.options.length] = new Option([x + 1], [x + 1]);
                            }
                            //MM: A eventlistener is added to the select element so that the basket is updated every time the amount is changed

                             */
                            document.getElementById("modelContainer"+ [i]).getElementsByTagName('div')[2].getElementsByTagName('select')[0].addEventListener('change', calculatePrice);
                        }
                    }
                }
                console.log(storedProducts);
                if (shownProducts.length === 0) {
                    document.getElementById('noProducts').style.display = "initial";
                }
            });
        //MM: If the user has not filled out all the date/time fields, an error is shown:
    } else {
        alert("Udfyld venligst alle felter.");
    }
}

/*MM: The following function is activated when the user changes the amount of selected products. It has the following functionality:
1. It adds up the total price of the selected products and shows it in the basket.
2. It shows the basket whenever a product is selected, and hides the basket if no products are selected
3. It generates the product name, photo, and price in basket.
 */
//Function written by: MM
var finalPrice;
function calculatePrice() {
    //MM: Goes through all the stored products and adds their individual prices and quantities to the finalPrice var
    finalPrice = 0;
    for (let i = 0; i < storedProducts.length; i++) {
        if (document.getElementById('modelContainer' + [i]) !== null) {
            var selectElement = document.getElementById("modelContainer" + [i]).getElementsByTagName('div')[2].getElementsByTagName('select')[0];
            finalPrice += selectElement.options[selectElement.selectedIndex].value * storedProducts[i].price;
        }
    }
    document.getElementById('totalPrice').innerHTML = "Samlet Pris: " + finalPrice + " kr.";
    document.getElementById('basketDivFull').style.display = "initial";
    //MM: Hides the basket if the basket is empty
    if (finalPrice === 0) {
        document.getElementById('basketDivFull').style.display = "none";
    }

    //MM: The following for loop cycles through the storedProducts, creates clones of the basketProduct div, and inserts the product information, along with the selected amount
    for (let x = 0; x < storedProducts.length; x++) {
            storedProducts[x].generateBasketProduct("basketProduct","modelContainer", [x]);
        /*
        if (document.getElementById('modelContainer' + [x]) !== null) {
            //MM: Saves the select element of product number x in the loop
            var selectElement2 = document.getElementById("modelContainer" + [x]).getElementsByTagName('div')[2].getElementsByTagName('select')[0];
            //MM: If statement checks if there are more than 0 selected of the product, and that the product has not been generated in the basket already
            if (selectElement2.options[selectElement2.selectedIndex].value > 0 && document.getElementById("basketProduct" + [x]) == null) {
                //MM: Creates a clone of the "basketProduct" div
                var basketProduct = document.getElementById("basketProduct");
                var clone = basketProduct.cloneNode(true);
                //MM: Gives each product clone its own id
                clone.id = "basketProduct" + [x];
                //MM: Makes each product clone visible
                clone.style.display = "initial";
                //MM: Inserts each product clone onto the "productContainer" node
                document.getElementById("basketDivMain").appendChild(clone);
                //MM: Inserts all the product information for the corresponding product stored in the storedProducts array
                document.getElementById("basketProduct" + [x]).innerHTML = "<img style=\"width:30%; float:left; \" src=" + storedProducts[x].imageSRC + "> " + storedProducts[x].modelName + " <br> Antal: " + selectElement2.options[selectElement2.selectedIndex].value + "<br> Pris: " + selectElement2.options[selectElement2.selectedIndex].value * storedProducts[x].price + " kr.";

                //MM: If the product element already exists in the basket, and the "select" element is changed to "0", it hides the element from the basket:
            } else if (selectElement2.options[selectElement2.selectedIndex].value == 0 && document.getElementById("basketProduct" + [x]) != null) {
                document.getElementById("basketProduct" + [x]).style.display = "none";

                //MM: If the product element already exists, but has been hidden previously, it makes the div visible and updates the div with correct amount/price:
            } else if (selectElement2.options[selectElement2.selectedIndex].value > 0 && document.getElementById("basketProduct" + [x]) != null) {
                document.getElementById("basketProduct" + [x]).style.display = "initial";
                document.getElementById("basketProduct" + [x]).innerHTML = "<img style=\"width:30%; float:left; \" src=" + storedProducts[x].imageSRC + "> " + storedProducts[x].modelName + " <br> Antal: " + selectElement2.options[selectElement2.selectedIndex].value + "<br> Pris: " + selectElement2.options[selectElement2.selectedIndex].value * storedProducts[x].price + " kr.";
            }
        }

         */
    }
}

//MM: The storeOrder function collects the order information and sends it to the API
const storeOrderBtn = document.getElementById('confirmPurchaseButton');
storeOrderBtn.onclick = () => {
    storeOrder();
};

function storeOrder() {
    //MM: The Products array is created. It will contain all the selected products.
    var products = [];
    //MM: The for loop cycles through the storedProducts array and creates objects for each product selected. All product objects are pushed to the Products array.
    for (let i = 0; i < storedProducts.length; i++) {
        if (document.getElementById('modelContainer'+[i]) !== null) {
            var selectElement = document.getElementById("modelContainer" + [i]).getElementsByTagName('div')[2].getElementsByTagName('select')[0];
            if (selectElement.options[selectElement.selectedIndex].value > 0) {
                var newOrderProduct = new OrderProduct(storedProducts[i].productId, storedProducts[i].price, storedProducts[i].modelName, parseInt(selectElement.options[selectElement.selectedIndex].value));
                products.push(newOrderProduct);
            }
        }
    }
    console.log(products);
    
    //MM: The newOrder object is created, and is send to the API with a post request. The client is then redirected to the orderconfirmation page.
    const newOrder = new Order(products, document.getElementById('rentDay').value, document.getElementById('rentMonth').value, document.getElementById('rentYear').value, document.getElementById('rentTime').value, finalPrice);
    newOrder.createOrder();

}