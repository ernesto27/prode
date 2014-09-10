var express   = require('express');
var path      = require("path");
var Sequelize = require("sequelize");
var db 		  = require("./db");
var Q 		  = require("q");
var flash 	  = require('connect-flash');
var User      = require("./models/user.js");

var user = new User();
var app      = express();


app.configure(function () {
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('webprode'));
  	app.use(express.session({secret: 'webprode'}));
  	app.use(flash());
});


function Aunthenticate(req, res, next){
	if(req.session.userid){
		next();
	}else{
		res.redirect("/users/login");
	}

}


app.get("/", function(req, res){
	// GET TEAMS
	db.Team.findAll({ order: 'points desc'}).success(function(teams){
		// GET RANKING USUARIOS
		db.User.findAll({ order: 'points desc'}).success(function(users){
			//res.json(users); return;
			res.render("index.ejs", { 
				teams: teams, 
				users: users, 
				activeHome: true,
				username: req.session.username
			});
		}).error(function(err){
			res.json(err);
		});
		
	}).error(function(err){
		res.json(err);
	});
	
});

var userId = 2;

app.get("/fecha/:id", function(req, res){
	var fechaNumero = req.params.id;
	db.Match.findAll({ where: { fecha_id: fechaNumero } })
		.success(function(matches){
			// GET FECHAS
			getFechas(req, res, function(fechas){
				res.render("pronosticos.ejs", {
					matches: matches, 
					fechas: fechas, 
					fechaNumero: fechaNumero, 
					username: req.session.username
				});
			});
		}).error(function(err){
			res.json(err);
		});
});


function getFechas(req, res, callback){
	db.Fecha.findAll({ where:{ active: "S"} })
		.success(function(fechas){
			 callback(fechas);
		}).error(function(err){
			res.json(err);
		});
}

// FORECAST ROUTERS
/*
 * method: post
 * description: Save a new user forecast for a specific match
*/


app.post("/forecast/save", function(req, res){
	var userId = req.session.user.id;
	var matchID = req.body.idMatch;
	var result  = req.body.result;

	db.Forecast.find({
		where:{
			match_id: matchID,
			user_id: userId
		}
		}).success(function(forecast){
			if(forecast){
				forecast.updateAttributes({
					result: result
				}).success(function(result){
					res.json(result);
				});
			}else{
				db.Forecast.create({
					match_id: matchID,
					result: result,
					user_id: userId,
					fecha_id: 7
				}).success(function(result){
					res.json(result);
				}).error(function(err){
					res.json(err);
				});
			}
			
		}).error(function(err){
			res.json(err);
		});


});

/*
app.post("/forecast/save", Aunthenticate, function(req, res){
	var lenBody = Object.keys(req.body).length - 1;

	var count = 1;
	for( var current in req.body){
		var matchID = current.split("-")[1];
		console.log(matchID);
		//console.log(req.body[current]);
		if(matchID){
			if(count == lenBody) res.json({ status: "ok"});	

			
				
			db.Forecast.find({
				where:{
					match_id: matchID,
					user_id: req.session.user.id
				}
			}).success(function(forecast){
				
				db.Forecast.create({
					match_id: matchID,
					result: req.body[current],
					user_id: req.session.userid,
					fecha_id: req.body.fechaNumero
				}).success(function(result){
					//res.json(result);
					count++;
				}).error(function(err){
					//res.json(err);
				});
			}).error(function(err){
				res.json(err);
			});
	


			/*
			db.Forecast.create({
				match_id: matchID,
				result: req.body[current],
				user_id: req.session.userid,
				fecha_id: req.body.fechaNumero
			}).success(function(result){
				//res.json(result);
			}).error(function(err){
				//res.json(err);
			});
			
			count++;
		}
	}
});
*/

app.get("/forecast", function(req, res){
	db.Forecast.find({
		where:{
			match_id: 78,
			user_id: 7
		}
	}).success(function(forecast){
		if(forecast){
			res.json("update ");
		}else{
			// creata a new one
		}
	}).error(function(err){
		res.json(err);
	});

});


/*
 * user routes
 *
*/

app.get("/users/register", function(req, res){
	res.render("users/register.ejs", { 
		messageusername: req.flash("messageusername"), 
		messagemail: 	 req.flash("messageemail"), 
		messagepass: 	 req.flash("messagepass"),
		messageregister: req.flash("messageregister"),
		activeRegister: true
	});
});
app.post("/users/register", user.register);

app.get("/users/login", function(req, res){
	res.render("users/login.ejs",{
		messagelogin: req.flash("messagelogin"),
		loginfalse: req.flash("loginfalse"),
		activeLogin: true
	});
});
app.post("/users/login", user.login);

app.get("/users/logout", function(req, res){
	req.session = null;
	res.json(req.session); return;
	res.redirect("/");
});	


// sessions test
app.get("/session", function(req, res){
	res.json(req.session);
});

app.get("/users/forecast/:fechaNum", function(req, res){
	//res.json(req.params.fechaNum); return;
	var userID = req.session.user.id;
	db.Forecast.findAll({
		where: { 
			user_id: userID,
			fecha_id: req.params.fechaNum
		}
	}).success(function(data){
		res.json(data);
	}).error(function(err){
		res.json(err);
	});

});




app.listen(3000);