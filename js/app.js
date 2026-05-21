/*
   ==========================================================================
   Author ID: Davit Dostourian Erbe // 281665 // ORT Uruguay, Programación 1
   ==========================================================================
    TODO:
     - Add logic for alerts when ventas button is clicked. It should get the sales for that influencer, and
      show them in the alert.
     - Influencer, Articulo, and venta datos categories should have a hidden attribute, or just not be selectable
     until the agregar button in the section above is clicked. The article should then be shown in a popup bubble window.
     - each sale corresponds to only one item
     - order items table decreasing/increasing by item code
     - coding for the field popups

     addInfluencer() ✔️
      ->1. Adds a new influencer to the array (Initialized and added to array with an empty tag value "")
      ->2. Runs updateData()
     addArticle() ✔️
      ->1. Adds a new article to the array
      ->2. Runs updateData()
     addVenta() ✔️
      ->1. Adds a new article to the array
      ->2. Runs updateData()
     updateData() ✔️
      fillTables()
        addTags() (For the influencers table) ❌
          -> Fills the empty tag value "" -> "🔥"
          -> Adds the newly updated influencer array objects to the table
        masVendido() (For the articles table) ❌
          -> Checks which article is sold most. Adds a ⭐ emoji next to name (name + "⭐")
          -> Requires a venta with that object before it can be done. if no ventas, do nothing (no stars)
        fillDropdowns() ✔️
          -> Adds the value of "Codigo" from each article array object to the dropdown
          -> Adds the value of "Name" from each influencer array object to the dropdown
     checkOrder()❌
      -> if influencers table is ascending or descending
      -> if articulos table is ascending or descending

1. Parse input data
2. Validate data (use a separate function to do this probably, function verifyData(name,email)etc
3. If ok: save data, add to tables, reload elements
4. if not ok, prompt reinput

 */

let influencersArray = [];
let itemsArray = [];
let salesArray = [];
let globalSaleNumber = 1; // this is used in ventas (sales) to track our sale number, gets +1'd for each sale.
// it wasn't incrementing correctly as a local variable for whatever reason...

window.addEventListener("load", start);
function start() {
  //Influencer
  document
    .getElementById("addInfluencerButton1")
    .addEventListener("click", openInfluencerPopup);
  document
    .getElementById("cancelInfluencerButton")
    .addEventListener("click", cancelInfluencer);
  document
    .getElementById("addInfluencerButton2")
    .addEventListener("click", addInfluencer);

  //Articles
  document
    .getElementById("addItemButton1")
    .addEventListener("click", openItemPopup);
  document
    .getElementById("cancelItemButton")
    .addEventListener("click", cancelItem);
  document.getElementById("addItemButton2").addEventListener("click", addItem);

  //Sales (Ventas)
  document
    .getElementById("addSaleButton")
    .addEventListener("click", openSalePopup);
  document
    .getElementById("cancelSaleButton")
    .addEventListener("click", cancelSale);
  document.getElementById("addSaleButton2").addEventListener("click", addSale);
}

// Wait for the DOM to fully load before running the code (Ventas button click in table)
// Snippet written  by Ecosia AI
// This code snippet checks if a certain button was clicked by checking its class.
// This code is important because it also applies to buttons added AFTER page load.
document.addEventListener("DOMContentLoaded", () => {
  // Add a single event listener to the document
  document.addEventListener("click", (event) => {
    // Check if the clicked element has the class 'showSalesButton'
    if (event.target.classList.contains("showSalesButton")) {
      console.log("Button clicked!", event.target); //debug
      if (salesArray.length === 0) {
        alert("No hay datos.");
      } else {
        // use sales array, search for influencer name, show that data ordered in increasing order (creciente)

        let arrayToShow = [];
        arrayToShow.push("Ventas:\n");
        salesArray.forEach((sale) => {
          const saleNumber = sale.saleNumber;
          const itemCode = sale.itemCode;
          const priceEach = "priceEach"; //calc price of each from the item
          const totalPrice = "totalPrice"; //calc the total price, multiply price by quantity
          const quantity = sale.quantity;
          const commission = "commission"; // calc commission later
          arrayToShow.push(`
            \n Nro: ${saleNumber} ⮕ ${quantity} ⮕ ${itemCode} ⮕ $${priceEach}c/u Total $${totalPrice} ⮕ Comision: $${commission}
          `);
        });
        alert(arrayToShow);
      }
    }

    // Check if the clicked element has the class 'removeSaleButton'
    // Google AI assisted
    if (event.target.classList.contains("removeSaleButton")) {
      //console.log("Button clicked!", event.target);
      const row = event.target.parentElement.parentElement;
      const saleToDelete = row.cells[0].textContent.trim(); //gets saleNumber
      console.log(saleToDelete); //debug
      const arrayIndex = salesArray.findIndex(
        (sale) => String(sale.saleNumber).trim() === saleToDelete,
      ); //if found...
      if (arrayIndex !== -1) {
        //remove from array IF it's found
        salesArray.splice(arrayIndex, 1);
        console.log("Deleted successfully. Remaining array:", salesArray);
      } else {
        console.warn(
          `Could not find sale number ${saleToDelete} in the array.`,
        );
      }
      updateData(); //reload data
    }
  });
});

function updateData() {
  addTags(); //for influencers table tags, and the star in items table for most sold item
  updateTables(); //update all tables. check if they have data first.
  fillDropdowns(); //update both dropdowns. check if they have data first.
  toggleSalesForm();
}

function addTags() {
  if (salesArray.length > 0) {
    console.log("There's a sale, we have tags");
    //if there's a sale, add the tags to the respective influencers, this runs before updateTables();
    //if there's a sale in sale array, add the star to article with highest sales quantity
  } else {
    console.log("No sales, no tags yet.");
  }
}

function updateTables() {
  //Clear tables
  // Target all tables with a specific class and clear their internal HTML
  document.querySelectorAll(".tableBody").forEach((tbody) => {
    tbody.innerHTML = "";
  });

  //POPULATE INFLUENCER TABLE
  for (let i = 0; i < influencersArray.length; i++) {
    //for each influencer in the array,
    //let table = document.getElementById("influencerTable");
    let tbody = document.querySelector("#influencerTable .tableBody");

    let row = tbody.insertRow();
    let data = [
      influencersArray[i].name,
      influencersArray[i].email,
      influencersArray[i].commission + "%",
      "$ " + influencersArray[i].totalSold,
      influencersArray[i].influencerTags,
      "",
    ];

    for (let j = 0; j < data.length - 1; j++) {
      let cell = row.insertCell();
      cell.textContent = data[j]; //.textContent instead of .innerHTML treats the given values as text, and not html
      // this prevents xss vulnerabilities in the table which are pretty funny
    }

    //function to add a button to a table cell, created with Grok AI
    let cell = row.insertCell();
    let button = document.createElement("button");
    button.textContent = "Ventas";
    button.className = "showSalesButton";
    cell.appendChild(button);
  }

  //POPULATE ITEMS TABLE
  for (let i = 0; i < itemsArray.length; i++) {
    //for each influencer in the array,
    //let table = document.getElementById("influencerTable");
    let tbody = document.querySelector("#itemTable .tableBody");

    let row = tbody.insertRow();
    let data = [
      itemsArray[i].itemCode,
      itemsArray[i].description,
      "$ " + itemsArray[i].price,
    ];

    for (let j = 0; j < data.length; j++) {
      let cell = row.insertCell();
      cell.textContent = data[j]; //.textContent instead of .innerHTML treats the given values as text, and not html
      // this prevents xss vulnerabilities in the table which are pretty funny
    }
  }

  //POPULATE VENTAS TABLE
  for (let k = 0; k < salesArray.length; k++) {
    //for each influencer in the array,
    //let table = document.getElementById("influencerTable");
    let tbody = document.querySelector("#salesTable .tableBody");

    let row = tbody.insertRow();
    let data = [
      salesArray[k].saleNumber,
      salesArray[k].itemCode,
      salesArray[k].influencerName,
      salesArray[k].quantity,
      salesArray[k].saleMedium,
      "",
    ];

    for (let m = 0; m < data.length - 1; m++) {
      let cell = row.insertCell();
      cell.textContent = data[m]; //.textContent instead of .innerHTML treats the given values as text, and not html
      // this prevents xss vulnerabilities in the table which are pretty funny
    }

    //add a final cell after with the delete button
    //function to add a button to a table cell, created with Grok AI
    let cell = row.insertCell();
    let button = document.createElement("button");
    button.textContent = "❌";
    button.className = "removeSaleButton";
    cell.appendChild(button);
  }
}

function fillDropdowns() {
  if (influencersArray.length > 0) {
    //if there's an influencer...
    const dropdownInfluencer = document.getElementById(
      "influencerNameDropdown",
    ); //get dropdown
    dropdownInfluencer.innerHTML = ""; //first, clear dropdown

    influencersArray.forEach((inf) => {
      //second, add all influencers
      const newOption = new Option(inf.name, inf.name);
      dropdownInfluencer.add(newOption);
    });
  }
  if (itemsArray.length > 0) {
    //if there's an item...
    const dropdownItems = document.getElementById("saleNumberDropdown"); //get dropdown
    dropdownItems.innerHTML = ""; //first, clear dropdown
    itemsArray.forEach((item) => {
      //second, add all items
      const newOption = new Option(item.itemCode, item.itemCode);
      dropdownItems.add(newOption);
    });
  }
}

function toggleSalesForm() {
  // Check if we have both influencers AND items available, then enable the sales section
  const canSell = influencersArray.length > 0 && itemsArray.length > 0;

  // Grab all interactive fields inside your sale form
  document.getElementById("saleNumberDropdown").disabled = !canSell;
  document.getElementById("influencerNameDropdown").disabled = !canSell;
  document.getElementById("saleQuantity").disabled = !canSell;
  document.getElementById("saleMediumDropdown").disabled = !canSell;
  document.getElementById("cancelSaleButton").disabled = !canSell;
  document.getElementById("addSaleButton2").disabled = !canSell;
}

function checkValid(code, data) {
  switch (code) {
    case 1: //email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //email regex check, thanks to Google AI
      const registeredEmails = influencersArray.map((inf) => inf.email);
      const emailExists =
        registeredEmails.indexOf(data.trim().toLowerCase()) !== -1;
      if (!data) {
        return {
          isValid: false,
          error: "An email is required.",
        };
      }
      if (!emailPattern.test(data.toLowerCase())) {
        return {
          isValid: false,
          error: "Invalid email format.",
        };
      }
      if (emailExists)
        return {
          isValid: false,
          error: "User already registered.",
        };
      break;

    case 2: // regular text fields
      if (!data || data.length === 0) {
        return {
          isValid: false,
          error: "Fields cannot be left blank.",
        };
      }
      if (data.length < 2 || data.length > 20) {
        return {
          isValid: false,
          error: "Invalid name length.",
        };
      }
      break;
    case 3: //check our commission
      const comValue = Number.parseFloat(data);
      if (Number.isNaN(comValue)) {
        return {
          isValid: false,
          error: "NaN error. Insert a number.",
        };
      }
      if (comValue < 0 || comValue > 100) {
        return {
          isValid: false,
          error: "Your number must be between 0-100",
        };
      }
      break;
    case 4: //check larger nums
      const numValue = Number.parseFloat(data);
      if (Number.isNaN(numValue)) {
        return {
          isValid: false,
          error: "NaN error. Insert a number.",
        };
      }
      if (numValue < 0 || numValue > 1000000) {
        //cant have negative price either
        return {
          isValid: false,
          error: "Your number must be between 0-1,000,000",
        };
      }
      break;
    case 5: // item codes since we need these to be unique, extra validation
      const registeredCodes = itemsArray.map((inf) => inf.itemCode);
      const codeExists = registeredCodes.indexOf(data.trim()) !== -1;
      if (!data || data.length === 0) {
        return {
          isValid: false,
          error: "Fields cannot be left blank.",
        };
      }
      if (data.length < 2 || data.length > 20) {
        return {
          isValid: false,
          error: "Invalid name length.",
        };
      }
      if (codeExists)
        return {
          isValid: false,
          error: "Code already in system.",
        };
      break;
    default:
      return {
        isValid: false,
        error: "Invalid check code.",
      };
  }
  return {
    isValid: true,
    error: "",
  };
}
//Influencer
function openInfluencerPopup() {
  alert("open Add influencer popup.");
}
function cancelInfluencer() {
  //closePopup()
  document.getElementById("influencerForm").reset();
  alert("Canceled.");
}
function addInfluencer() {
  const name = document.getElementById("influencerName").value;
  const email = document.getElementById("influencerEmail").value;
  const commission = Number.parseFloat(
    document.getElementById("influencerCommission").value,
  );

  //validity checks
  const nameCheck = checkValid(2, name);
  const emailCheck = checkValid(1, email);
  const commissionCheck = checkValid(3, commission);
  if (!nameCheck.isValid) {
    alert("Error in Name: " + nameCheck.error);
    return;
  }
  if (!emailCheck.isValid) {
    alert("Error in Email: " + emailCheck.error);
    return;
  }

  if (!commissionCheck.isValid) {
    alert("Error in Commission: " + commissionCheck.error);
    return;
  }
  try {
    influencersArray.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      commission: Number(commission),
      totalSold: Number(0), //Our influencer starts off with 0 sales.
      influencerTags: "",
    });
    updateData(); //this'll work later
    alert(
      "Added influencer " +
        name +
        " with email " +
        email +
        " and " +
        commission +
        "% commission",
    );
    document.getElementById("influencerForm").reset();
  } catch (exception) {
    alert(exception);
  }
}

//Items
function openItemPopup() {
  //const text = document.getElementById("phrase").value;
  alert("Open add item popup.");
}
function cancelItem() {
  //closeItemPopup()
  document.getElementById("itemForm").reset();
  alert("Canceled.");
}
function addItem() {
  const itemCode = document.getElementById("itemCode").value;
  const description = document.getElementById("itemDescription").value;
  const price = Number.parseFloat(document.getElementById("itemPrice").value);

  //validity checks
  const checkItemCode = checkValid(5, itemCode);
  const checkDescription = checkValid(2, description);
  const checkPrice = checkValid(4, price);
  if (!checkItemCode.isValid) {
    alert("Error in Item Code: " + checkItemCode.error);
    return;
  }
  if (!checkDescription.isValid) {
    alert("Error in Description: " + checkDescription.error);
    return;
  }
  if (!checkPrice.isValid) {
    alert("Error in Price: " + checkPrice.error);
    return;
  }

  try {
    itemsArray.push({
      itemCode: itemCode.trim(),
      description: description.trim(),
      price: Number(price),
    });
    //addRowItemsTable(itemCode, description, price);
    updateData();
    alert(
      "Added item with code " +
        itemCode +
        " and description " +
        description +
        " and price $" +
        price,
    );

    document.getElementById("itemForm").reset();
  } catch (exception) {
    alert(exception);
  }
}

//Sales
function openSalePopup() {
  alert("open add Sale (venta) popup.");
}
function cancelSale() {
  //closeSalePopup();
  document.getElementById("saleForm").reset();
  alert("Canceled.");
}
function addSale() {
  const nextSaleNumber = globalSaleNumber;
  const itemCode = document.getElementById("saleNumberDropdown").value;
  const influencerName = document.getElementById(
    "influencerNameDropdown",
  ).value;
  const quantity = Number.parseInt(
    document.getElementById("saleQuantity").value,
  );
  const saleMedium = document.getElementById("saleMediumDropdown").value;

  //validity checks
  const checkQuantity = checkValid(4, quantity);
  if (!checkQuantity.isValid) {
    alert("Error in Quantity: " + checkQuantity.error);
    return;
  }

  try {
    salesArray.push({
      saleNumber: nextSaleNumber,
      itemCode: itemCode,
      influencerName: influencerName,
      quantity: Number(quantity),
      saleMedium: saleMedium,
    });
    updateData();
    alert(
      "Added sale with item code " +
        itemCode +
        " and influencer " +
        influencerName +
        " and quantity " +
        quantity +
        " and medio " +
        saleMedium,
    );
    //document.getElementById("saleForm").reset();
    globalSaleNumber++;
    document.getElementById("saleQuantity").value = "";
  } catch (exception) {
    alert(exception);
  }
}

/* this code below is all redundant now, after the addition of updateData()
// keeping it for now but it's all commented out and won't be used (probably)
function addRowInfluencerTable(name, email, commission, total, influencerTag) {
  let table = document.getElementById("influencerTable");
  let row = table.insertRow();
  let data = [name, email, commission + "%", "$ " + total, influencerTag, ""]; //join $ to the total dollar amt

  for (let i = 0; i < data.length - 1; i++) {
    let cell = row.insertCell();
    cell.innerHTML = data[i];
  }

  //function to add a button to a table cell, created with Grok AI
  let cell = row.insertCell();
  let button = document.createElement("button");
  button.textContent = "Ventas";
  button.className = "showSalesButton";
  //onclick showSalesButton JavaScript needs to be added to js file
  cell.appendChild(button);
  //add a final cell after with Ventas button
}

function addRowItemsTable(articleCode, description, price) {
  let table = document.getElementById("itemTable");
  let fila = table.insertRow();
  let data = [articleCode, description, "$ " + price];

  for (let i = 0; i < data.length; i++) {
    let cell = fila.insertCell();
    cell.innerHTML = data[i];
  }
}

function addRowSalesTable(
  saleNumber,
  articleCode,
  influencer,
  quantity,
  saleMedium,
) {
  let table = document.getElementById("salesTable");
  let row = table.insertRow();
  let data = [saleNumber, articleCode, influencer, quantity, saleMedium, ""];

  for (let i = 0; i < data.length - 1; i++) {
    let cell = row.insertCell();
    cell.innerHTML = data[i];
  }
  //add a final cell after with the delete button
  //function to add a button to a table cell, created with Grok AI
  let cell = row.insertCell();
  let button = document.createElement("button");
  button.textContent = "❌";
  button.className = "removeSaleButton";
  cell.appendChild(button);
}
*/
