window.addEventListener('load', inicio);
function inicio(){
  //Influencer
  document.getElementById("buttonAgregarInfluencer1").addEventListener("click", agregarInfluencer1);
  document.getElementById("buttonCancelarInfluencer").addEventListener("click", cancelarInfluencer);
  document.getElementById("buttonAgregarInfluencer2").addEventListener("click", agregarInfluencer2);

  //Articulos
  document.getElementById("buttonAgregarArticulo1").addEventListener("click", agregarArticulo1);
  document.getElementById("buttonCancelarArticulo").addEventListener("click", cancelarArticulo);
  document.getElementById("buttonAgregarArticulo2").addEventListener("click", agregarArticulo2);

  //Ventas
  document.getElementById("buttonAgregarVenta1").addEventListener("click", agregarVenta1);
  document.getElementById("buttonCancelarVenta").addEventListener("click", cancelarVenta);
  document.getElementById("buttonAgregarVenta2").addEventListener("click", agregarVenta2);

}


//Influencer
function agregarInfluencer1(){
  alert("Add influencer button.");

}
function cancelarInfluencer(){
  //const texto = document.getElementById("frase").value;
  alert("Canceled.");
}
function agregarInfluencer2(){
  const nombre = document.getElementById("nombreInfluencer").value;
  const email = document.getElementById("mailInfluencer").value;
  const comision = parseInt(document.getElementById("comisionInfluencer").value);
  try {
    alert("Addded influencer " + nombre + " with email " + email + " and " + comision + "% comision");
    document.getElementById('formInfluencer').reset();
  }catch (exception){
    alert("check form data");
  }
}

//Articulos
function agregarArticulo1(){
  //const texto = document.getElementById("frase").value;
  alert("Add Articulo.");
}
function cancelarArticulo(){
  //const texto = document.getElementById("frase").value;
  alert("Canceled.");
}
function agregarArticulo2(){
  const codigo = document.getElementById("codigoArticulo").value;
  const descripcion = document.getElementById("descripcionArticulo").value;
  const precio = parseInt(document.getElementById("precioArticulo").value);

  alert("Addded articulo with code " + codigo + " and description " + descripcion + " and precio $" + precio);

  document.getElementById('formArticulo').reset();
}

//Ventas
function agregarVenta1(){
  //const texto = document.getElementById("frase").value;
  alert("Add Venta.");
}
function cancelarVenta(){
  //const texto = document.getElementById("frase").value;
  alert("Canceled.");
}
function agregarVenta2(){
  const articulo = document.getElementById("numeroVentaDropdown").value;
  const influencer = document.getElementById("nombreInfluencerDropdown").value;
  const cantidad = parseInt(document.getElementById("cantidadVenta").value);
  const medio = document.getElementById("medioVentaDropdown").value;

  alert("Addded venta with code " + articulo + " and influencer " + influencer + " and cantidad " + cantidad + " and medio " + medio);

  document.getElementById('formVentas').reset();
}

function agregarFilaEnTablaInfluencers(nombre, email, comision, total, etiquetas, detalle){
  let tablaPantalla = document.getElementById("tableInfluencers");
  let fila = tablaPantalla.insertRow();
  let celda = fila.insertCell();
  celda.innerHTML= texto;
}

function agregarFilaEnTablaArticulos(codigo, descripcion, precio){
  let tablaPantalla = document.getElementById("tableArticulos");
  let fila = tablaPantalla.insertRow();
  let celda = fila.insertCell();
  celda.innerHTML= texto;
}

function agregarFilaEnTablaVentas(nroVenta, articulo, influencer, cantidad, medio, accion){
  let tablaPantalla = document.getElementById("tableVentas");
  let fila = tablaPantalla.insertRow();
  let celda = fila.insertCell();
  celda.innerHTML= texto;
}

/*
add to a list. using its id "lista" in this case (prolly not used rn)
  function mostrarEnPantalla(textoMostrar){
    document.getElementById("resultado").innerHTML = textoMostrar;
    agregarElementoEnLista(textoMostrar);
  }
function agregarElementoEnLista(texto){
// creo un elemento de lista
  let node = document.createElement("LI");
// creo nodo de texto, dentro lleva el texto que quiero
  let textnode = document.createTextNode(texto);
// engancho al nodo de lista el nodo de texto
  node.appendChild(textnode);
// engancho el nodo a la lista
  document.getElementById("lista").appendChild(node);
}

// adding to a table, using its id tabla in this case
function mostrarEnPantalla(textoMostrar){
  document.getElementById("resultado").innerHTML = textoMostrar;
  agregarElementoEnLista(textoMostrar);
  agregarFilaEnTabla(textoMostrar);
}
function agregarFilaEnTabla(texto){
  let tablaPantalla = document.getElementById("tabla");
  let fila = tablaPantalla.insertRow();
  let celda = fila.insertCell();
  celda.innerHTML= texto;
}

*/
