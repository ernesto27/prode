var Sequelize = require("sequelize");
var sequelize;

if (process.env.HEROKU_POSTGRESQL_IVORY_URL) {
	// the application is executed on Heroku ... use the postgres database
	var match = process.env.HEROKU_POSTGRESQL_IVORY_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

	sequelize = new Sequelize(match[5], match[1], match[2], {
		dialect:  'postgres',
	  	protocol: 'postgres',
	  	port:     match[4],
	  	host:     match[3],
	  	logging:  true //false
	});

} else {
	// the application is executed on the local machine 
	sequelize = new Sequelize( "prode", 'postgres', "1234", {
		host: "localhost",
		port: 5432 ,
		dialect: 'postgres'
	});
}


// USERS TABLE SHCHEMA
User = sequelize.define("user", {
	username:    { type: Sequelize.STRING },
	email:       { type: Sequelize.STRING },
	password:    { type: Sequelize.STRING},
	points:      { type: Sequelize.INTEGER, defaultValue: 0}
});

User.sync().success(function(){
	console.log("table User created")
}).error(function(err){
	console.log(err);
});


// MATCHS TABLE SCHEMA
var Match = sequelize.define("matche", {
   	team_local_id:   	 { type: Sequelize.INTEGER},
   	team_visitor_id: 	 { type: Sequelize.INTEGER},
   	team_local_name:     { type: Sequelize.STRING},
   	team_visitor_name:   { type: Sequelize.STRING},
   	fecha_id: 		 	 { type: Sequelize.INTEGER},
   	result: 		 	 { type: Sequelize.STRING(1)},
   	enabled: 		 	 { type: Sequelize.INTEGER},
}, {timestamps: false});

Match.sync().success(function(){
	console.log("table created Match")
}).error(function(err){
	console.log(err);
});


// FECHAS TABLE SCHEMA
var Fecha = sequelize.define("fecha", {
   	number: { type: Sequelize.INTEGER, index: true},
   	active: { type: Sequelize.STRING(1)},
   	torneo: { type: Sequelize.STRING},
}, {timestamps: false});

Fecha.sync().success(function(){
	console.log("Fecha created Pronosticos")
}).error(function(err){
	console.log(err);
});


// PRONOSTICOS TABLE SCHEMA
var Forecast = sequelize.define("forecast", {
   	match_id:    { type: Sequelize.INTEGER},
   	fecha_id:    { type: Sequelize.INTEGER}, 	
   	result: 	 { type: Sequelize.STRING(1)},
   	user_id:     { type: Sequelize.INTEGER, index: true},
}, {timestamps: false});

Forecast.sync().success(function(){
	console.log("table created Pronosticos")
}).error(function(err){
	console.log(err);
});


// TEAMS TABLE SCHEMA
var Team = sequelize.define("team", { 	
   	name: 	 { type: Sequelize.STRING },
   	points:  { type: Sequelize.INTEGER},
}, {timestamps: false});

Team.sync().success(function(){
	console.log("table created Team")
}).error(function(err){
	console.log(err);
});


exports.sequelize = sequelize;
exports.Sequelize = Sequelize;
exports.User 	  = User;
exports.Match 	  = Match;
exports.Fecha 	  = Fecha;
exports.Team 	  = Team;
exports.Forecast  = Forecast;