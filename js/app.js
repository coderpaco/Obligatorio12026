/*
   ==========================================================================
   Author ID: Davit Dostourian Erbe // 281665 // ORT Uruguay, Programación 1
   ==========================================================================
    TODO:
     - Add logic for alerts when ventas button is clicked. It should get the sales for that influencer, and
      show them in the alert.
     - Influencer, Articulo, and venta datos categories should have a hidden attribute, or just not be selectable
     until the agregar button in the section above is clicked. The article should then be shown in a popup bubble window.
     - Make sure to check that item code is unique
     - each sale corresponds to only one item
     - can only be registered if there are items and influencers (while there aren't, hide/disable button and fields)
     - order items table decreasing/increasing by item code

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

// Define our arrays to store data
// We need to access this data in the following ways:
// - Put new influencers, items, and sales in their respective arrays
// - Access the arrays, and do a for each loop to add each element to their tables and populate dropdowns.

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
      console.log("Button clicked!", event.target);
      // use sales array, search for influencer name, show that data ordered in increasing order (creciente)
      //sample data. Should also show if there were no sales.
      const saleNumber = 1;
      const quantity = 10;
      const articleNumber = "A001";
      const price = 355;
      const commission = 50;
      alert(`
      You clicked the Ventas button. Here's the influencer sales data: \n
        Venta Numero: ${saleNumber}\n
        Cantidad: ${quantity}\n
        Articulo: ${articleNumber}\n
        Precio Unitario: $${price}\n
        Comision: $${commission}\n
      `);
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
      cell.innerHTML = data[j];
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
      cell.innerHTML = data[j];
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
      cell.innerHTML = data[m];
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
  const commission = parseInt(
    document.getElementById("influencerCommission").value,
  );
  if (name !== "" && email !== "" && !Number.isNaN(commission)) {
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
  } else {
    alert("invalid name, email, or commission. try again.");
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
  const price = parseInt(document.getElementById("itemPrice").value);
  if (itemCode !== "" && description !== "" && !Number.isNaN(price)) {
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
  } else {
    alert("invalid code, description, or number.");
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
  const quantity = parseInt(document.getElementById("saleQuantity").value);
  const saleMedium = document.getElementById("saleMediumDropdown").value;
  if (!Number.isNaN(quantity)) {
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
  } else {
    alert("not a number, check form data and try again");
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
