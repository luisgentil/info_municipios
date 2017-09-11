
var initLatLong = {lat: 37.893949, lng: -6.749115};  // coordenadas de inicio ;)37.893949, -6.749115
var initZoom = 8;                                        //37.419193,-5.991978 estas son las coordenadas de sevilla 

// el mapa se inicia
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
  zoom: initZoom,
  center: initLatLong       //{lat: 40.731, lng: -73.997}
  });
  
  // Encuentra la situación actual del dispositivo
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
  
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;
  
  // con este eventListener accedemos a las coordenadas del click
  map.addListener('click', function(e) {
    reverseGeocode(geocoder, e.latLng, map)}); //  mostrarInfo(e.latLng, map, "foo")});
  
//  document.getElementById('submit').addEventListener('click', function() {
//  geocodeLatLng(geocoder, map, infowindow);
//  });
}

// Otras funciones para al App, algunas sirven y otras no XD
function handleLocationError(browserHasGeolocation) {
  console.log("Error de localización");
}



function pintarGlobo(latLong, map, info) { // pinta un globo y centra el mapa, si además trae info, abre un cuadro de info
      var infowindow = new google.maps.InfoWindow;
      var marker = new google.maps.Marker({
        position: latLong,
             map: map
        });
      map.setCenter(latLong);
      infowindow.setContent(info);
      infowindow.open(map, marker);
}


function reverseGeocode(geocoder, latLong, map) { // esto funciona
  geocoder.geocode({'location': latLong, 'language':'es'}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
// con este código, asigna el valor correspondiente al primer campo 'locality' de entre los que encuentre (suele haber varios)
          var arrayLocalidad = []; // new Array;
// recorremos todos los resultados obtenidos, normalmente 1 en results[0]
          for (j = 0; j < results.length; j++) {
// recorremos todos los objetos de address_components, normalmente trae varios
            for(var i in results[j].address_components){
// cuando encuentra un resultado de tipo locality añadimos el long_name al nuevo array
              if (results[j].address_components[i].types[0]==="locality"){
                arrayLocalidad.push(results[j].address_components[i].long_name); 
//                console.log("j - i: " + j + " , " + i);
// y salimos del bucle, el resto de address_components ya no interesan
              break;
            }
// también hay que salir del bucle principal
          if (results[j].address_components[i].types[0]==="locality"){ break;}
            }
          }
// de todos los valores que pueda haber encontrado, elejimos el primero 
          var link = '<a href=\"https://es.wikipedia.org/wiki/'+arrayLocalidad[0] +"\""+'>'+arrayLocalidad[0]+ '</a>';
          var info = '<div class="municipio">' + arrayLocalidad[0] + '</div> ' + link; //+ '<a href="https://es.wikipedia.org/wiki/"+arrayLocalidad[0]"+'</a>'; 
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
// ¿eliminar la siguiente línea tras el desarrollo?
//     document.getElementById('floating-panel').innerHTML = results[0].address_components[2].long_name + " /// " + results[1].address_components[2].long_name;
  });
}


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
