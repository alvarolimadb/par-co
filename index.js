var express = require('express');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");
var serviceAccount = require("./PAR-CO-38edc776467a.json");
var app = express();
var defaultApp = admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://par-co.firebaseio.com"
	});
app.use(bodyParser.json());
app.post('/', function(req, res){
  	
	
	var id = req.body['busqueda']['id_usuario']; //"2HF4eZWPFhSA2rvRzPbaVy2L2eg2"
	var parametro = req.body['busqueda']['parametro']; // "Jorge González"
	parametro = parametro.toLowerCase();
	parametro = parametro.replace(/á/gi,"a");
	parametro = parametro.replace(/é/gi,"e");
	parametro = parametro.replace(/í/gi,"i");
	parametro = parametro.replace(/ó/gi,"o");
	parametro = parametro.replace(/ú/gi,"u");
	var defaultAuth = defaultApp.auth();
	var db = defaultApp.database();
	var ref = db.ref("Users");
	//var ref_id = db.ref('Users/'+ id);
	var count = -1;
	var count_users = -1;
	var count_total = -1;
	var resp = new Array(0);
	var users_blocks = new Array(0);
	var ids_users_r = new Array(0);
	var resp_total = new Array(0);
	var ban = 0;
	var count_resp = -1;
	var validar = 0;
	ref.once('value', function(snapshot) { //AL: Usuario buscador
		var usuario_buscador = snapshot.val(); //AL: array de atributos
		var list_user_blocked = usuario_buscador.blocked //AL: Usuarios bloqueados
		snapshot.forEach(function (datos) {
			//console.log('usuario no bloquedo'+datos.key);
			if (datos.key == id) {
				validar = 1;
			}
			//console.log(datos.key);
		});
		if (validar == 1) {
			snapshot.forEach(function (datos) {
			var ids_users = datos.key;
			if (ids_users == id) {
				datos.forEach(function (per) {
					if (per.key == 'blocked') {
						var lis_block = per.val();
						per.forEach(function (keys){
							count++;
							users_blocks[count] = keys.val();
							//console.log(keys.val());
							ban=1;
							//console.log(ban);
						});
					}
				});
			}
			datos.forEach(function (per) {
				if (per.key == 'blocked') {

					var lis_block = per.val();
					per.forEach(function (keys){
						idb = keys.val();
						if (idb == id) {
							count++;
							users_blocks[count] = ids_users;
							//console.log(' ids =' + ids_users);
							ban=1;
							//console.log(ban);
						}
						
					});
				}
			});
			});
			//ban = 0; //AL:  0 = desactivar bloqueos 1 = para activar bloqueos
			//console.log('---------------------')
			if (ban == 1) {
				snapshot.forEach(function (datos) {
						//count_users++;
						//ids_users_r[count_users]  = datos.key;
					var control=0;
					for (var i = 0; i < users_blocks.length; i++) {	
						if (users_blocks[i] == datos.key) {	
					        //console.log('usuario bloquedo '+datos.key);
					        control = 1;
						}
					}
					//console.log(control);	
					if (control != 1) {
						//console.log('usuario no bloquedo'+datos.key);
						count_resp++;
						resp[count_resp] = datos.key;
					}
				});
			} else {
			snapshot.forEach(function (datos) {
				//console.log('usuario no bloquedo'+datos.key);
				count_resp++;
				resp[count_resp] = datos.key;
				//console.log(datos.key);
			});
			}

			snapshot.forEach(function (childSnapshot) {
				var ids = childSnapshot.key;
				for (var i = 0; i < resp.length; i++) {
					if (ids == resp[i]) {
						childSnapshot.forEach(function (datosperfil) {
							datosperfil.forEach(function (datoscontenido) {
								if (datoscontenido.key == "nombre_perfil" || datoscontenido.key == "apellido_perfil") {
									nombre = datoscontenido.val();
									nombres = nombre.toLowerCase();
									nombres = nombres.replace(/á/gi,"a");
									nombres = nombres.replace(/é/gi,"e");
								   	nombres = nombres.replace(/í/gi,"i");
								   	nombres = nombres.replace(/ó/gi,"o");
								   	nombres = nombres.replace(/ú/gi,"u");
									if (nombres.search(parametro)!=-1){
									count_total++;
									resp_total[count_total] = ids; //AL: Los datos de id.users  se guardan en un array
									console.log(nombres + ' ' + ids);
									}
								}
							});
							
						});
					}
				}
			});
		/*console.log(count);
		console.log(users_blocks.toString());*/
		/* ***** RESULTADOS ****** */
		var total = {
			    resultado: []
			};

			for(var i in resp_total) {    

			    var item = resp_total[i];   

			    total.resultado.push({ 
			        "id_usuario" : item,
			    });
			}

			//var json= JSON.stringify(total);
	  		//res.send(json);    // echo the result back
	  		var validar = 0;
	  		return res.json(total);
		} else {
			res.json('Usuario no valido');
			return console.log('Usuario no valido');
		}
	}, function (errorObject) {
		console.log('The read failed: ' + errorObject.code);
	});
				
					

});

app.listen(3000);