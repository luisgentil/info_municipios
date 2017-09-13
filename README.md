# Historia
[aquí estará el texto de la historia de esta app]  

Una de las primeras ideas fue la de generar un archivo con una información (básica o no tanto) de cada municipio, que sirviera para buscar información sin internet. Hice pruebas, y un archivo csv con 8000 filas y 2 columnas ocupaba >3MB, lo cual no es viable en una app de smartphone. Desecho la idea, al menos en csv (¿cómo sería en formato js o txt?)  
Más información sobre bases de datos en HTML5: https://rolandocaldas.com/html5/indexeddb-tu-base-de-datos-local-en-html5  



# Referencias
Los códigos usados como base son de las siguientes fuentes:  


**Centrar el mapa**
map.setCenter(pos);  
(encontrado en el ejemplo 'Geolocation' de la api de Google Maps)  


**Geocoding inverso**  
(Esta información corresponde a: nociones generales, y la geocodificación de direcciones estáticas conocidas, a través del servicio web de geocodificación).  
La geocodificación inversa consiste en obtener información comprensible a partir de latitud + longitud. Hay que tener en cuenta que "el geocodificador inverso a menudo devuelve más de un resultado. Las “direcciones” no representan solo direcciones postales, sino cualquier forma de asignar nombres geográficos a una ubicación. Por ejemplo, al aplicarse geocodificación a un punto en la ciudad de Chicago, dicho punto puede etiquetarse como una dirección, como la ciudad (Chicago), como el estado (Illinois) o como un país (Estados Unidos). Todas las direcciones corresponden al geocodificador. El geocodificador inverso devuelve todos estos resultados.  (...) Las direcciones se devuelven en el orden de mayor a menor coincidencia." 
Más info: https://developers.google.com/maps/documentation/javascript/geocoding?hl=es-419#ReverseGeocoding  

Una consulta como: http://maps.googleapis.com/maps/api/geocode/json?&latlng=37.419193,-5.991978 ofrece una lista de resultados en formato JSON. Por tanto, accesible vía consultas web, como:  https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY , o **por ejemplo**:  
https://maps.googleapis.com/maps/api/geocode/json?latlng=37.516311,-5.970018&language=es&result_type=political&key=AIzaSyAr6WjP2-THB-i9F3DaaBkmmB0cUmHb3i0  
que muestra los resultados en idioma español, y los limita al tipo "political", lo cual simplifica los resultados.  
(Geocodificación inversa para una latitud/longitud, en: https://developers.google.com/maps/documentation/geocoding/intro?hl=es#ReverseGeocoding)  
Los resultados son de tipo JSON, que no entiendo muy bien aún, pero que tienen que ser recorridos, ya que se pueden acceder mediante la notación punto ".": results[0].formatted_address.long_name, y cosas así. También a la hora de realizar la consulta, pero eso no lo tengo tan claro.  
Si limitamos las consultas a "locality" deberíamos obtener el nombre del municipio, pero no siempre la API registra el municipio como localidad; es mejor usar "administrative_area_level_4".  
No obstante, aún no sé cómo usar esto desde javascript, porque la función usada en los ejemplos es 'geocoder.geocoder, no https://... ¿cómo convertir uno en otro? seguiré buscando.  

*Nota: Este servicio generalmente está diseñado para geocodificar direcciones estáticas (ya conocidas) para la disposición de contenido de la aplicación en un mapa. No se concibió para responder en tiempo real a las entradas del usuario. Para la geocodificación dinámica (por ejemplo, dentro de un elemento de la interfaz de usuario), consulta la documentación para el geocodificador de cliente de la Google Maps JavaScript API o las API de ubicación de Google Play Services.*.  


**Geocodificador de cliente de la Google Maps JavaScript API**  
Reverse Geocoding example from Google Maps API, https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse .
(En la práctica, no encontré diferencias respecto a la información ya recogida en el apartado anterior, pero amplía con lo que añado ahora).  
Filtrado de componentes: "Un filtro consta de uno o más de los siguientes tipos: route, locality, administrativeArea, postalCode y country. Solo se devolverán resultados que coincidan con los filtros."  


**Geocoding Service**  
Aquí se explica cómo usar el servicio de información a partir de LatLng, ofrece la información de un punto del mapa.  
En  https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding
se encuentra cómo extraer partes de la información que se facilita en el servicio, correspondiente a localizar información a partir de lat+lang.  

**Respuestas de geocodificación**  
A ver si lo entendí bien, aquí resumo lo que he ido probando a partir de la información de https://developers.google.com/maps/documentation/geocoding/intro?hl=es-419#Results .  
Puede responder en JSON o XML, según se indique en la petición. La respuesta de geocoder service es en json.  
Es decir: la respuesta es un objeto JSON, por lo que aplica lo que escribí en https://github.com/luisgentil/apuntes/blob/master/README.md .  
Una respuesta JSON contiene dos elementos principales:  
	* "status" contiene metadatos sobre la solicitud. Propiedad-par. 
	* "results" contiene una matriz (es decir, un array de objetos) de información sobre direcciones geocodificadas e información sobre geometría. Generalmente solo se devuelve una entrada en la matriz "results". Generalmente.  
Un resultado típico 'results[0]'' será un array de objetos json compuesto por:  
	* 'address_components', un array [] de objetos, con diversas propiedades-pares.  
	* 'fomatted_address', una propiedad-par.  
	* 'geometry', objetos con propiedades-pares, incluyendo: 'location', 'location_type', 'viewport'.  
	* 'place_id', propiedad-par.  
	* 'types', un par valor-array.  
Con el siguiente código se puede revisar el contenido de todas las respuestas recibidas:  
          for (j = 0; j < results.length; j++) {  
            console.log("---" + j + "---");  
            for(var i in results[j].address_components){  
              console.log(results[j].address_components[i]); or .types); // or long_name or others  
            }  
            console.log("---");  
          }  
 

**Situar la posición del usuario**  
Ubicación geográfica: Mostrar la posición de un usuario o dispositivo en Maps,  
https://developers.google.com/maps/documentation/javascript/geolocation?hl=es-419  

**Marcadores**  
Información sobre cómo generar, mostrar, cerrar, eliminar...:  
https://developers.google.com/maps/documentation/javascript/markers?hl=es-419  
En **mapas.js** tengo una función de pintar globo, reutilizable. También puede pintar un cuadro de información, en esa misma función u otra adicional.  


**Localización del usuario usando C3W**  
Fácil a partir del ejemplo en API: https://developers.google.com/maps/documentation/javascript/geolocation.

El archivo C:\Users\luis.gentil.ext\Desktop\my_apps\google-maps-api\ejemplo-borrar-2.html contiene un ejemplo de localización del usuario al clickar un botón, centrando el mapa en la ubicación obtenida.  
En la misma carpeta, el ejemplo borrar.html contiene un código para obtener la ubicación en texto.  
Otras Fuentes:  
	https://jafrancov.com/2010/08/bases-gmaps-api-v3/  
	https://norfipc.com/codigos/como-detectar-mostrar-localizacion-geografica-paginas-web.php  
	https://norfipc.com/internet/saber-mi-localizacion-ubicacion-geografica.php  
	http://www.esedeerre.com/ejemplos/javascript/geolocalizacion-por-javascript-sobre-google-maps/  con mucho código, clarito   

Las llamadas a la API de Geolocalización permiten obtener toda la información en formato texto, tanto xml como Json. Lo encontré en  
https://www.viavansi.com/blog-xnoccio/es/geolocalizacion-con-coordenadas-en-excel-i/  
Un ejemplo es:  
http://maps.googleapis.com/maps/api/geocode/json?address=Glorieta%20Fernando%20Qui%C3%B1ones&sensor=false  


**Acceder al contenido de otra página**
http://www.forosdelweb.com/f13/getelementbyid-otra-pagina-817584/  

Muy interesante esta fuente: http://www.tufuncion.com/descarga-wikipedia,  
En ella explica cómo acceder a cualquier artículo de Wikipedia en XML: http://es.wikipedia.org/wiki/Special:Export/Titulo_del_articulo  
No obstante, no supera la "Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource"  
A través de MediaWiki encuentro esta referencia: **Become a MediaWiki hacker Learn to use our APIs ** en: https://www.mediawiki.org/wiki/API:Web_APIs_hub  
[LEER]
'API:Cross-site requests' en : https://www.mediawiki.org/wiki/API:Cross-site_requests ,  vía: API:Main page en: https://www.mediawiki.org/wiki/API:Main_page  

Según lo leído en https://www.w3schools.com/js/js_json_jsonp.asp, con JSONP se puede superar el problema de los orígenes cruzados ('distintos directorios'), hay que ampliarlo.
(*'JSONP is a method for sending JSON data without worrying about cross-domain issues. JSONP does not use the XMLHttpRequest object. JSONP uses the "script" tag instead.')

**API de Media Wiki **
Es posible acceder a cualquier contenido mediante la API de MediaWiki. Por ejemplo, `https://es.wikipedia.org/w/api.php?action=query&titles=Wikipedia:Portada&prop=revisions&rvprop=content&format=json` descarga la página principal de Wikipedia en español.  

Para saltar el CORS, hay que saltar la restricción del origen, permitiendo cualquier origen, añadiendo "&origin=*" en la consulta.  
En el ejemplo anterior, https://es.wikipedia.org/w/api.php?action=query&titles=Montehermoso&prop=revisions&rvprop=content&format=json&origin=* sí puede ser cargado en un div a partir de la respuesta a esa consulta.  




**Manejo de XML desde JavaScript**
[pendiente de buscar y probar]  
Desde el momento en que es posible obtener datos de Wikipedia en XML, resulta interesante explorar el tratamiento de los datos obtenidos desde JS, para lo que es imprescindible conocer cómo intereactúan JS y XML.  
(Json usa el método  XMLHttpRequest para obtener y procesar los datos, así que supongo que también se aplicará aquí)  



# Fases de ejecución
##Prototipos  
Primer Prototipo:  una app que, al hace click, centra el mapa en ese marcador, sitúa un marcador en el mapa, abre una ventana de información que contenga el Municipio del punto donde se hizo click, y un enlace a la página de Wikipedia de ese municipio (sólo enlace).

Segundo Prototipo:  además, busca el municipio en Wikipedia, e informa si existe la web o no.

Tercer Prototipo:  además, dispone de una función que averigua las secciones que tiene la Wikipedia para ese municipio.

##PMV  
El **PMV** dispone de una ventana que muestra el mapa, una ventana que muestra información; cuando se pincha un botón, la app averigua la ubicación del usuario, centra el mapa en ese punto, averigua el municipio, busca información sobre el municipio en Internet, y presenta la lista de secciones de la wikipedia en la ventana de información.  El PMV funciona en escritorio *y en Android*.

	-30/08/2017  
	Fases de trabajo  							versión		terminado  
	----------------------------------------------------------------------  
	-Elegir base de código 							0.0 		 ok 31/08  
	-Separar html, css, js 							0.1 		 ok 31/08  
	-Definir funciones necesarias:  
	-Inicial, geolocalizar posición				0.1 		 ok 07/09  
	-Centrar mapa  								0.2 		 ok 31/08  
	-Pintar marcador 							0.2 		 ok 04/09  
	-Abrir InfoWindow 							0.2 		 ok 01/09  
	-Detección de click en el mapa 				0.2 		 ok 31/08  
	-Geolocalización inversa 					0.3 		 ok 05/09  
	-Completar InfoWindow con Municipio 		0.3 		 ok 07/09  
	-Generar función enlace a Wikipedia 		0.5 		 ok 08/09  
	-Diseñar el PMV: elementos html y css		0.6 		 ok 12/09  
	-Probar en android vía PhoneGap  			0.7 		 ok 11/09  
	-Generar función actualización 60 segundos	0.8.2  
	-Añadir plugins Cordova, etc.				0.9  
	-Empaquetar Prototipo 1 					1.0  

	-Generar función Wikipedia  				1.2  -->  			--> ver abajo
			-descargar texto								 ok 08/09  
			-interpretar formato correcto  
			-extraer (desde triples comillas """)  
			-extraer (hasta "==")  


Veo dos opciones para descargar información de Wikipedia:
	-realizar las consultas directamente a Wikipedia, 
	-realizar la consulta a una BD Firebase que contenga la información previamente preparada,

Ventajas				 1ª opción: directamente 								2ª opción: Firebase			  
						-casi tengo el código  									-info siempre correcta  
  						-														-puede comenzar con info genérica  
  																				-usa menos datos desde la app  

Desventajas 			1ª opción:  											2ª opción:				  
						-hay que desarrollar una función que extraiga 			-hay que generar la información antes de usar la app  
						información útil de cualquier página de wikipedia, 		
						desde la app,  
						-usará muchos, muchos datos desde la app				-hay que desarrollar otra app, para extraer info de Wikipedia  


