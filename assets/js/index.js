 let precio = 400000;
 let cantidad = 0;

 const precioSpan = document.querySelector(".precio-inicial");
 const cantidadSpan = document.querySelector(".cantidad");
 const totalSpan = document.querySelector(".valor-total");
 const botonMas = document.querySelector("#botonMas");
 const botonMenos = document.querySelector("#botonMenos");

 precioSpan.innerHTML = precio;

 function actualizarTotal() {
   cantidadSpan.innerHTML = cantidad;
   totalSpan.innerHTML = cantidad * precio;
 }

 botonMas.addEventListener('click', function() {
   cantidad++;
   actualizarTotal();
 });

 botonMenos.addEventListener('click', function() {
   if (cantidad > 0) {
     cantidad--;
     actualizarTotal();
   }
 });