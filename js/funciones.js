/*
==========================================================================
   Author ID: Davit Dostourian Erbe // 281665 // ORT Uruguay, Programación 1
==========================================================================
*/

window.addEventListener("load", start);

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

// Add click handlers for buttons inserted after page load.
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (event) => { //check clicks on the page and see if the clicked part is a button w label "showSalesButton" or "removeSaleButton"
    if (event.target.classList.contains("showSalesButton")) {
      const row = event.target.closest("tr");
      const influencerName = row?.cells[0]?.textContent.trim();
      if (!influencerName) {
        alert("No influencer name found for this sale button.");
        return;
      }

      const influencerSales = salesArray.filter(
        (sale) => sale.influencerName === influencerName,
      );

      if (influencerSales.length === 0) {
        alert(`No sales found for influencer ${influencerName}.`);
        return;
      }

      const details = influencerSales
        .map((sale) => { // iterate through each sale and create a summary string to later show in ventas
          const item = itemsArray.find((itemRow) => itemRow.itemCode === sale.itemCode);
          const influencer = influencersArray.find(
            (inf) => inf.name === influencerName,
          );
          const priceEach = item ? Number(item.price) : 0;
          const totalPrice = priceEach * sale.quantity;
          const commissionPercent = influencer ? Number(influencer.commission) : 0;
          const commissionAmount = (totalPrice * commissionPercent) / 100;
          const itemCode = item ? item.itemCode : sale.itemCode;

          return `Venta ${sale.saleNumber} -> ${sale.quantity} = ${itemCode} $${priceEach.toFixed(2)} c/u Total $${totalPrice.toFixed(2)} -> Comisión: $${commissionAmount.toFixed(2)}`;
        })
        .join("\n");

      alert(`Ventas de ${influencerName}:\n\n${details}`);
      return;
    }

    if (event.target.classList.contains("removeSaleButton")) { // check if the clicked button is removeSaleButton
      const row = event.target.parentElement.parentElement;
      const saleToDelete = row.cells[0].textContent.trim();
      const arrayIndex = salesArray.findIndex( // find  sale in  salesArray by sale number
        (sale) => String(sale.saleNumber).trim() === saleToDelete,
      );
      if (arrayIndex !== -1) {
        salesArray.splice(arrayIndex, 1); //remove sale from array
      } else {
        console.warn(`Could not find sale number ${saleToDelete} in the array.`); //nope no sale
      }
      updateData(); //update data again
    }
  });
});

function updateData() {
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

function updateSaleControls() { 
    // check if we have influencers and items.
    // if they BOTH exist, we can add a venta/sale. otherwise its blocked
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

function closePopup(popupId) {
  const element = document.getElementById(popupId);
  if (element) { //if an element has the popupid class it should be hidden
    element.classList.add("hidden");
  }
}

function updateBubbles() { 
  const bubbleGraph = document.getElementById("bubbleGraph");
  if (!bubbleGraph) return;

  const mediums = [
    { value: "1-Instagram", label: "1 - Instagram", color: "#ff4d4d" },
    { value: "2-Youtube", label: "2 - YouTube", color: "#ffae42" },
    { value: "3-X", label: "3 - X", color: "#229954" },
    { value: "4-TikTok", label: "4 - TikTok", color: "#8e44ad" },
    { value: "5-Facebook", label: "5 - Facebook", color: "#2e86de" },
    { value: "6-Otras", label: "6 - Otras", color: "#7f8c8d" },
  ];

  const totals = mediums.map((medium) => {
    const total = salesArray.reduce((sum, sale) => {
      if (sale.saleMedium !== medium.value) return sum;
      const item = itemsArray.find((itemRow) => itemRow.itemCode === sale.itemCode);
      const priceEach = item ? Number(item.price) : 0;
      return sum + priceEach * Number(sale.quantity);
    }, 0);
    return { ...medium, total };
  });

  const maxTotal = Math.max(...totals.map((item) => item.total), 0);
  const minRadius = 12;
  const maxRadius = 120;

  bubbleGraph.innerHTML = "";

  totals.forEach((medium) => {
    const ratio = maxTotal > 0 ? medium.total / maxTotal : 0;
    const radius = Math.max(minRadius, ratio * maxRadius);
    const bubble = document.createElement("div");
    bubble.className = "bubble-item";
    bubble.innerHTML = `
      <div class="bubble-dot" style="width:${radius * 2}px; height:${radius * 2}px; background:${medium.color};">
        ${medium.total > 0 ? `$${medium.total.toFixed(0)}` : "0"}
      </div>
      <div class="bubble-label">${medium.label}</div>
      <div class="bubble-value">Total: $${medium.total.toFixed(0)}</div>
    `;
    bubbleGraph.appendChild(bubble);
  });
}

function addTags() {
  if (influencersArray.length === 0) { // if there are no influencers, do nothing
    return;
  }

  const influencerSales = {}; // create an array to hold the sales summary for each influencer
  influencersArray.forEach((inf) => {
    influencerSales[inf.name] = {
      totalRevenue: 0,
      totalCommission: 0,
      highestSaleAmount: 0,
      salesCount: 0,
    };
  });

  const influencerMap = Object.fromEntries( //create an influencer map 
    influencersArray.map((inf) => [inf.name, inf]),
  );
  const itemMap = Object.fromEntries( // create an item map
    itemsArray.map((item) => [item.itemCode, item]),
  );

  salesArray.forEach((sale) => { // iterate through each sale and update the influencer summary
    const item = itemMap[sale.itemCode];
    const priceEach = item ? Number(item.price) : 0;
    const saleAmount = priceEach * Number(sale.quantity);
    const influencer = influencerMap[sale.influencerName];
    const summary = influencerSales[sale.influencerName];

    if (summary) { // if the influencer exists, update their summary
      summary.totalRevenue += saleAmount;
      summary.salesCount += 1;
      summary.highestSaleAmount = Math.max(summary.highestSaleAmount, saleAmount);
      if (influencer) {
        summary.totalCommission += (saleAmount * Number(influencer.commission)) / 100;
      }
    }
  });

  let highestCommissionInfluencer = null;
  let highestCommissionAmount = 0;
  Object.entries(influencerSales).forEach(([name, summary]) => { // find the influencer with the highest total commission
    if (summary.totalCommission > highestCommissionAmount) {
      highestCommissionAmount = summary.totalCommission;
      highestCommissionInfluencer = influencersArray.find((inf) => inf.name === name);
    }
  });

  let bestSaleOwner = null;
  let highestSingleSale = 0;
  Object.entries(influencerSales).forEach(([name, summary]) => { // find the influencer with the highest single sale amount
    if (summary.highestSaleAmount > highestSingleSale) {
      highestSingleSale = summary.highestSaleAmount;
      bestSaleOwner = name;
    }
  });

  influencersArray.forEach((inf) => { // iterate through each influencer and assign tags based on their sales summary
    const summary = influencerSales[inf.name] || {
      totalRevenue: 0,
      highestSaleAmount: 0,
      salesCount: 0,
    };
    const tags = [];

    if (highestCommissionInfluencer && inf.name === highestCommissionInfluencer.name) {
      tags.push("🔥");
    }
    if (summary.salesCount === 0) {
      tags.push("🧊");
    }
    if (bestSaleOwner === inf.name && summary.salesCount > 0) {
      tags.push("🟢");
    }

    inf.totalSold = summary.totalCommission;
    inf.influencerTags = tags.join(" ");
  });
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
      dropdownItems.add(new Option("Sin artículos", ""));
    }
  }
}

function sortInfluencersByName() {
  influencersArray.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const order = nameA.localeCompare(nameB);
    return influencerNameSortDirection === "asc" ? order : -order;
  });
  influencerNameSortDirection = influencerNameSortDirection === "asc" ? "desc" : "asc";
  updateData();
}

function sortItemsByCode() {
  itemsArray.sort((a, b) => {
    const codeA = a.itemCode.toLowerCase();
    const codeB = b.itemCode.toLowerCase();
    const order = codeA.localeCompare(codeB);
    return itemCodeSortDirection === "asc" ? order : -order;
  });
  itemCodeSortDirection = itemCodeSortDirection === "asc" ? "desc" : "asc";
  updateData();
}

function checkValid(code, data) {
  switch (code) {
    case 1: {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data) {
        return { isValid: false, error: "An email is required." };
      }
      if (!emailPattern.test(data.toLowerCase())) {
        return { isValid: false, error: "Invalid email format." };
      }
      break;
    }
    case 2: {
      if (!data || data.length === 0) {
        return { isValid: false, error: "Fields cannot be left blank." };
      }
      if (data.length < 2 || data.length > 20) {
        return { isValid: false, error: "Invalid name length." };
      }
      break;
    }
    case 3: {
      const comValue = Number.parseFloat(data);
      if (Number.isNaN(comValue)) {
        return { isValid: false, error: "NaN error. Insert a number." };
      }
      if (comValue < 0 || comValue > 100) {
        return { isValid: false, error: "Your number must be between 0-100" };
      }
      break;
    }
    case 4: {
      const numValue = Number.parseFloat(data);
      if (Number.isNaN(numValue)) {
        return { isValid: false, error: "NaN error. Insert a number." };
      }
      if (numValue < 0 || numValue > 1000000) {
        return { isValid: false, error: "Your number must be between 0-1,000,000" };
      }
      break;
    }
    default:
      return { isValid: false, error: "Invalid check code." };
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
  const normalizedEmail = email.trim().toLowerCase();
  if (influencersArray.some((inf) => inf.email === normalizedEmail)) {
    alert("Error: Email already exists. Use a different email.");
    return;
  }

  if (!commissionCheck.isValid) {
    alert("Error in Commission: " + commissionCheck.error);
    return;
  }

  try {
    influencersArray.push(new Influencer(name, email, commission));
    updateData();
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
    alert("Error in Item Code: " + checkItemCode.error);
    return;
  }
  const normalizedItemCode = itemCode.trim().toLowerCase();
  if (itemsArray.some((item) => item.itemCode.toLowerCase() === normalizedItemCode)) {
    alert("Error: Item code already exists. Use a different code.");
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
    itemsArray.push(new Item(itemCode, description, price));
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
    closePopup("itemPopup");
  } catch (exception) {
    alert(exception);
  }
}

function openSalePopup() {
  if (influencersArray.length === 0 || itemsArray.length === 0) {
    alert("Agrega al menos un influencer y un artículo antes de registrar una venta.");
    return;
  }
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
    alert("Error in Quantity: " + checkQuantity.error);
    return;
  }

  try {
    salesArray.push(
      new Sale(nextSaleNumber, itemCode, influencerName, quantity, saleMedium),
    );
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
    globalSaleNumber++;
    document.getElementById("saleQuantity").value = "";
    closePopup("salePopup");
  } catch (exception) {
    alert(exception);
  }
}
