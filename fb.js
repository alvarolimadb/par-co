var admin = require("firebase-admin");
var serviceAccount = require("./PAR-CO-38edc776467a.json");
var defaultApp = admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://par-co.firebaseio.com"
	});
module.exports.defaultApp = defaultApp.database(); //this doesnt have to be database only