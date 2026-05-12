/*
   ==========================================================================
   Author ID: Davit Dostourian Erbe // 281665 // ORT Uruguay, Programacion 1
   ==========================================================================
*/

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
  const commission = parseInt(document.getElementById("comisionInfluencer").value);
  if(nombre!="" && email!=""){
    try {
      alert("Addded influencer " + nombre + " with email " + email + " and " + commission + "% commission");
      document.getElementById('formInfluencer').reset();
    }catch (exception){
      alert("check form data");
    }
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

window.onload = function() { //found on stack overflow, through google AI: https://stackoverflow.com/questions/72869394/append-a-whole-footer-into-an-html-page-thanks-to-js
  // Create footer element
  const footerElement = document.createElement('footer');

  // Use innerHTML to quickly add a link
  footerElement.innerHTML = `
        <p>Davit Dostourian Erbe, 281664. Autor 2, Num estudiante. |
           <a href=https://ort.edu.uy target="_blank" rel="noopener noreferrer">Estudiante 1</a>
           <a href=https://ort.edu.uy target="_blank" rel="noopener noreferrer">Estudiante 2</a>
        </p>
    `;

  // Add to the end of the document body
  document.body.appendChild(footerElement);
};


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
