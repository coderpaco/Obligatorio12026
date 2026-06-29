/*
==========================================================================
   Author ID: Davit Dostourian Erbe // 281665 // ORT Uruguay, Programación 1
==========================================================================
*/

class Influencer {
  constructor(nombre, correo, comision) {
    this.nombre = nombre.trim();
    this.correo = correo.trim().toLowerCase();
    this.comision = Number(comision);
    this.totalVendido = 0;
    this.etiquetasInfluencer = "";
  }
}

class Articulo {
  constructor(codigoItem, descripcion, precio) {
    this.codigoItem = codigoItem.trim();
    this.descripcion = descripcion.trim();
    this.precio = Number(precio);
  }
}

class Venta {
  constructor(numeroVenta, codigoItem, nombreInfluencer, cantidad, medioVenta) {
    this.numeroVenta = numeroVenta;
    this.codigoItem = codigoItem;
    this.nombreInfluencer = nombreInfluencer;
    this.cantidad = Number(cantidad);
    this.medioVenta = medioVenta;
  }
}

let arregloInfluencers = [];
let arregloItems = [];
let arregloVentas = [];
let numeroVentaGlobal = 1;
