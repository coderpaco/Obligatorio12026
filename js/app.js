/*
   ==========================================================================
   Author ID: Davit Dostourian Erbe // 281665 // ORT Uruguay, Programacion 1
   ==========================================================================
    TODO:
     - is using form.reset() the best way to reset form? or set values to ""
     - add values to tables/dropdowns
     - make sure the value of each sale (salenumber) increments by one when added, and decreases/changes
       when a sale is deleted. (sale 1. next sale 2. sale 3. sale 2 deleted, sale 3 becomes sale2?
       OR do the sales stay the same number?
*/
/*
- Make sure to check that articulo codigo is unique
- each sale corresponds to only one articulo
- can only be registered if there are articles and influencers (while there arent, hide/disable button and fields)
- order articles table decreasing/increasing by article codigo

1. Parse input data
2. Validate data (use a seperate function to do this probably, function verifyData(name,email)etc
3. If ok: save data, add to tables, reload elements
4. if not ok, prompt reinput

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
  alert("open Add influencer popup.");

}
function cancelarInfluencer(){
  document.getElementById('formInfluencer').reset();
  //this should probably also close the popup
  alert("Canceled.");
}
function agregarInfluencer2(){
  const nombre = document.getElementById("nombreInfluencer").value;
  const email = document.getElementById("mailInfluencer").value;
  const commission = parseInt(document.getElementById("comisionInfluencer").value);
  if(nombre!=="" && email!=="" && !Number.isNaN(commission)){
    try {
      agregarFilaEnTablaInfluencers(nombre, email, commission, 0, "")
      alert("Addded influencer " + nombre + " with email " + email + " and " + commission + "% commission");
      document.getElementById('formInfluencer').reset();
    }catch (exception){
      alert(exception);
    }
  } else{
    alert("invalid name, email, or comission. try again.");
  }
}

//Articulos
function agregarArticulo1(){
  //const texto = document.getElementById("frase").value;
  alert("Open add Articulo popup.");
}
function cancelarArticulo(){
  document.getElementById('formArticulo').reset();
  //this should probably also close the popup

  alert("Canceled.");
}
function agregarArticulo2(){
  const codigo = document.getElementById("codigoArticulo").value;
  const descripcion = document.getElementById("descripcionArticulo").value;
  const precio = parseInt(document.getElementById("precioArticulo").value);
  if(codigo!=="" && descripcion!=="" && !Number.isNaN(precio)){
    try {
      agregarFilaEnTablaArticulos(codigo, descripcion, precio);
      alert("Addded articulo with code " + codigo + " and description " + descripcion + " and precio $" + precio);
      document.getElementById('formArticulo').reset();
    }catch (exception){
      alert(exception);
    }
  } else{
    alert("invalid code, description, or number.");
  }
}

//Ventas
function agregarVenta1(){
  //const texto = document.getElementById("frase").value;
  alert("open add Venta popup.");
}
function cancelarVenta(){
  document.getElementById('formVentas').reset();
  //this should probably also close the popup

  alert("Canceled.");
}
function agregarVenta2(){
  let nroVenta = 1;
  const articulo = document.getElementById("numeroVentaDropdown").value;
  const influencer = document.getElementById("nombreInfluencerDropdown").value;
  const cantidad = parseInt(document.getElementById("cantidadVenta").value);
  const medio = document.getElementById("medioVentaDropdown").value;

  if(!Number.isNaN(cantidad)){
    try {
      agregarFilaEnTablaVentas(nroVenta, articulo, influencer, cantidad, medio);
      alert("Addded venta with code " + articulo + " and influencer " + influencer + " and cantidad " + cantidad + " and medio " + medio);
      document.getElementById('formVentas').reset();
      nroVenta++; //start w first venta, then add one.
    }catch (exception){
      alert(exception);
    }
  } else {
    alert("not a number, check form data and try again");
  }
}

function agregarFilaEnTablaInfluencers(nombre, email, comision, total, etiquetas){
  let tablaPantalla = document.getElementById("tableInfluencers");
  let fila = tablaPantalla.insertRow();
  let datos = [nombre, email, comision+"%", "$ "+total, etiquetas]; //join $ to the total dollar amt

  for(let i=0;i<datos.length;i++){
    let celda = fila.insertCell();
    celda.innerHTML= datos[i];
  }
  //add a final cell after with Ventas button
}

function agregarFilaEnTablaArticulos(codigo, descripcion, precio){
  let tablaPantalla = document.getElementById("tableArticulos");
  let fila = tablaPantalla.insertRow();
  let datos = [codigo, descripcion, "$ "+precio];

  for(let i=0;i<datos.length;i++){
    let celda = fila.insertCell();
    celda.innerHTML= datos[i];
  }

}

function agregarFilaEnTablaVentas(nroVenta, articulo, influencer, cantidad, medio){
  let tablaPantalla = document.getElementById("tableVentas");
  let fila = tablaPantalla.insertRow();
  let datos = [nroVenta, articulo, influencer, cantidad, medio];

  for(let i=0;i<datos.length;i++){
    let celda = fila.insertCell();
    celda.innerHTML= datos[i];
  }
  //add a final cell after with the delete button
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
