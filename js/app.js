/*
   ==========================================================================
   Author ID: Davit Dostourian Erbe // 281665 // ORT Uruguay, Programacion 1
   ==========================================================================
    TODO:
     - is using form.reset() the best way to reset form? or set values to ""
     - make sure the value of each sale (salenumber) increments by one when added, and decreases/changes
       when a sale is deleted. (sale 1. next sale 2. sale 3. sale 2 deleted, sale 3 becomes sale2?
       OR do the sales stay the same number? current implementation of adding 1 to each variable
       doesnt seem to work
     - Add logic for alerts when ventas button is clicked. It should get the sales for that influencer, and
      show them in the alert.
     - Influencer, Articulo, and venta datos categories should have a hidden attribute, until the agregar button in the
     section above is clicked. The article should then be shown in a popup bubble window.
     - When a new influencer, venta, or articulo is added, they need to be kept somewhere saved and updated to the
     tables, and dropdowns once the agregar button is clicked. PERSISTANCE ACROSS ALL TABLES AND DROPDOWNS!
     Maybe the use of an updateElements() function that takes the values of the arrays storing the table and dropdown data
     array for influencers, articulos, ventas?

     addInfluencer()
      ->1. Adds a new influencer to the array (Initialized and added to array with an empty tag value "")
      ->2. Runs updateData()
     addArticle()
      ->1. Adds a new article to the array
      ->2. Runs updateData()
     addVenta()
      ->1. Adds a new article to the array
      ->2. Runs updateData()
     updateData()
      fillTables()
        addTags() (For the influencers table)
          -> Fills the empty tag value "" -> "🔥"
          -> Adds the newly updated influencer array objects to the table
        masVendido() (For the articles table)
          -> Checks which article is sold most. Adds a ⭐ emoji next to name (name + "⭐")
          -> Requires a venta with that object before it can be done. if no ventas, do nothing (no stars)
        fillDropdowns()
          -> Adds the value of "Codigo" from each article array object to the dropdown
          -> Adds the value of "Name" from each influencer array object to the dropdown
     checkOrder()
      -> if influencers table is ascending or descending
      -> if articulos table is ascending or descending

*/

/*
- Make sure to check that item code is unique
- each sale corresponds to only one item
- can only be registered if there are items and influencers (while there aren't, hide/disable button and fields)
- order items table decreasing/increasing by item code

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
  document
    .getElementById("addItemButton2")
    .addEventListener("click", addItem);

  //Sales (Ventas)
  document.getElementById("addSaleButton").addEventListener("click", openSalePopup);
  document
    .getElementById("cancelSaleButton")
    .addEventListener("click", cancelSale);
  document.getElementById("addSaleButton2").addEventListener("click", addSale);
}

// Wait for the DOM to fully load before running the code (Ventas button click)
// Snippet written  by Ecosia AI
// This code snippet checks if a certain button was clicked by checking its class.
// This code is important because it also applies to buttons added AFTER page load.
document.addEventListener("DOMContentLoaded", () => {
  // Add a single event listener to the document
  document.addEventListener("click", (event) => {
    // Check if the clicked element has the class 'showSalesButton'
    if (event.target.classList.contains("showSalesButton")) {
      console.log("Button clicked!", event.target);
      // alert to debug
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

      //event.target.parentElement.parentElement.remove();
    }

    // Check if the clicked element has the class 'removeSaleButton'
    if (event.target.classList.contains("removeSaleButton")) {
      console.log("Button clicked!", event.target);
      // alert to debug
      alert(`You clicked button with text: ${event.target.textContent}`);
      event.target.parentElement.parentElement.remove();
    }
  });
});

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
      });
      addRowInfluencerTable(name, email, commission, 0, "");
      // getTags();
      // getTotal();
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
      addRowItemsTable(itemCode, description, price);
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
  const saleNumber = 0; //this needs to increment somehow
  const itemCode = document.getElementById("saleNumberDropdown").value;
  const influencerName = document.getElementById(
    "influencerNameDropdown",
  ).value;
  const quantity = parseInt(document.getElementById("saleQuantity").value);
  const saleMedium = document.getElementById("saleMediumDropdown").value;

  if (!Number.isNaN(quantity)) {
    try {
      addRowSalesTable(
        saleNumber,
        itemCode,
        influencerName,
        quantity,
        saleMedium,
      );
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
      document.getElementById("saleForm").reset();
    } catch (exception) {
      alert(exception);
    }
  } else {
    alert("not a number, check form data and try again");
  }
}

function addRowInfluencerTable(name, email, commission, total, influencerTag) {
  let table = document.getElementById("influencerTable");
  let fila = table.insertRow();
  let data = [name, email, commission + "%", "$ " + total, influencerTag, ""]; //join $ to the total dollar amt

  for (let i = 0; i < data.length - 1; i++) {
    let cell = fila.insertCell();
    cell.innerHTML = data[i];
  }

  //function to add a button to a table cell, created with Grok AI
  let cell = fila.insertCell();
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
  //onclick removeSaleButton JavaScript needs to be added to js file
  cell.appendChild(button);
  //add a final cell after with Ventas button
}
