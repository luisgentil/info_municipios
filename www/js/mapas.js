//4.0.1/////////////////// variables globales y otras gaitas////////////////
var initLatLong = {lat: 37.893949, lng: -6.749115};  // coordenadas de inicio ;)37.893949, -6.749115
var initZoom = 8;                                        //37.419193,-5.991978 estas son las coordenadas de sevilla 
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
// el mapa se inicia
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
  zoom: initZoom,
  center: initLatLong       //{lat: 40.731, lng: -73.997}
  });
  
  /*  // Encuentra la situación actual del dispositivo
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {lat: position.coords.latitude, lng: position.coords.longitude};
      reverseGeocode(geocoder, pos, map);
      map.setCenter(pos);
      map.setZoom(12);
    }, function() {handleLocationError(true)});
  } 
  else {  // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  */
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;

  localizar(map, geocoder);

  // con este eventListener accedemos a las coordenadas del click
  map.addListener('click', function(e) {
    reverseGeocode(geocoder, e.latLng, map)}); //  mostrarInfo(e.latLng, map, "foo")});

  
  //  document.getElementById('submit').addEventListener('click', function() {
  //  geocodeLatLng(geocoder, map, infowindow);
  //  });
  //}
  // 
  var actualizando = setInterval(function() {actualizar(map, geocoder)}, 120000); // este valor debería ser 60000, al menos, 
                                                  // pero lo dejo para test en PhoneGap

//////////////////////fin del bucle principal, comienza la sección de funciones ///////////////////
// Otras funciones para al App, algunas sirven y otras no XD

function actualizar(map, geocoder) {
  //var d = new Date ();// elimino esta línea, solo sirve en desarrollo
  //  var map = new google.maps.Map(document.getElementById('map'));
  //  var geocoder = new google.maps.Geocoder;
  //  var infowindow = new google.maps.InfoWindow;
  //document.getElementById("info_plus").innerHTML = "actualizando..." + d.toLocaleTimeString(); // elimino esta línea, solo sirve en desarrollo
  //var nuevaPos = navigator.geolocation.watchPosition(function(){pintarGlobo(initLatLong, map,info)}, function() {handleLocationError(true)});
  localizar(map, geocoder); // esto ahora va, pero creo que no es lo ideal. probar en phone gap

}


function handleLocationError(browserHasGeolocation) {
  console.log("Error de localización");
}



function pintarGlobo(latLong, map, info) { // pinta un globo (marker) y centra el mapa, si además trae info, abre un cuadro de info
  var infowindow = new google.maps.InfoWindow;
  var marker = new google.maps.Marker({
    position: latLong,
         map: map
    });
  map.setCenter(latLong);
  infowindow.setContent(info);
  infowindow.open(map, marker);
}


function localizar(map, geocoder){  // Encuentra la situación actual del dispositivo
  var pos = {};
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) { //watchCurrentPosition
      var oldPos = document.getElementById("init_LatLong").innerText;  // debería ser la posición anterior
      var pos = {lat: position.coords.latitude, lng: position.coords.longitude}; // posición dtectada, en coordenadas
      reverseGeocode(geocoder, pos, map); //
      map.setCenter(pos);
//      map.setZoom(12);
//      if (oldPos === pos) {document.getElementById("informaciones").innerText = "Posición repetida";}
      document.getElementById("init_LatLong").innerText = pos.value;  // ¿esto cuando se ve??
      console.log(pos);
      buscarSitios(pos);
    }, function() {handleLocationError(true)});
  } 
  else {  // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}


function reverseGeocode(geocoder, latLong, map) { // esto funciona
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
  //                console.log("j - i: " + j + " , " + i);
  // y salimos del bucle, el resto de address_components ya no interesan POR AHORA
  // como locality está antes que administrative_area_level_2/1, voy a usar este último como criterio break
  // por eso comento el siguiente break, que era la versión antigua
  //            break;
            }
  // también hay que salir del bucle principal
          if (results[j].address_components[i].types[0]==="administrative_area_level_1"){ break;}
            }
          }
  // de todos los valores que pueda haber encontrado, elegimos el primero 
          var link = '<a href=\"https://es.wikipedia.org/wiki/'+arrayLocalidad[0] +"\""+'>'+arrayLocalidad[0]+ '</a>';
          var info = '<div class="municipio">' + arrayLocalidad[0] + '</div> '; //+ '<a href="https://es.wikipedia.org/wiki/"+arrayLocalidad[0]"+'</a>'; 
          var provincia = arrayProvincia[0];
          var comunidad = arrayComunidad[0];
  // para comprobar toooodos los resultados en la consola:
 /*          for (j = 0; j < results.length; j++) {
            console.log("---" + j + "---");
            for(var i in results[j].address_components){
              console.log(results[j].address_components[i]);//.long_name);//.types);
            }
            console.log("---");
          } */
        }
        else { var info ='No results found';}
       }
      else { var info = 'Geocoder failed due to: ' + status;}
  // con el nombre encontrado llamamos a la función para añadirlo al mapa
     pintarGlobo(latLong, map, info);
  // y actualizamos el link en la ventana de información, o no
    var miPueblo = comprobarEnWiki(arrayLocalidad[0].toString(), provincia); // quizás debería ser una función distinta, en una línea de localizar, después de la linea 82 "reverseGeocode(geocoder, pos, map); " el resultado es un número
//    console.log(miPueblo);
    // si encuentra el pueblo en Wikipedia, ofrece un enlace a esa página
    if (miPueblo > 0) { // el link no puede depender de la respuesta, porque si tarda pone undefined y sigue.
      document.getElementById("info_nombre").innerHTML = link + " - " + provincia+ " - " + comunidad;}
    // si no lo encuentra, añade el nombre sin link
    else {
      document.getElementById("info_nombre").innerHTML = arrayLocalidad[0].toString();}
  // ¿eliminar la siguiente línea tras el desarrollo?
  //     document.getElementById('floating-panel').innerHTML = results[0].address_components[2].long_name + " /// " + results[1].address_components[2].long_name;
    buscarFirebase("municipios", arrayLocalidad[0].toString());
  });
}


// Comprobar si existe una página concreta en Wikipedia
function comprobarEnWiki(pueblo, provincia) {
  var numero = 0;
  var xmlhttp = new XMLHttpRequest();
  // cuando obtiene una respuesta ejecuta la function interna
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      var respuesta = JSON.parse(xmlhttp.responseText);
      if (respuesta.error) {
        console.log(respuesta.error);
        document.getElementById("init_LatLong").innerHTML = "-1"; 
        document.getElementById("info_plus").innerHTML = "no encontrado";}
      else {
    //    console.log("respuesta " + respuesta);
      var numero = respuesta.parse.pageid;
      document.getElementById("init_LatLong").innerHTML = numero; //respuesta.parse.pageid;
      var comienzo = respuesta.parse.text["*"].indexOf('<p><b>'); // \n<p><b> es la mejor opción, <b> mejor que <p>, en algunos casos había errores, con esto se localiza dónde comienza el párrafo de presentación
      var terminac_destacado = respuesta.parse.text["*"].indexOf('<h2>') - 1;
      var presentación =respuesta.parse.text["*"].substring(comienzo, terminac_destacado);
      var terminac_normal = presentación.indexOf('</p>') ;// con <h2> , toda la presentación // con indexOf('h2') localiza dónde comienza el apartado "Índice", que comienza con un h2 que debe ser el primero de la página. '-1' para evitar signo '<'.
      var primer_parrafo =presentación.substring(0, terminac_normal);
      
      // el texto de presentación COMPLETO es el contenido entre el primer indexOf y el segundo indexOf; el PRIMER PÁRRAFO es el texto hasta </p>, salvo en artículos destacados, que tienen introducción y lían la cosa. Una solución más general: seleccionar toda la introducción, mediante comienzo-terminac_destacado, que da el mismo resultado en todos los casos (pueblos y destacados); sobre esta selección, hacer una segunda selección buscando </p>, que ahora sí será mayor que comienzo en todos los casos. El primer párrafo será siempre entre comienzo y terminac_normal.  
      document.getElementById("info_plus").innerHTML = primer_parrafo;
          }// antes era aqui
      // secciones y links ////
      var link = 'href=\"https://es.wikipedia.org/wiki/'+pueblo +'#';
      for (x in respuesta.parse.sections){
        var sectionLink = link + respuesta.parse.sections[x].line;
        sectionLink = sectionLink.replace(/\s/g,"_");
        document.getElementById("info_plus").innerHTML += '<a '+ sectionLink +"\"" + ">" + respuesta.parse.sections[x].line + "</a>" + " - "}; //así se crea una lista de secciones con links --- 
     } //y aqui
    }// y aqui
  var consulta = "https://es.wikipedia.org/w/api.php?action=parse&page="+ pueblo +"&format=json&origin=*";
  //los pueblos como Estepa no ofrecen resultados, porque son nombres ambiguos. Habría que usar una consulta como la linea siguiente, pero esa no funciona con los pueblos normales, ya que no redirige a la página correcta (no desde la api, sí desde la web). Una posible vía de solución: si en la respuesta aparece la palabra "desambiguación", aplicar la siguiente consulta (pueblo + _(provincia)).
  //var consulta = "https://es.wikipedia.org/w/api.php?action=parse&page="+ pueblo + "_("+ provincia + ")"+"&format=json&origin=*";
  xmlhttp.open ("GET", consulta, false); // ahora sí funciona con true // originalmente 'true', al ponerlo false SÍ funciona como quiero. Pero me da un mensaje de función deprecated, 
  xmlhttp.send();
  numero = document.getElementById("init_LatLong").innerHTML; // si la consulta es "false" sí muestra el valor correcto, así que lo pongo en false
  console.log("numero:" + numero);
  return numero;
}

  // Encontrar datos del municipio, ¿o PR, o CCAA, en FireBase? ¿una función o dos?
  function buscarFirebase(ambito, pueblo) {
   var ref = databaseService.ref(ambito);
   ref.child(pueblo.toLowerCase()).on("value", function(snapshot){resultado = (snapshot.val() || "(sin datos)");
    document.getElementById("productoTipico").textContent = "Productos típicos: "  + resultado;//+ pueblo + ", " + resultado;
  });
  }

function buscarSitios(position, map) {
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: position,
    radius: 500,
    type: ['point_of_interest']
      }, callback);
}


  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {document.getElementById("init_LatLong").textContent += results[i].types[0] + " - ";}
     }
   }

/*  function createMarker(place, map) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: 'images/ic_local_cafe_black_24px.svg'
    });
*/

   // google.maps.event.addListener(marker, 'click', function() {
   //   infowindow.setContent(place.name);
   //   infowindow.open(map, this);
   // });
  }

//=========================== VERSIÓN ANTIGUA - ANTERIOR QUE FUNCIONABA EN PROTO 2 ====================
/*function comprobarEnWiki(pueblo) {
  //variable que almacenará el resultado
  var resultado = 0;
  //variable que hace la conexión, según el ejemplo de Javascript en https://www.w3schools.com/js/js_ajax_http.asp
  var xmlhttp = new XMLHttpRequest();
  // cuando obtiene una respuesta ejecuta la function interna
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      var respuesta = JSON.parse(xmlhttp.responseText);
      //el valor que nos interesa es el campo clave (clave-valor) de la respuesta, el elemento del JSON 
      // recorremos los elementos de la respuesta para acceder a la clave
      for (numero in respuesta.query.pages) {
      // almacenamos el valor para futuros usos
        document.getElementById("init_LatLong").innerHTML = numero;
        // si identifica el municipio el resultado es un nº > 0, corresponde a la página del municipio en Wikipedia (si no tiene, -1)
       // if (numero > 0) {
         // console.log(numero);
          resultado = numero;
         // console.log("resultado:" + resultado);
         // return numero;} NOOOO: este return no es de la función comprobarEnWiki, sino de la function() interior, así que no podrá retornar nada la función principal. ¿Cómo saltar esto? la var numero solo exite dentro del for; 
        }
    }
   }
  
  
  var consulta = "https://es.wikipedia.org/w/api.php?action=query&titles=" + pueblo + "&prop=revisions&rvprop=content&format=json&origin=*";
  xmlhttp.open ("GET", consulta, false); // originalmente 'true', al ponerlo false SÍ funciona como quiero. Pero me da un mensaje de función deprecated, 
  xmlhttp.send();
  //console.log("ahora res vale: "+ resultado);
  return resultado;
}
//===================================///////////////////////==========================================
*/

// esta función abre un cuadro de Información en unas coordenadas
function mostrarInfo(latLong, map, info) { 
  var coord = latLong;
  var infowindow2 = new google.maps.InfoWindow({ // borrar más tarde
       content: info, //latLong.toString(), 
       position: latLong//coordenadas.latLng
      });
  infowindow2.open(map);
}
/*
          infowindow2.setContent(event.latLng.toString());
          map.setCenter(event.latLng);
          infowindow2.open(map, event.latLng);
*/
// esto es el original del ejemplo
// eliminar tras el desarrollo
/*
function geocodeLatLng(geocoder, map, infowindow) { 
  var input = document.getElementById('latlng').value;
  var latlngStr = input.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
  if (status === 'OK') {
    if (results[0]) {
      var info = results[0].address_components[1].long_name;
       map.setZoom(13);
       pintarGlobo(latlng, map, info);
    }
    else {
      window.alert('No results found');
         }
  }
  else {
    window.alert('Geocoder failed due to: ' + status);
       }
  });
}
*/