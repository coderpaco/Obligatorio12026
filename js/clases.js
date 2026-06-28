/*
==========================================================================
   Author ID: Davit Dostourian Erbe // 281665 // ORT Uruguay, Programación 1
==========================================================================
*/

class Influencer {
  constructor(name, email, commission) {
    this.name = name.trim();
    this.email = email.trim().toLowerCase();
    this.commission = Number(commission);
    this.totalSold = 0;
    this.influencerTags = "";
  }
}

class Item {
  constructor(itemCode, description, price) {
    this.itemCode = itemCode.trim();
    this.description = description.trim();
    this.price = Number(price);
  }
}

class Sale {
  constructor(saleNumber, itemCode, influencerName, quantity, saleMedium) {
    this.saleNumber = saleNumber;
    this.itemCode = itemCode;
    this.influencerName = influencerName;
    this.quantity = Number(quantity);
    this.saleMedium = saleMedium;
  }
}

const influencersArray = [];
const itemsArray = [];
const salesArray = [];
let globalSaleNumber = 1;
