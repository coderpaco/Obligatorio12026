/*
==========================================================================
   Author ID: Davit Dostourian Erbe // 281665 // ORT Uruguay, Programación 1
==========================================================================
*/

window.addEventListener("load", inicio);

//define our starting sort values
let direccionOrdenNombreInfluencer = "asc";
let direccionOrdenCodigoItem = "asc";

function inicio() {
  // Influencer
  document
    .getElementById("botonAgregarInfluencer1")
    .addEventListener("click", abrirAgregarInfluencer);
  document
    .getElementById("botonCancelarInfluencer")
    .addEventListener("click", cancelarInfluencer);
  document
    .getElementById("botonAgregarInfluencer2")
    .addEventListener("click", agregarInfluencer);
  document
    .getElementById("influencerCambiarOrdenBoton")
    .addEventListener("click", ordenarInfluencersPorNombre);

  // Articles
  document
    .getElementById("botonAgregarArticulo1")
    .addEventListener("click", abrirPopupArticulo);
  document
    .getElementById("botonCancelarArticulo")
    .addEventListener("click", cancelarArticulo);
  document.getElementById("botonAgregarArticulo2").addEventListener("click", agregarArticulo);
  document
    .getElementById("cambiarOrdenArticulosBoton")
    .addEventListener("click", ordenarArticulosPorCodigo);

  // Sales (Ventas)
  document
    .getElementById("botonAgregarVenta")
    .addEventListener("click", abrirPopupVentas);
  document
    .getElementById("botonCancelarVenta")
    .addEventListener("click", cancelarVenta);
  document.getElementById("botonAgregarVenta2").addEventListener("click", agregarVenta);
  recargarDatos();
}

// Add click handlers for buttons inserted after page load. ventas and removesale buttons)
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (evento) => { //check clicks on the page and see if the clicked part is a button w label "showSalesButton" or "removeSaleButton"
    if (evento.target.classList.contains("botonMostrarVentas")) { //if button is showsalesbutton
      let fila = evento.target.closest("tr"); //finds closest row to the button (basically the buttons row)
      let nombreInfluencer = fila.cells[0].textContent.trim(); //get influencer name from first cell of row

      let ventasInfluencer = arregloVentas.filter( //filter arregloVentas for all sales w that name
        (venta) => venta.nombreInfluencer === nombreInfluencer,
      );

      if (ventasInfluencer.length === 0) { //if none...
        alert(`No hay ventas encontrado para ${nombreInfluencer}.`);
        return;
      }

      let detalles = "";
      for (let indice = 0; indice < ventasInfluencer.length; indice++) {
        let venta = ventasInfluencer[indice];
        let articulo = arregloItems.find((filaArticulo) => filaArticulo.codigoItem === venta.codigoItem);
        let influencer = arregloInfluencers.find(
          (influencerActual) => influencerActual.nombre === nombreInfluencer,
        );
        let precioUnitario = Number(articulo.precio);
        let precioTotal = precioUnitario * venta.cantidad;
        let porcentajeComision = Number(influencer.comision);
        let montoComision = (precioTotal * porcentajeComision) / 100;
        let codigoItem = articulo.codigoItem;

        detalles +=
          "Venta " +
          venta.numeroVenta +
          " ⇥ " +
          venta.cantidad +
          " ⇥ " +
          codigoItem +
          " ⇥ $" +
          precioUnitario.toFixed(2) +
          " c/u Total $" +
          precioTotal.toFixed(2) +
          " ⇥ Comisión: $" +
          montoComision.toFixed(2);

        if (indice < ventasInfluencer.length - 1) { //if less than arraylength-1 we get a new line
          detalles += "\n";
        }
      }

      alert(`Ventas de ${nombreInfluencer}:\n\n${detalles}`); //join the influencer name and their sales
      return;
    }

    if (evento.target.classList.contains("botonBorrarVenta")) { // check if the clicked button is removeSaleButton
      let fila = evento.target.parentElement.parentElement; //identify parent sale
      let ventaAEliminar = fila.cells[0].textContent.trim(); //get its sale number
      let indiceArray = arregloVentas.findIndex( // find  sale in  arregloVentas by sale number
        (venta) => String(venta.numeroVenta).trim() === ventaAEliminar,
      );
      if (indiceArray !== -1) {
        arregloVentas.splice(indiceArray, 1); //remove sale from array IF it exists
      } else {
        console.warn(`No se pudo encontrar el número de venta ${ventaAEliminar} en el array.`); //nope no sale
      }
      recargarDatos(); //update data again
    }
  });
});

function recargarDatos() { //run this every time data is changed to update everything
  agregarEtiquetas();
  recargarTablas();
  llenarListas();
  recargarBurbujas();
  recargarBotonesVentas();
}

function mostrarPopup(identificadorPopup) {
  let elemento = document.getElementById(identificadorPopup); 
  if (elemento) { // if element is found (the popup id) remove its hidden property class so it's shown
    elemento.classList.remove("hidden");
  }
}

function recargarBotonesVentas() {  // check if we have influencers and items.
    // if they BOTH exist, we can add a venta/sale. otherwise, the ventas category can't be interacted with
  let tieneInfluencers = arregloInfluencers.length > 0;
  let tieneItems = arregloItems.length > 0;
  let ventasHabilitadas = tieneInfluencers && tieneItems;
  let controles = [
    "botonAgregarVenta",
    "botonCancelarVenta",
    "botonAgregarVenta2",
    "selecionarNumeroVentaLista",
    "selecionarInfluencerLista",
    "cantidadVentas",
    "selectionarMedioLista",
  ];

  for (let indiceControl = 0; indiceControl < controles.length; indiceControl++) {
    const identificador = controles[indiceControl];
    const elemento = document.getElementById(identificador);
    if (elemento) { //disable or enable id elements based on salesenabled value
      elemento.disabled = !ventasHabilitadas;
    }
  }
}

function cerarPopup(identificadorPopup) { //cancel button
  let elemento = document.getElementById(identificadorPopup);
  if (elemento) { //if an element has the popupid class it should be hidden
    elemento.classList.add("hidden");
  }
}

function recargarBurbujas() {  // update graph based off sales
  let grafoBurbuja = document.getElementById("grafoBurbujas");
  if (!grafoBurbuja) return;

  let medios = [ //color pallete for the apps taken from what i think best fits them (googlesearched their color palletes)
    { value: "1-Instagram", label: "1 - Instagram", color: "#8134af" },
    { value: "2-Youtube", label: "2 - YouTube", color: "#ff0000" },
    { value: "3-X", label: "3 - X", color: "#919829" },
    { value: "4-TikTok", label: "4 - TikTok", color: "#14ba35" },
    { value: "5-Facebook", label: "5 - Facebook", color: "#2e86de" },
    { value: "6-Otras", label: "6 - Otras", color: "#7f8c8d" },
  ];    

  let totales = [];

   // we have our totals array, now we gotta create a bubble for each sale medium
   // - create div circle, calc bubble size based on total sales amt, then add bubble
   //make sure bubble has label and $$$ amt

  for (let indice = 0; indice < medios.length; indice++) {
    let medio = medios[indice];
    let total = 0;
    
    // identify sales medium, and loop thru its sales
    for (let indiceVenta = 0; indiceVenta < arregloVentas.length; indiceVenta++) {
      let venta = arregloVentas[indiceVenta];
      
      //count relevant sales only
      if (venta.medioVenta === medio.value) {
        // ...find the sale item
        let articulo = null;
        for (let indiceArticulo = 0; indiceArticulo < arregloItems.length; indiceArticulo++) {
          if (arregloItems[indiceArticulo].codigoItem === venta.codigoItem) {
            articulo = arregloItems[indiceArticulo];
            break;
          }
        }
        
        let precioUnitario = Number(articulo.precio);
        let montoVenta = precioUnitario * Number(venta.cantidad);
        total = total + montoVenta;//calculate sale amt
      }
    }
    
    //new object with medium info AND its total
    let medioVentaConTotal = {
      value: medio.value,
      label: medio.label,
      color: medio.color,
      total: total
    };
    
    totales.push(medioVentaConTotal);// track this to later graph with bubbles
  }

  //check our totals array for the highest amt and set that
  let totalMaximo = 0;
  for (let indice = 0; indice < totales.length; indice++) {
    if (totales[indice].total > totalMaximo) {
      totalMaximo = totales[indice].total;
    }
  }
    
  let radioMaximo = 100;
  let radioMinimo = Math.round(radioMaximo * 0.10); // 10% of maxRadius

  grafoBurbuja.innerHTML = ""; //clear any current bubble data
  
  //create a bubble for each sales medium
  for (let indice = 0; indice < totales.length; indice++) {
    let medio = totales[indice];
    
    // calc radius size within min-max radius
    let proporcion = 0;
    if (totalMaximo > 0) {
      proporcion = medio.total / totalMaximo;
    }
    
    let radio = radioMinimo + proporcion * (radioMaximo - radioMinimo);   
    if (radio > radioMaximo) {
      radio = radioMaximo;
    }
    
    //create the bubble in html
    let burbuja = document.createElement("div"); //create bubble document data
    burbuja.className = "burbuja-item"; //style css
    
    let totalMostrado = "0";
    if (medio.total > 0) {
      totalMostrado = "$" + medio.total.toFixed(0); //toFixed 0 makes it a whole number (0 numbers after decimal point)
    }
    
    //build the bubble html with the previously defined data. this is done here 
    //instead of html/css because the bubble size is based on the data that gets calculated first
    burbuja.innerHTML = "<div class='burbuja-dot' style='width:" + (radio * 2) + "px; height:" + (radio * 2) + "px; background:" + medio.color + ";'>" + totalMostrado + "</div><div class='burbuja-label'>" + medio.label + "</div>";
    
    grafoBurbuja.appendChild(burbuja);
  }
}

function agregarEtiquetas() {
  if (arregloInfluencers.length === 0) { // if there are no influencers, do nothing
    return;
  }

  // Reset fields on each influencer object.
  for (let indiceInfluencer = 0; indiceInfluencer < arregloInfluencers.length; indiceInfluencer++) {
    let influencer = arregloInfluencers[indiceInfluencer];
    influencer.ingresosTotales = 0;
    influencer.comisionTotal = 0;
    influencer.montoVentaMayor = 0;
    influencer.cantidadVentas = 0;
    influencer.etiquetasInfluencer = "";
  }

  for (let indiceVenta = 0; indiceVenta < arregloVentas.length; indiceVenta++) { // iterate through each sale and update the influencer directly
    let venta = arregloVentas[indiceVenta];
    let articulo = arregloItems.find((filaArticulo) => filaArticulo.codigoItem === venta.codigoItem);
    let precioUnitario = Number(articulo.precio);
    let montoVenta = precioUnitario * Number(venta.cantidad);
    let influencer = arregloInfluencers.find(
      (influencerActual) => influencerActual.nombre === venta.nombreInfluencer,
    );

    if (influencer) {
      influencer.ingresosTotales += montoVenta;
      influencer.cantidadVentas += 1;
      influencer.montoVentaMayor = Math.max(influencer.montoVentaMayor, montoVenta);
      influencer.comisionTotal += (montoVenta * Number(influencer.comision)) / 100;
    }
  }

  let influencerMayorComision = null;
  let montoMayorComision = 0;
  for (let indice = 0; indice < arregloInfluencers.length; indice++) {
    let influencer = arregloInfluencers[indice];
    if (influencer.comisionTotal > montoMayorComision) {
      montoMayorComision = influencer.comisionTotal;
      influencerMayorComision = influencer;
    }
  }

  let propietarioMejorVenta = null;
  let ventaUnicaMayor = 0;
  for (let indice = 0; indice < arregloInfluencers.length; indice++) {
    let influencer = arregloInfluencers[indice];
    if (influencer.montoVentaMayor > ventaUnicaMayor) {
      ventaUnicaMayor = influencer.montoVentaMayor;
      propietarioMejorVenta = influencer.nombre;
    }
  }

  for (let indice = 0; indice < arregloInfluencers.length; indice++) {
    let influencer = arregloInfluencers[indice];
    let etiquetas = [];

    if (influencerMayorComision && influencer.nombre === influencerMayorComision.nombre) {
      etiquetas.push("🔥");
    }
    if (influencer.cantidadVentas === 0) {
      etiquetas.push("🧊");
    }
    if (propietarioMejorVenta === influencer.nombre && influencer.cantidadVentas > 0) {
      etiquetas.push("🟢");
    }

    influencer.totalVendido = influencer.comisionTotal;
    influencer.etiquetasInfluencer = etiquetas.join(" ");
  }
}

function recargarTablas() {
  let tieneDatos =
    arregloInfluencers.length > 0 || arregloItems.length > 0 || arregloVentas.length > 0;

  if (!tieneDatos) {
    return;
  }

  const cuerposTabla = document.querySelectorAll(".tableBody");
  for (let indiceCuerpoTabla = 0; indiceCuerpoTabla < cuerposTabla.length; indiceCuerpoTabla++) {
    cuerposTabla[indiceCuerpoTabla].innerHTML = "";
  }

  for (let indice = 0; indice < arregloInfluencers.length; indice++) {
    let cuerpoTabla = document.querySelector("#tablaInfluencers .tableBody");
    let fila = cuerpoTabla.insertRow();
    let datos = [
      arregloInfluencers[indice].nombre,
      arregloInfluencers[indice].correo,
      arregloInfluencers[indice].comision + "%",
      "$ " + arregloInfluencers[indice].totalVendido,
      arregloInfluencers[indice].etiquetasInfluencer,
      "",
    ];

    for (let indiceCelda = 0; indiceCelda < datos.length - 1; indiceCelda++) {
      let celda = fila.insertCell();
      celda.textContent = datos[indiceCelda];
    }

    let celda = fila.insertCell();
    let boton = document.createElement("button");
    boton.textContent = "Ventas";
    boton.className = "botonMostrarVentas";
    celda.appendChild(boton);
  }

  let conteoVentasArticulo = arregloItems.reduce((acumulador, articulo) => {
    acumulador[articulo.codigoItem] = 0;
    return acumulador;
  }, {});

  for (let indiceVenta = 0; indiceVenta < arregloVentas.length; indiceVenta++) {
    let venta = arregloVentas[indiceVenta];
    if (conteoVentasArticulo[venta.codigoItem] !== undefined) {
      conteoVentasArticulo[venta.codigoItem] += Number(venta.cantidad);
    }
  }

  let codigoArticuloTop = null;
  let ventasArticuloTop = 0;
  let entradasConteo = Object.entries(conteoVentasArticulo);
  for (let indiceEntrada = 0; indiceEntrada < entradasConteo.length; indiceEntrada++) {
    let codigoItem = entradasConteo[indiceEntrada][0];
    let cantidad = entradasConteo[indiceEntrada][1];
    if (cantidad > ventasArticuloTop) {
      ventasArticuloTop = cantidad;
      codigoArticuloTop = codigoItem;
    }
  }

  for (let indice = 0; indice < arregloItems.length; indice++) {
    let cuerpoTabla = document.querySelector("#itemTable .tableBody");
    let fila = cuerpoTabla.insertRow();
    let codigoItemConEtiqueta =
      arregloItems[indice].codigoItem + (arregloItems[indice].codigoItem === codigoArticuloTop ? " ⭐" : "");
    let datos = [
      codigoItemConEtiqueta,
      arregloItems[indice].descripcion,
      "$ " + arregloItems[indice].precio,
    ];

    for (let indiceCelda = 0; indiceCelda < datos.length; indiceCelda++) {
      let celda = fila.insertCell();
      celda.textContent = datos[indiceCelda];
    }
  }

  for (let indice = 0; indice < arregloVentas.length; indice++) {
    let cuerpoTabla = document.querySelector("#tablaVentas .tableBody");
    let fila = cuerpoTabla.insertRow();
    let datos = [
      arregloVentas[indice].numeroVenta,
      arregloVentas[indice].codigoItem,
      arregloVentas[indice].nombreInfluencer,
      arregloVentas[indice].cantidad,
      arregloVentas[indice].medioVenta,
      "",
    ];

    for (let indiceCelda = 0; indiceCelda < datos.length - 1; indiceCelda++) {
      let celda = fila.insertCell();
      celda.textContent = datos[indiceCelda];
    }

    let celda = fila.insertCell();
    let boton = document.createElement("button");
    boton.textContent = "❌";
    boton.className = "botonBorrarVenta";
    celda.appendChild(boton);
  }
}

function llenarListas() {
  let desplegableInfluencer = document.getElementById("selecionarInfluencerLista");
  if (desplegableInfluencer) {
    desplegableInfluencer.innerHTML = "";
    if (arregloInfluencers.length > 0) {
      for (let indiceInfluencer = 0; indiceInfluencer < arregloInfluencers.length; indiceInfluencer++) {
        let influencer = arregloInfluencers[indiceInfluencer];
        let nuevaOpcion = new Option(influencer.nombre, influencer.nombre);
        desplegableInfluencer.add(nuevaOpcion);
      }
    } else {
        //we shouldnt even see this bc the popup is hidden, but just in case for debugging
      desplegableInfluencer.add(new Option("Sin influencers", ""));
    }
  }

  let desplegableItems = document.getElementById("selecionarNumeroVentaLista");
  if (desplegableItems) {
    desplegableItems.innerHTML = "";
    if (arregloItems.length > 0) {
      for (let indiceItem = 0; indiceItem < arregloItems.length; indiceItem++) {
        let articulo = arregloItems[indiceItem];
        let nuevaOpcion = new Option(articulo.codigoItem, articulo.codigoItem);
        desplegableItems.add(nuevaOpcion);
      }
    } else {
        //we also shouldnt  see this bc the popup is hidden, but add something for debugging
      desplegableItems.add(new Option("Sin artículos", ""));
    }
  }
}

function ordenarInfluencersPorNombre() { //sort function for the influencer for asc and desc order
  arregloInfluencers.sort((a, b) => {
    let nombreA = a.nombre.toLowerCase();
    let nombreB = b.nombre.toLowerCase();
    let orden = nombreA.localeCompare(nombreB);
    return direccionOrdenNombreInfluencer === "asc" ? orden : -orden; // asc is normal ascending, desc is reversed order
  });
  direccionOrdenNombreInfluencer = direccionOrdenNombreInfluencer === "asc" ? "desc" : "asc"; //update sort direction for next click. if asc then desc, if desc then asc
  recargarDatos();
}

function ordenarArticulosPorCodigo() { //sort func for item codes for asc and desc
  arregloItems.sort((a, b) => {
    let codigoA = a.codigoItem.toLowerCase();
    let codigoB = b.codigoItem.toLowerCase();
    let orden = codigoA.localeCompare(codigoB);
    return direccionOrdenCodigoItem === "asc" ? orden : -orden;
  });
  direccionOrdenCodigoItem = direccionOrdenCodigoItem === "asc" ? "desc" : "asc"; //same sort update as before
  recargarDatos();
}

function chequearValido(codigo, datos) { //check data validity with a switch case
  switch (codigo) {
    case 1: {
      let patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //regex email validation
      if (!datos) {
        return { isValid: false, error: "Un email es requerido." };
      }
      if (!patronCorreo.test(datos.toLowerCase())) {
        return { isValid: false, error: "Formato de email inválido." };
      }
      break;
    }
    case 2: {
      if (!datos || datos.length === 0) {
        return { isValid: false, error: "Los campos no pueden estar vacíos." };
      }
      if (datos.length < 2 || datos.length > 20) {
        return { isValid: false, error: "Nombre invalido. (2-20 caracteres)" };
      }
      break;
    }
    case 3: {
      let valorComision = Number.parseFloat(datos);
      if (Number.isNaN(valorComision)) {
        return { isValid: false, error: "NaN. Ingrese un número válido." };
      }
      if (valorComision < 0 || valorComision > 100) {
        return { isValid: false, error: "Su número debe estar entre 0-100" };
      }
      break;
    }
    case 4: {
      let valorNumerico = Number.parseFloat(datos);
      if (Number.isNaN(valorNumerico)) {
        return { isValid: false, error: "NaN. Ingrese un número válido." };
      }
      if (valorNumerico < 0 || valorNumerico > 1000000) {
        return { isValid: false, error: "Su número debe estar entre 0-1,000,000" };
      }
      break;
    }
    default:
      return { isValid: false, error: "Invalid check code." }; //debug
  }

  return { isValid: true, error: "" };
}

function abrirAgregarInfluencer() {
  mostrarPopup("influencerPopup");
}

function cancelarInfluencer() {
  cerarPopup("influencerPopup");
  document.getElementById("formularioInfluencers").reset();
}

function agregarInfluencer() {
  let nombre = document.getElementById("nombreInfluencer").value;
  let correo = document.getElementById("emailInfluencer").value;
  let comision = Number.parseFloat(
    document.getElementById("comisionInfluencer").value,
  );
//validation
  let verificacionNombre = chequearValido(2, nombre);
  let verificacionCorreo = chequearValido(1, correo);
  let verificacionComision = chequearValido(3, comision);
  if (!verificacionNombre.isValid) {
    alert("Error en Nombre: " + verificacionNombre.error);
    return;
  }
  if (!verificacionCorreo.isValid) {
    alert("Error en Email: " + verificacionCorreo.error);
    return;
  }
  let correoMinusculas = correo.trim().toLowerCase(); //ensure it is unique
  if (arregloInfluencers.some((influencer) => influencer.correo === correoMinusculas)) { //find if the email exists anywhere at least once
    alert("Error: Email ya existe. Ingrese otro email.");
    return;
  }

  if (!verificacionComision.isValid) {
    alert("Error en Comisión: " + verificacionComision.error);
    return;
  }

  arregloInfluencers.push(new Influencer(nombre, correo, comision));
  recargarDatos();
  alert(
    "Influencer agregado con nombre " +
      nombre +
      " y email " +
      correo +
      " y comisión " +
      comision +
      "%",
  );
  document.getElementById("formularioInfluencers").reset();
  cerrarPopup("influencerPopup");
}

function abrirPopupArticulo() {
  mostrarPopup("itemPopup");
}

function cancelarArticulo() {
  cerarPopup("itemPopup");
  document.getElementById("formularioArticulos").reset();
}

function agregarArticulo() {
  let codigoItem = document.getElementById("codigoArticulo").value;
  let descripcion = document.getElementById("descripcionArticulo").value;
  let precio = Number.parseFloat(document.getElementById("precioArticulo").value);

  let verificacionCodigoItem = chequearValido(2, codigoItem);
  let verificacionDescripcion = chequearValido(2, descripcion);
  let verificacionPrecio = chequearValido(4, precio);
  if (!verificacionCodigoItem.isValid) {
    alert("Error en Código de Articulo: " + verificacionCodigoItem.error);
    return;
  }
  let codigoItemMinusculas = codigoItem.trim().toLowerCase(); //same check as influencer, ensure unique within item array
  if (arregloItems.some((articulo) => articulo.codigoItem.toLowerCase() === codigoItemMinusculas)) {
    alert("Error: Código de artículo ya existe. Ingrese otro codigo.");
    return;
  }
  if (!verificacionDescripcion.isValid) {
    alert("Error en Descripcion: " + verificacionDescripcion.error);
    return;
  }
  if (!verificacionPrecio.isValid) {
    alert("Error en Precio: " + verificacionPrecio.error);
    return;
  }

  arregloItems.push(new Articulo(codigoItem, descripcion, precio));
  recargarDatos();
  alert(
    "Articulo agregado con código " +
      codigoItem +
      " y descripción " +
      descripcion +
      " y precio $" +
      precio,
  );
  document.getElementById("formularioArticulos").reset();
  cerarPopup("itemPopup");
}

function abrirPopupVentas() {
    /* //unneeded alert
  if (arregloInfluencers.length === 0 || arregloItems.length === 0) {
    alert("Agrega al menos un influencer y un artículo antes de registrar una venta.");
    return;
  }
    */
  mostrarPopup("ventasPopup");
}

function cancelarVenta() {
  cerarPopup("ventasPopup");
  document.getElementById("formVentas").reset();
}

function agregarVenta() {
  let siguienteNumeroVenta = numeroVentaGlobal;
  let codigoItem = document.getElementById("selecionarNumeroVentaLista").value;
  let nombreInfluencer = document.getElementById("selecionarInfluencerLista").value;
  let cantidad = Number.parseInt(
    document.getElementById("cantidadVentas").value,
  );
  let medioVenta = document.getElementById("selectionarMedioLista").value;

  let verificacionCantidad = chequearValido(4, cantidad);
  if (!verificacionCantidad.isValid) {
    alert("Error en Cantidad: " + verificacionCantidad.error);
    return;
  }

  arregloVentas.push(
    new Venta(siguienteNumeroVenta, codigoItem, nombreInfluencer, cantidad, medioVenta),
  );
  recargarDatos();
  alert(
    "Venta agregada con código de artículo " +
      codigoItem +
      " y influencer " +
      nombreInfluencer +
      " y cantidad " +
      cantidad +
      " y medio " +
      medioVenta,
  );
  numeroVentaGlobal++;
  document.getElementById("cantidadVentas").value = "";
  cerarPopup("ventasPopup");
}
