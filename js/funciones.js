/*
==========================================================================
   Author ID: Davit Dostourian Erbe // 281665 // ORT Uruguay, Programación 1
==========================================================================
*/

window.addEventListener("load", start);

//define our starting sort values
let influencerNameSortDirection = "asc";
let itemCodeSortDirection = "asc";

function start() {
  // Influencer
  document
    .getElementById("addInfluencerButton1")
    .addEventListener("click", openInfluencerPopup);
  document
    .getElementById("cancelInfluencerButton")
    .addEventListener("click", cancelInfluencer);
  document
    .getElementById("addInfluencerButton2")
    .addEventListener("click", addInfluencer);
  document
    .getElementById("switchInfluencerNameOrderButton")
    .addEventListener("click", sortInfluencersByName);

  // Articles
  document
    .getElementById("addItemButton1")
    .addEventListener("click", openItemPopup);
  document
    .getElementById("cancelItemButton")
    .addEventListener("click", cancelItem);
  document.getElementById("addItemButton2").addEventListener("click", addItem);
  document
    .getElementById("switchItemCodeOrderButton")
    .addEventListener("click", sortItemsByCode);

  // Sales (Ventas)
  document
    .getElementById("addSaleButton")
    .addEventListener("click", openSalePopup);
  document
    .getElementById("cancelSaleButton")
    .addEventListener("click", cancelSale);
  document.getElementById("addSaleButton2").addEventListener("click", addSale);
  updateData();
}

// Add click handlers for buttons inserted after page load. ventas and removesale buttons)
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (event) => { //check clicks on the page and see if the clicked part is a button w label "showSalesButton" or "removeSaleButton"
    if (event.target.classList.contains("showSalesButton")) { //if button is showsalesbutton
      const row = event.target.closest("tr"); //finds closest row to the button (basically the buttons row)
      const influencerName = row.cells[0].textContent.trim(); //get influencer name from first cell of row

      const influencerSales = salesArray.filter( //filter salesArray for all sales w that name
        (sale) => sale.influencerName === influencerName,
      );

      if (influencerSales.length === 0) { //if none...
        alert(`No hay ventas encontrado para ${influencerName}.`);
        return;
      }

      let details = "";
      for (let i = 0; i < influencerSales.length; i++) {
        const sale = influencerSales[i];
        const item = itemsArray.find((itemRow) => itemRow.itemCode === sale.itemCode);
        const influencer = influencersArray.find(
          (inf) => inf.name === influencerName,
        );
        const priceEach = Number(item.price);
        const totalPrice = priceEach * sale.quantity;
        const commissionPercent = Number(influencer.commission);
        const commissionAmount = (totalPrice * commissionPercent) / 100;
        const itemCode = item.itemCode;

        details +=
          "Venta " +
          sale.saleNumber +
          " ⇥ " +
          sale.quantity +
          " ⇥ " +
          itemCode +
          " ⇥ $" +
          priceEach.toFixed(2) +
          " c/u Total $" +
          totalPrice.toFixed(2) +
          " ⇥ Comisión: $" +
          commissionAmount.toFixed(2);

        if (i < influencerSales.length - 1) { //if less than arraylength-1 we get a new line
          details += "\n";
        }
      }

      alert(`Ventas de ${influencerName}:\n\n${details}`); //join the influencer name and their sales
      return;
    }

    if (event.target.classList.contains("removeSaleButton")) { // check if the clicked button is removeSaleButton
      const row = event.target.parentElement.parentElement; //identify parent sale
      const saleToDelete = row.cells[0].textContent.trim(); //get its sale number
      const arrayIndex = salesArray.findIndex( // find  sale in  salesArray by sale number
        (sale) => String(sale.saleNumber).trim() === saleToDelete,
      );
      if (arrayIndex !== -1) {
        salesArray.splice(arrayIndex, 1); //remove sale from array IF it exists
      } else {
        console.warn(`No se pudo encontrar el número de venta ${saleToDelete} en el array.`); //nope no sale
      }
      updateData(); //update data again
    }
  });
});

function updateData() { //run this every time data is changed to update everything
  addTags();
  updateTables();
  fillDropdowns();
  updateBubbles();
  updateSaleControls();
}

function showPopup(popupId) {
  const element = document.getElementById(popupId); 
  if (element) { // if element is found (the popup id) remove its hidden property class so it's shown
    element.classList.remove("hidden");
  }
}

function updateSaleControls() {  // check if we have influencers and items.
    // if they BOTH exist, we can add a venta/sale. otherwise, the ventas category can't be interacted with
  const hasInfluencers = influencersArray.length > 0;
  const hasItems = itemsArray.length > 0;
  const salesEnabled = hasInfluencers && hasItems;
  const controls = [
    "addSaleButton",
    "cancelSaleButton",
    "addSaleButton2",
    "saleNumberDropdown",
    "influencerNameDropdown",
    "saleQuantity",
    "saleMediumDropdown",
  ];

  controls.forEach((id) => {
    const element = document.getElementById(id);
    if (element) { //disable or enable id elements based on salesenabled value
      element.disabled = !salesEnabled;
    }
  });
}

function closePopup(popupId) { //cancel button
  const element = document.getElementById(popupId);
  if (element) { //if an element has the popupid class it should be hidden
    element.classList.add("hidden");
  }
}

function updateBubbles() {  // update graph based off sales
  const bubbleGraph = document.getElementById("bubbleGraph");
  if (!bubbleGraph) return;

  const mediums = [ //color pallete for the apps taken from what i think best fits them (googlesearched their color palletes)
    { value: "1-Instagram", label: "1 - Instagram", color: "#8134af" },
    { value: "2-Youtube", label: "2 - YouTube", color: "#ff0000" },
    { value: "3-X", label: "3 - X", color: "#919829" },
    { value: "4-TikTok", label: "4 - TikTok", color: "#14ba35" },
    { value: "5-Facebook", label: "5 - Facebook", color: "#2e86de" },
    { value: "6-Otras", label: "6 - Otras", color: "#7f8c8d" },
  ];    

  const totals = [];

   // we have our totals array, now we gotta create a bubble for each sale medium
   // - create div circle, calc bubble size based on total sales amt, then add bubble
   //make sure bubble has label and $$$ amt

  for (let i = 0; i < mediums.length; i++) {
    const medium = mediums[i];
    let total = 0;
    
    // identify sales medium, and loop thru its sales
    for (let j = 0; j < salesArray.length; j++) {
      const sale = salesArray[j];
      
      //count relevant sales only
      if (sale.saleMedium === medium.value) {
        // ...find the sale item
        let item = null;
        for (let k = 0; k < itemsArray.length; k++) {
          if (itemsArray[k].itemCode === sale.itemCode) {
            item = itemsArray[k];
            break;
          }
        }
        
        const priceEach = Number(item.price);
        const saleAmount = priceEach * Number(sale.quantity);
        total = total + saleAmount;//calculate sale amt
      }
    }
    
    //new object with medium info AND its total
    const salesMediumWithTotal = {
      value: medium.value,
      label: medium.label,
      color: medium.color,
      total: total
    };
    
    totals.push(salesMediumWithTotal);// track this to later graph with bubbles
  }

  //check our totals array for the highest amt and set that
  let maxTotal = 0;
  for (let i = 0; i < totals.length; i++) {
    if (totals[i].total > maxTotal) {
      maxTotal = totals[i].total;
    }
  }
    
  const maxRadius = 100;
  const minRadius = Math.round(maxRadius * 0.10); // 10% of maxRadius

  bubbleGraph.innerHTML = ""; //clear any current bubble data
  
  //create a bubble for each sales medium
  for (let i = 0; i < totals.length; i++) {
    const medium = totals[i];
    
    // calc radius size within min-max radius
    let ratio = 0;
    if (maxTotal > 0) {
      ratio = medium.total / maxTotal;
    }
    
    let radius = minRadius + ratio * (maxRadius - minRadius);
    if (radius > maxRadius) {
      radius = maxRadius;
    }
    
    //create the bubble in html
    const bubble = document.createElement("div"); //create bubble document data
    bubble.className = "bubble-item"; //style css
    
    let displayTotal = "0";
    if (medium.total > 0) {
      displayTotal = "$" + medium.total.toFixed(0); //toFixed 0 makes it a whole number (0 numbers after decimal point)
    }
    
    //build the bubble html with the previously defined data. this is done here 
    //instead of html/css because the bubble size is based on the data that gets calculated first
    bubble.innerHTML = "<div class='bubble-dot' style='width:" + (radius * 2) + "px; height:" + (radius * 2) + "px; background:" + medium.color + ";'>" + displayTotal + "</div><div class='bubble-label'>" + medium.label + "</div>";
    
    bubbleGraph.appendChild(bubble);
  }
}

function addTags() {
  if (influencersArray.length === 0) { // if there are no influencers, do nothing
    return;
  }

  // Reset fields on each influencer object.
  influencersArray.forEach((inf) => {
    inf.totalRevenue = 0;
    inf.totalCommission = 0;
    inf.highestSaleAmount = 0;
    inf.salesCount = 0;
    inf.influencerTags = "";
  });

  salesArray.forEach((sale) => { // iterate through each sale and update the influencer directly
    const item = itemsArray.find((itemRow) => itemRow.itemCode === sale.itemCode);
    const priceEach = Number(item.price);
    const saleAmount = priceEach * Number(sale.quantity);
    const influencer = influencersArray.find(
      (inf) => inf.name === sale.influencerName,
    );

    if (influencer) {
      influencer.totalRevenue += saleAmount;
      influencer.salesCount += 1;
      influencer.highestSaleAmount = Math.max(influencer.highestSaleAmount, saleAmount);
      influencer.totalCommission += (saleAmount * Number(influencer.commission)) / 100;
    }
  });

  let highestCommissionInfluencer = null;
  let highestCommissionAmount = 0;
  for (let i = 0; i < influencersArray.length; i++) {
    const inf = influencersArray[i];
    if (inf.totalCommission > highestCommissionAmount) {
      highestCommissionAmount = inf.totalCommission;
      highestCommissionInfluencer = inf;
    }
  }

  let bestSaleOwner = null;
  let highestSingleSale = 0;
  for (let i = 0; i < influencersArray.length; i++) {
    const inf = influencersArray[i];
    if (inf.highestSaleAmount > highestSingleSale) {
      highestSingleSale = inf.highestSaleAmount;
      bestSaleOwner = inf.name;
    }
  }

  for (let i = 0; i < influencersArray.length; i++) {
    const inf = influencersArray[i];
    const tags = [];

    if (highestCommissionInfluencer && inf.name === highestCommissionInfluencer.name) {
      tags.push("🔥");
    }
    if (inf.salesCount === 0) {
      tags.push("🧊");
    }
    if (bestSaleOwner === inf.name && inf.salesCount > 0) {
      tags.push("🟢");
    }

    inf.totalSold = inf.totalCommission;
    inf.influencerTags = tags.join(" ");
  }
}

function updateTables() {
  const hasData =
    influencersArray.length > 0 || itemsArray.length > 0 || salesArray.length > 0;

  if (!hasData) {
    return;
  }

  document.querySelectorAll(".tableBody").forEach((tbody) => {
    tbody.innerHTML = "";
  });

  for (let i = 0; i < influencersArray.length; i++) {
    const tbody = document.querySelector("#influencerTable .tableBody");
    const row = tbody.insertRow();
    const data = [
      influencersArray[i].name,
      influencersArray[i].email,
      influencersArray[i].commission + "%",
      "$ " + influencersArray[i].totalSold,
      influencersArray[i].influencerTags,
      "",
    ];

    for (let j = 0; j < data.length - 1; j++) {
      const cell = row.insertCell();
      cell.textContent = data[j];
    }

    const cell = row.insertCell();
    const button = document.createElement("button");
    button.textContent = "Ventas";
    button.className = "showSalesButton";
    cell.appendChild(button);
  }

  const itemSalesCount = itemsArray.reduce((acc, item) => {
    acc[item.itemCode] = 0;
    return acc;
  }, {});

  salesArray.forEach((sale) => {
    if (itemSalesCount[sale.itemCode] !== undefined) {
      itemSalesCount[sale.itemCode] += Number(sale.quantity);
    }
  });

  let topItemCode = null;
  let topItemSales = 0;
  Object.entries(itemSalesCount).forEach(([itemCode, quantity]) => {
    if (quantity > topItemSales) {
      topItemSales = quantity;
      topItemCode = itemCode;
    }
  });

  for (let i = 0; i < itemsArray.length; i++) {
    const tbody = document.querySelector("#itemTable .tableBody");
    const row = tbody.insertRow();
    const itemCodeWithTag =
      itemsArray[i].itemCode + (itemsArray[i].itemCode === topItemCode ? " ⭐" : "");
    const data = [
      itemCodeWithTag,
      itemsArray[i].description,
      "$ " + itemsArray[i].price,
    ];

    for (let j = 0; j < data.length; j++) {
      const cell = row.insertCell();
      cell.textContent = data[j];
    }
  }

  for (let k = 0; k < salesArray.length; k++) {
    const tbody = document.querySelector("#salesTable .tableBody");
    const row = tbody.insertRow();
    const data = [
      salesArray[k].saleNumber,
      salesArray[k].itemCode,
      salesArray[k].influencerName,
      salesArray[k].quantity,
      salesArray[k].saleMedium,
      "",
    ];

    for (let m = 0; m < data.length - 1; m++) {
      const cell = row.insertCell();
      cell.textContent = data[m];
    }

    const cell = row.insertCell();
    const button = document.createElement("button");
    button.textContent = "❌";
    button.className = "removeSaleButton";
    cell.appendChild(button);
  }
}

function fillDropdowns() {
  const dropdownInfluencer = document.getElementById("influencerNameDropdown");
  if (dropdownInfluencer) {
    dropdownInfluencer.innerHTML = "";
    if (influencersArray.length > 0) {
      influencersArray.forEach((inf) => {
        const newOption = new Option(inf.name, inf.name);
        dropdownInfluencer.add(newOption);
      });
    } else {
        //we shouldnt even see this bc the popup is hidden, but just in case for debugging
      dropdownInfluencer.add(new Option("Sin influencers", ""));
    }
  }

  const dropdownItems = document.getElementById("saleNumberDropdown");
  if (dropdownItems) {
    dropdownItems.innerHTML = "";
    if (itemsArray.length > 0) {
      itemsArray.forEach((item) => {
        const newOption = new Option(item.itemCode, item.itemCode);
        dropdownItems.add(newOption);
      });
    } else {
        //we also shouldnt  see this bc the popup is hidden, but add something for debugging
      dropdownItems.add(new Option("Sin artículos", ""));
    }
  }
}

function sortInfluencersByName() { //sort function for the influencer for asc and desc order
  influencersArray.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const order = nameA.localeCompare(nameB);
    return influencerNameSortDirection === "asc" ? order : -order; // asc is normal ascending, desc is reversed order
  });
  influencerNameSortDirection = influencerNameSortDirection === "asc" ? "desc" : "asc"; //update sort direction for next click. if asc then desc, if desc then asc
  updateData();
}

function sortItemsByCode() { //sort func for item codes for asc and desc
  itemsArray.sort((a, b) => {
    const codeA = a.itemCode.toLowerCase();
    const codeB = b.itemCode.toLowerCase();
    const order = codeA.localeCompare(codeB);
    return itemCodeSortDirection === "asc" ? order : -order;
  });
  itemCodeSortDirection = itemCodeSortDirection === "asc" ? "desc" : "asc"; //same sort update as before
  updateData();
}

function checkValid(code, data) { //check data validity with a switch case
  switch (code) {
    case 1: {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //regex email validation
      if (!data) {
        return { isValid: false, error: "Un email es requerido." };
      }
      if (!emailPattern.test(data.toLowerCase())) {
        return { isValid: false, error: "Formato de email inválido." };
      }
      break;
    }
    case 2: {
      if (!data || data.length === 0) {
        return { isValid: false, error: "Los campos no pueden estar vacíos." };
      }
      if (data.length < 2 || data.length > 20) {
        return { isValid: false, error: "Nombre invalido. (2-20 caracteres)" };
      }
      break;
    }
    case 3: {
      const comValue = Number.parseFloat(data);
      if (Number.isNaN(comValue)) {
        return { isValid: false, error: "NaN. Ingrese un número válido." };
      }
      if (comValue < 0 || comValue > 100) {
        return { isValid: false, error: "Su número debe estar entre 0-100" };
      }
      break;
    }
    case 4: {
      const numValue = Number.parseFloat(data);
      if (Number.isNaN(numValue)) {
        return { isValid: false, error: "NaN. Ingrese un número válido." };
      }
      if (numValue < 0 || numValue > 1000000) {
        return { isValid: false, error: "Su número debe estar entre 0-1,000,000" };
      }
      break;
    }
    default:
      return { isValid: false, error: "Invalid check code." }; //debug
  }

  return { isValid: true, error: "" };
}

function openInfluencerPopup() {
  showPopup("influencerPopup");
}

function cancelInfluencer() {
  closePopup("influencerPopup");
  document.getElementById("influencerForm").reset();
}

function addInfluencer() {
  const name = document.getElementById("influencerName").value;
  const email = document.getElementById("influencerEmail").value;
  const commission = Number.parseFloat(
    document.getElementById("influencerCommission").value,
  );
//validation
  const nameCheck = checkValid(2, name);
  const emailCheck = checkValid(1, email);
  const commissionCheck = checkValid(3, commission);
  if (!nameCheck.isValid) {
    alert("Error en Nombre: " + nameCheck.error);
    return;
  }
  if (!emailCheck.isValid) {
    alert("Error en Email: " + emailCheck.error);
    return;
  }
  const lowercaseEmail = email.trim().toLowerCase(); //ensure it is unique
  if (influencersArray.some((inf) => inf.email === lowercaseEmail)) { //find if the email exists anywhere at least once
    alert("Error: Email ya existe. Ingrese otro email.");
    return;
  }

  if (!commissionCheck.isValid) {
    alert("Error en Comisión: " + commissionCheck.error);
    return;
  }

  try {
    influencersArray.push(new Influencer(name, email, commission));
    updateData();
    alert(
      "Influencer agregado con nombre " +
        name +
        " y email " +
        email +
        " y comisión " +
        commission +
        "%",
    );
    document.getElementById("influencerForm").reset();
    closePopup("influencerPopup");
  } catch (exception) {
    alert(exception);
  }
}

function openItemPopup() {
  showPopup("itemPopup");
}

function cancelItem() {
  closePopup("itemPopup");
  document.getElementById("itemForm").reset();
}

function addItem() {
  const itemCode = document.getElementById("itemCode").value;
  const description = document.getElementById("itemDescription").value;
  const price = Number.parseFloat(document.getElementById("itemPrice").value);

  const checkItemCode = checkValid(2, itemCode);
  const checkDescription = checkValid(2, description);
  const checkPrice = checkValid(4, price);
  if (!checkItemCode.isValid) {
    alert("Error en Código de Articulo: " + checkItemCode.error);
    return;
  }
  const lowercaseItemCode = itemCode.trim().toLowerCase(); //same check as influencer, ensure unique within item array
  if (itemsArray.some((item) => item.itemCode.toLowerCase() === lowercaseItemCode)) {
    alert("Error: Código de artículo ya existe. Ingrese otro codigo.");
    return;
  }
  if (!checkDescription.isValid) {
    alert("Error en Descripcion: " + checkDescription.error);
    return;
  }
  if (!checkPrice.isValid) {
    alert("Error en Precio: " + checkPrice.error);
    return;
  }

  try {
    itemsArray.push(new Item(itemCode, description, price));
    updateData();
    alert(
      "Articulo agregado con código " +
        itemCode +
        " y descripción " +
        description +
        " y precio $" +
        price,
    );
    document.getElementById("itemForm").reset();
    closePopup("itemPopup");
  } catch (exception) {
    alert(exception);
  }
}

function openSalePopup() {
    /* //unneeded alert
  if (influencersArray.length === 0 || itemsArray.length === 0) {
    alert("Agrega al menos un influencer y un artículo antes de registrar una venta.");
    return;
  }
    */
  showPopup("salePopup");
}

function cancelSale() {
  closePopup("salePopup");
  document.getElementById("saleForm").reset();
}

function addSale() {
  const nextSaleNumber = globalSaleNumber;
  const itemCode = document.getElementById("saleNumberDropdown").value;
  const influencerName = document.getElementById("influencerNameDropdown").value;
  const quantity = Number.parseInt(
    document.getElementById("saleQuantity").value,
  );
  const saleMedium = document.getElementById("saleMediumDropdown").value;

  const checkQuantity = checkValid(4, quantity);
  if (!checkQuantity.isValid) {
    alert("Error en Cantidad: " + checkQuantity.error);
    return;
  }

  try {
    salesArray.push(
      new Sale(nextSaleNumber, itemCode, influencerName, quantity, saleMedium),
    );
    updateData();
    alert(
      "Venta agregada con código de artículo " +
        itemCode +
        " y influencer " +
        influencerName +
        " y cantidad " +
        quantity +
        " y medio " +
        saleMedium,
    );
    globalSaleNumber++;
    document.getElementById("saleQuantity").value = "";
    closePopup("salePopup");
  } catch (exception) {
    alert(exception);
  }
}
