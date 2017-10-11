[PMV](#pmv)  
[Bugs pendientes](#bugs_pendientes)  

# Historia
[aquí estará el texto de la historia de esta app]  

Una de las primeras ideas fue la de generar un archivo con una información (básica o no tanto) de cada municipio, que sirviera para buscar información sin internet. Hice pruebas, y un archivo csv con 8000 filas y 2 columnas ocupaba >3MB, lo cual no es viable en una app de smartphone. Desecho la idea, al menos en csv (¿cómo sería en formato js o txt?)  
Más información sobre bases de datos en HTML5: https://rolandocaldas.com/html5/indexeddb-tu-base-de-datos-local-en-html5  



# Referencias
Los códigos usados como base son de las siguientes fuentes:  


**Centrar el mapa**  
`map.setCenter(pos);`  
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
```          for (j = 0; j < results.length; j++) {  
            console.log("---" + j + "---");  
            for(var i in results[j].address_components){  
              console.log(results[j].address_components[i]); or .types); // or long_name or others  
            }  
            console.log("---");  
          }  
```

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

**API de Media Wiki**
Es posible acceder a cualquier contenido mediante la API de MediaWiki. Por ejemplo, `https://es.wikipedia.org/w/api.php?action=query&titles=Wikipedia:Portada&prop=revisions&rvprop=content&format=json` descarga la página principal de Wikipedia en español.  

Para saltar el CORS, hay que saltar la restricción del origen, permitiendo cualquier origen, añadiendo "&origin=*" en la consulta.  
En el ejemplo anterior, https://es.wikipedia.org/w/api.php?action=query&titles=Montehermoso&prop=revisions&rvprop=content&format=json&origin=* sí puede ser cargado en un div a partir de la respuesta a esa consulta.  

Por otra parte, para la respuesta de esa consulta es un JSON (clave-valor) que incluye los datos de la página (valor) en el campo (clave) '201387' (un número), distinto para cada municipio, es decir: el pageid. Pero éste campo clave cambia con cada página de Wikipedia, así que para reutilizar la búsqueda hay que recorrer las claves del Json, recorriendo todas las claves del objeto, con un loop for "*In a for-in loop, use the bracket notation to access the property values:*" https://www.w3schools.com/js/js_json_objects.asp  
`for (numero in respuesta.query.pages) {(···)}`  

Según he leído en (https://stackoverflow.com/questions/26421022/wikimedia-api-extract-json-or-xml-from-revision-wikitext-to-use-in-php) y en (https://www.mediawiki.org/wiki/API:Parsing_wikitext), podemos obtener la información PARSED desde cualquier página de la wikipedia, usando la action adecuada: parse. Así, la consulta a realizar sería:  
https://es.wikipedia.org/w/api.php?action=parse&page=Montehermoso&format=json&origin=* . Además, la llamada sería `xmlhttp.open ("GET", consulta, true);`, y no false como en el tipo query (párrafo anterior). Esto es más adecuado por temas de seguridad, no genera el aviso en la consola.  
De esta forma, el resultado es un json parseado, y con la siguiente estructura de datos:  
	 parse	  
	title	"Montehermoso"  
	pageid	201387  
	revid	101638628  
	text	Object  
	langlinks	[68]  
	categories	[8]  
	links	[889]  
	templates	[74]  
	images	[52]  
	externallinks	[183]  
	sections	[54]  
	parsewarnings	[1]  
	displaytitle	"Montehermoso"  
	iwlinks	[6]  
	properties	[2]  
El grupo sections incluye las secciones, con la siguiente estructura:  
	sections	  
	0	  
	toclevel	1  
	level	"2"  
	line	"Elementos identitarios"  
	number	"1"  
	index	"1"  
	fromtitle	"Montehermoso"  
	byteoffset	5660  
	anchor	"Elementos_identitarios"  
Por tanto, mediante esta respuesta tenemos disponible toda la información de las secciones sin tener que tratar el texto, accedediendo a todos los elementos parse.sections.[0].line  

Mediante `respuesta.parse.pageid` tenemos el valor del código numérico del municipio.  

Mediante el siguiente código obtenemos la presentación del municipio en casi todos los casos, ya sea completa, ya sea el primer párrafo.  
```javascript
var comienzo = respuesta.parse.text["*"].indexOf('<p><b>'); 
var terminac = respuesta.parse.text["*"].indexOf('<h2>') - 1;// con <h2> , toda la presentación // con indexOf('h2') localiza dónde comienza el apartado "Índice", que comienza con un h2 que debe ser el primero de la página. '-1' para evitar signo '<'.  
var presentación =respuesta.parse.text["*"].substring(comienzo, terminac); // el texto de presentación es el contenido entre el primer indexOf y el segundo indexOf  
document.getElementById("otra").innerHTML = presentación;  
```
En ocasiones, como en Sevilla, Málaga o Huelva, la respuesta no es suficientemente concreta.  
INVESTIGAR si tiene relación con la etiqueta {{artículo destacado}} que aparece en Sevilla, y no en pueblos normales (ver prueba-borrar.html).  
Elimino la incidencia variando el texto a buscar, pasando de `<b>` a `<p><b>`.  

**Manejo de XML desde JavaScript**
[pendiente de buscar y probar]  
Desde el momento en que es posible obtener datos de Wikipedia en XML, resulta interesante explorar el tratamiento de los datos obtenidos desde JS, para lo que es imprescindible conocer cómo intereactúan JS y XML.  
(Json usa el método  XMLHttpRequest para obtener y procesar los datos, así que supongo que también se aplicará aquí)  


**Conversión de datos en JSON**
En la web "Mr Data Converter", https://shancarter.github.io/mr-data-converter/ , se puede acceder a un conversor online de datos CSV --> JSON. Muy útil para convertir una tabla de datos excel en json, lo que puede servir para recopilar información de municipios.  
En la web http://jsoneditoronline.org/ se puede visualizar fácilmente el contenido de un copy-paste en formato JSON, como por ejemplo las respuestas de Wikipedia.  


**Fuentes de información para productos típicos**
Gastronomía de Andalucía - Wikipedia, la enciclopedia libre,  
Dulces y postres de Andalucía, por municipios: https://www.andalucia.org/es/recetas/tipos/recetas/dulces-y-postres  
Rutas y platos típicos por provincias de Andalucia: https://haycosasmuynuestras.com/ruta-gastronomica-andalucia/  

**Firebase**  
Firebase es muchas cosas, pero yo me quedo con "una base de datos online".  
Planteo almacenar en Firebase datos típicos de cada municipio, que pueda consultar cuando la app esté en ese municipio.  
La fuente de información más práctica que he encontrado: https://desarrolloweb.com/articulos/introduccion-firebase-backend-nube.html  
Hay mucha información y ejemplos acerca de cómo grabar datos, y poco sobre cómo leerlos (en mi ignorancia).  
Por lo que he entendido: no hay que leer, sino suscribirse a los cambios del valor. Es decir, podemos tener actualizados los datos mediante la conexión que hace (y mantiene) Firebase. Así que para leer, con el valor inicial es suficiente.  
El código en el html: `<script src="https://www.gstatic.com/firebasejs/4.5.0/firebase.js"></script>`
Y el script, algo así:
```javascript
<script>
  // Initialize Firebase
  var config = {
    apiKey: "**************",
    authDomain: "*******.firebaseapp.com",
    databaseURL: "https://*******.firebaseio.com",
    projectId: "infotown-****",
    storageBucket: "infotown-****.appspot.com",
    messagingSenderId: "*********"
  };
  firebase.initializeApp(config);

    var databaseService = firebase.database();

    function buscarFirebase(pueblo) {
            var ref = databaseService.ref('municipios');
            ref.child(pueblo.toLowerCase()).on("value", function(snapshot){
              resultado = (snapshot.val() || "");
      document.getElementById("titular").textContent = resultado;
        });
    }
  </script>
```
La idea es: crear un ref de municipios, y si la respuesta es vacía (o null), buscar en un ref de provincias, y si la respuesta es null, en un ref de comunidades autónomas.  
Al localizar el pueblo, no sólo hay que recuperar el municipio, también necesitaremos recuperar la provincia y la comunidad.  
Teniendo ya los datos por REVERSEGEOCODER, creo que es mejor aprovecharlos.  


# Fases de ejecución  
## Prototipos  
Primer Prototipo: una app que, al abrir, localiza la ubicación del usuario y centra el mapa, y abre un marcador con el nombre del municipio en el que está situado. Además, al hacer click en un punto del mapa, sitúa un marcador en ese punto, centra el mapa en ese marcador, abre una ventana de información que contenga el Municipio del punto donde se hizo click, y en la ventana de información añade un enlace con la página de Wikipedia de ese municipio (sólo enlace).  

Segundo Prototipo: además, busca el municipio en Wikipedia, e informa si existe la web o no en la ventana de información.  

Tercer Prototipo: además, extrae el primer párrafo de la presentación en Wikipedia, y dispone de una función que averigua las secciones que tiene la Wikipedia para ese municipio, y las muestra en la ventana de información.  

Cuarto Prototipo: incorpora una función que añade información sobre algún producto típico del municipio a partir de una Base de Datos {(desechado: '*~~si no, típico de la provincia, o de la CCAA.~~*'}  

**Quinto Prototipo**: además, muestra una serie de establecimientos cercanos a la ubicación actual, relacionados con algún producto típico del municipio {desechado *~~, o de la provincia, o de la región~~*}. {o **pasteles**, mientras no tengamos una lista más completa}.  

## PMV  
El **PMV** dispone de una ventana que muestra el mapa, y una ventana que muestra información; cuando se inicia, la app averigua la ubicación del usuario, centra el mapa en ese punto, averigua el municipio y lo muestra en una ventana, busca información sobre el municipio en Internet, incluyendo algún producto típico, y presenta la lista de secciones de la Wikipedia en la ventana de información. Además, muestra una serie de establecimientos cercanos a la ubicación actual, relacionados con algún producto típico del municipio, o de la provincia, o de la región. 
El PMV funciona en escritorio *y en Android*.  

[Posible derivación: ofrece información de una BD, incluyendo producto típico del pueblo, y busca tiendas que lo vendan en los alrededores de la ubicación actual.]  

	30/08/2017  
	Fases de trabajo  						versión		terminado  
	------------------------------------------------------------------------------------------  
	-Elegir base de código 						0.0 		 ok 31/08  
	-Separar html, css, js 						0.1 		 ok 31/08  
	-Definir funciones necesarias:  
		-Inicial, geolocalizar posición				0.1 		 ok 07/09  
		-Centrar mapa  						0.2 		 ok 31/08  
		-Pintar marcador 					0.2 		 ok 04/09  
		-Abrir InfoWindow 					0.2 		 ok 01/09  
		-Detección de click en el mapa 				0.2 		 ok 31/08  
		-Geolocalización inversa 				0.3 		 ok 05/09  
		-Completar InfoWindow con Municipio 			0.3 		 ok 07/09  
		-Generar función enlace a Wikipedia 			0.5 		 ok 08/09  
		-Diseñar el PMV: elementos html y css			0.6 		 ok 12/09  
		-Probar en android vía PhoneGap  			0.7 		 ok 11/09  
		-Generar función actualización 60 segundos		0.8 		 ok 12/09  
		-Añadir plugins Cordova, etc.				0.9 		 ok 13/09  
		-Empaquetar Prototipo 1 				1.0 		 ok 18/09  

		-Func. comprobar si existe pueblo en Wikip.		1.1 		 ok 25/09  
		-Actualizar info enlace en pantalla:			1.2 		 ok 26/09  
			limpiar, documentar, redacción final		1.3 		 ok 27/09  
		-Empaquetar Prototipo 2 				2.0 		 ok 27/09  

		-Generar función Wikipedia  				2.1  -->  	--> ver abajo  
				-descargar texto					 ok 08/09  
				-averigua secciones wikipedia 				 ok 28/09  
				-averiguar código nº			2.2 		 ok 29/09  
				-extraer primer párrafo			2.3 		 ok 02/10  
				-presenta 1º párrafo y secciones 	2.4 		 ok 03/10  
					bug: links con espacios		2.4.1  		 ok 03/10  
					bug: link a wiki de pueblos que	  
					no tienen wiki (Torrepalma)	2.4.2 		 ok 04/10  
		Empaquetar prototipo 3 					3.0 		 ok 04/10  
		
		-FireBase con datos de municipios			3.1 		 ok 05/10  
		-Función para conectar con FireBase 			3.1 		 ok 06/10  
		-Modificar maps.js para obtener prov y CCAA 		3.1 		 ok 06/10  
		-Función para recuperar respuestas 			3.2		 ok 10/10  
			- para municipios  				3.2 		 ok 09/10  
			- para provincias				3.2 		 desechado  
			- para CCAA 					3.2 		 desechado  
		Empaquetar prototipo 4 					4.0 		 ok 10/10    



Veo dos opciones para descargar información de Wikipedia:
	-realizar las consultas directamente a Wikipedia,  
	-realizar la consulta a una BD Firebase que contenga la información previamente preparada,  

Ventajas				 1ª opción: directamente 								2ª opción: Firebase			  
						-casi tengo el código  									-info siempre correcta  
  						-														-puede comenzar con info genérica  
  																				-usa menos datos desde la app  

Desventajas 			1ª opción: 											2ª opción:				  
						-hay que desarrollar una función que extraiga 			-hay que generar la información antes de usar la app  
						información útil de cualquier página de wikipedia, 		
						desde la app,  
						-usará muchos, muchos datos desde la app				-hay que desarrollar otra app, para extraer info de Wikipedia  

El planteamiento anterior es antiguo, de principios de septiembre, cuando aún no sabía manejar la respuesta de Wikipedia en formato JSON.  
Ahora parece más lógico produndizar en el tratamiento del json, 

# Bugs pendientes
## Bug 3: pueblos como Zalamea la Real  
El caso de pueblos que, como resultado de la consulta, ofrece información de la complementaria (lateral), no de la página principal.  
## Bug 2: pueblos con wiki ambigua
Los municipios como: Estepa, y otros, tienen un nombre ambiguo, por lo que la información que descarga es la de la página de desambiguación, no la del pueblo.
## bug 1: pueblos sin Wiki
link a wiki de pueblos que no tienen wiki (Torrepalma)	2.4.2
documentando la resolución  
el valor de miPueblo es undefined cuando se actualiza por tiempo, y por eso no añade el link.  
¿qué debería valer?  
en cambio, al pinchar en un punto del mapa, el valor es numérico, y por eso añade el link en Torrepalma.  
debe ser un problema de arrastrar un valor anterior, cuando se pincha varias veces sí es undefined, o missing title, y no añade el link.  
el problema está en la función actualizar, creo, porque el valor en la consola es undefined, después de actualizar.  
Paso. Añado siempre el link, funcione o no (estos serán muy muy pocos casos).   

