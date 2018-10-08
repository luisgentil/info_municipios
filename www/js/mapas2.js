//5.2 /////////////////// variables globales y otras gaitas////////////////
    var map;
    var infowindow;
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAqrQVTMQnXBnAtVVnk8HPP11_FG8mqWd4",
  authDomain: "infotown-dc51c.firebaseapp.com",
  databaseURL: "https://infotown-dc51c.firebaseio.com",
  projectId: "infotown-dc51c",
  storageBucket: "infotown-dc51c.appspot.com",
  messagingSenderId: "96620650895"
};
firebase.initializeApp(config);
  var databaseService = firebase.database();

//////////////////////// sección o "bucle" principal  ///////////////////

function initMap() {
  var sitio = {lat: 37.315955, lng: -5.995969}; // {lat: 46.513916, lng: 4.676169}

  map = new google.maps.Map(document.getElementById('map'), {
    center: sitio,
    zoom: 12
  });
  // la función de inicio crea el mapa, y después hace otras cosas (tareas) que están en funciones aparte. 
  // Cada una, con su función de éxito + función de error. 
  // De modo que el éxito de una función se encadene con la siguiente que necesita sus datos.

  var geocoder = new google.maps.Geocoder;
  localizar(map, geocoder); // tarea 
  map.addListener('click', function(e) {  // tarea: escuchar eventos de click sobre el mapa
    reverseGeocode(geocoder, e.latLng, map)}); //  
// tarea: actualizar ubicación
var actualizando = setInterval(function(geocoder){actualizar(map)}, 60000); // 120000 para producción  
} 

// TAREA: buscarSitios
function buscarSitios(position, map) {
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.textSearch({     // búsqueda por texto
      location: position, 
      radius: 5000, 
      query: 'aceite'
    }, callback);
}

// Función de éxito de 'buscarSitios'
function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    var elegidos = [];
  //  console.log(results);
    for (var i = 0; i < results.length; i++) {
      elegidos.push(results[i]); // para añadir todos los resultados
//        if(results[i].types[0] === "point_of_interest") { elegidos.push(results[i]);} //para seleccionar solo algunos resultados
    }
    console.log(elegidos.length);
    for (var j = 0; j < elegidos.length; j++) {
      createMarker(results[j]);}
  }
}

// Función para crear el marcador de los sitios encontrados
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: 'images/ic_place_orange_24px.svg',
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

// Encuentra la situación actual del dispositivo
function localizar(map, geocoder){
  //*===================___función normal, no en modo demo_____=======================
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) { //watchCurrentPosition
      var pos = {lat: position.coords.latitude, lng: position.coords.longitude}; // posición dtectada, en coordenadas
      map.setCenter(pos);
//      map.setZoom(12);
      console.log(geocoder);
//      pintarGlobo(pos, map, "aquí");
      reverseGeocode(geocoder, pos, map); //
      buscarSitios(pos, map);
    }, function() {handleLocationError(true)});
  } 
  else {  // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  } //*
  /*/===================___función para modo demo_____=======================
    var center = map.getCenter();
    var pos = {lat: center.lat() + 0.1, lng: center.lng() + 0.0001};
     map.setCenter(pos);
//      map.setZoom(12);
    console.log(pos);

   //   pintarGlobo(pos, map, "aquí");
      reverseGeocode(geocoder, pos, map); //
      buscarSitios(pos, map);
  /*/// ___fin modo DEMO____
}


// Función de fracaso de 'localizar'
function handleLocationError(browserHasGeolocation) {
  console.log("Error de localización");
}

// Función para marcar la situación actual del dispositivo
function pintarGlobo(latLong, map, info) {
  var infowindow = new google.maps.InfoWindow;
  var marker = new google.maps.Marker({
    position: latLong,
         map: map
    });
  infowindow.setContent(info);
  infowindow.open(map, marker);
}

// Función de Tarea: reverseGeocode, averigua qué hay en el punto del mapa donde se hace click 
function reverseGeocode(geocoder, latLong, map) { //
  geocoder.geocode({'location': latLong, 'language':'es'}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
      // con este código, asigna el valor correspondiente al primer campo 'locality' de entre los que encuentre (suele haber varios)
        var arrayLocalidad = []; // new Array;
        var arrayProvincia = []; 
        var arrayComunidad = [];
      // recorremos todos los resultados obtenidos, normalmente 1 en results[0]
        for (j = 0; j < results.length; j++) {
      // recorremos todos los objetos de address_components, normalmente trae varios
          for(var i in results[j].address_components){
              if (results[j].address_components[i].types[0]==="administrative_area_level_1"){
              arrayComunidad.push(results[j].address_components[i].long_name); 
              break;
            }
              if (results[j].address_components[i].types[0]==="administrative_area_level_2"){
              arrayProvincia.push(results[j].address_components[i].long_name); 
            }
      // cuando encuentra un resultado de tipo locality añadimos el long_name al nuevo array
            if (results[j].address_components[i].types[0]==="locality"){
              arrayLocalidad.push(results[j].address_components[i].long_name); 
      // y salimos del bucle, el resto de address_components ya no interesan POR AHORA
      // como locality está antes que administrative_area_level_2/1, voy a usar este último como criterio break
          }
      // también hay que salir del bucle principal
        if (results[j].address_components[i].types[0]==="administrative_area_level_1"){ break;}
          }
        }
      // de todos los valores que pueda haber encontrado, elegimos el primero 
      var link = '<a href=\"https://es.wikipedia.org/wiki/'+arrayLocalidad[0] +"\""+'>'+arrayLocalidad[0]+ '</a>';
      var info = '<div class="municipio">' + arrayLocalidad[0] + '</div> ';
      var provincia = arrayProvincia[0];
      var comunidad = arrayComunidad[0];
      }
      else { var info ='No results found';}
     }
    else { var info = 'Geocoder failed due to: ' + status;}
    // con el nombre encontrado llamamos a la función para añadirlo al mapa
    pintarGlobo(latLong, map, info);
// y actualizamos el link en la ventana de información
    var miPueblo = comprobarEnWiki(arrayLocalidad[0].toString(), provincia); // 
  // si encuentra el pueblo en Wikipedia, ofrece un enlace a esa página
document.getElementById("info_nombre").innerHTML = link + " - " + provincia+ " - " + comunidad;
// ¿eliminar la siguiente línea tras el desarrollo?
//     document.getElementById('floating-panel').innerHTML = results[0].address_components[2].long_name + " /// " + results[1].address_components[2].long_name;
// busca en la base de datos si hay algo especial de ese municipio
buscarFirebase("municipios", arrayLocalidad[0].toString());
// busca lugares cercanos relacionados con el producto
buscarSitios(latLong, map);
  });
}

// Tarea: actualizar cada x tiempo
function actualizar(map) {
  var geocoder = new google.maps.Geocoder;  // creo que esto es lo que faltaba, pasar un nuevo geocoder en cada actualización
  localizar(map, geocoder); 
}

// Comprobar si existe una página concreta en Wikipedia
function comprobarEnWiki(pueblo, provincia) {
var numero = 0;
var xmlhttp = new XMLHttpRequest();
// cuando obtiene una respuesta ejecuta la function interna
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    var respuesta = JSON.parse(xmlhttp.responseText);
  // primero, comprueba si la resupuesta es un error
    if (respuesta.error) {
  //    console.log(respuesta.error);
      document.getElementById("init_LatLong").innerHTML = "-1"; 
      document.getElementById("info_plus").innerHTML = "no encontrado";}
  //segundo, si no es error analiza la respuesta
    else {
    var numero = respuesta.parse.pageid;
  // busca dónde comienza el texto destacado en la presentación dentro de la respuesta
    var comienzo = respuesta.parse.text["*"].indexOf('<p><b>'); 
    var terminac_destacado = respuesta.parse.text["*"].indexOf('<h2>') - 1;
    var presentación =respuesta.parse.text["*"].substring(comienzo, terminac_destacado);
    var terminac_normal = presentación.indexOf('</p>') ;// con <h2> , toda la presentación // con indexOf('h2') localiza dónde comienza el apartado "Índice", que comienza con un h2 que debe ser el primero de la página. '-1' para evitar signo '<'.
    var primer_parrafo =presentación.substring(0, terminac_normal);

    // el texto de presentación COMPLETO es el contenido entre el primer indexOf y el segundo indexOf; el PRIMER PÁRRAFO es el texto hasta </p>, salvo en artículos destacados, que tienen introducción y lían la cosa. Una solución más general: seleccionar toda la introducción, mediante comienzo-terminac_destacado, que da el mismo resultado en todos los casos (pueblos y destacados); sobre esta selección, hacer una segunda selección buscando </p>, que ahora sí será mayor que comienzo en todos los casos. El primer párrafo será siempre entre comienzo y terminac_normal.  
    document.getElementById("info_plus").innerHTML = primer_parrafo;
        }
    // secciones y links ////
    var link = 'href=\"https://es.wikipedia.org/wiki/'+pueblo +'#';
    for (x in respuesta.parse.sections){
      var sectionLink = link + respuesta.parse.sections[x].line;
      sectionLink = sectionLink.replace(/\s/g,"_");
      document.getElementById("info_plus").innerHTML += '<a '+ sectionLink +"\"" + ">" + respuesta.parse.sections[x].line + "</a>" + " - "}; //así se crea una lista de secciones con links --- 
   } //y aqui
  }// y aqui
var consulta = "https://es.wikipedia.org/w/api.php?action=parse&page="+ pueblo +"&format=json&origin=*";
//los pueblos como Estepa no ofrecen resultados, porque son nombres ambiguos.   BUG 2 
xmlhttp.open ("GET", consulta, true); 
xmlhttp.send();
}

// Encontrar datos del municipio, ¿o PR, o CCAA, en FireBase? ¿una función o dos?
function buscarFirebase(ambito, pueblo) {
 var ref = databaseService.ref(ambito);
 ref.child(pueblo.toLowerCase()).on("value", function(snapshot){resultado = (snapshot.val() || "(sin datos)");
  document.getElementById("productoTipico").textContent = "Productos típicos: "  + resultado;
});
}

 // }esto cierra el bubcle principal, en lugar de la llave de cierre en 33