var db 	   = require("../db");
var bcrypt = require("bcrypt-nodejs");
var utils  = require("../utils.js")

console.log(utils);

UserDB = db.sequelize.define("user", {
	username:    { type: db.Sequelize.STRING },
	email:       { type: db.Sequelize.STRING },
	password:    { type: db.Sequelize.STRING},
	points:      { type: db.Sequelize.INTEGER}
});

UserDB.sync().success(function(){
	console.log("table User created")
}).error(function(err){
	console.log(err);
});

function User(){
	this.fuck = "this is a test";
};


User.prototype.register = function(req, res){
	var username     = req.body.username;
	var email     	 = req.body.email;
	var password  	 = req.body.password;
	var passwordR    = req.body.passwordrepeat;

	var error = false;
	if(username.length == 0){
		req.flash('messageusername', 'Ingresa un nombre de usuario');
		error = true;
	}

	if(!utils.isValidEmail(email)){
		req.flash('messageemail', 'El email no es valido!');
		error = true;
	}

	if(password.length == 0){
		req.flash('messagepass', 'Ingresa un password');
		error = true;
	}else{
		if(!utils.isSame(password, passwordR)){
			req.flash('messagepass', 'Los passwords no coinciden!');
			error = true;
		}
	}

	if(error){
		res.redirect("/users/register");
		return;
	}

	// CHECK IF EMAIL IS ALREADY REGISTERED
	UserDB.find({ 
		where: { email: email }
	}).success(function(user){
		if(user){
			// SEND MESSAGE 
			req.flash('messageregister', 'El email ya esta registrado');
			res.redirect("/users/register");
			return;
		}else{
			// CREATE NEW USER
			var passwordHash = bcrypt.hashSync(password);
			UserDB.create({
				username: username,
				email: email,
				password: passwordHash
			}).success(function(user){
				req.flash('messagelogin', 'El registro se realizo correctamente');
				res.redirect("users/login");
			}).error(function(err){
				res.json(err);
			});
		}
	}).error(function(err){
		res.json(err);
	});		
};


User.prototype.login = function(req, res){
	var email     	 = req.body.email;
	var password  	 = req.body.password;

	UserDB.find({ 
		where: {email: email }
	}).success(function(user){
		// COMPARE HASH PASSWORD
		if(user){
			var passwordCheck = bcrypt.compareSync(password, user.password);
			if(passwordCheck){
				req.session.user = user;
				req.session.userid = user.id;
				req.session.username = user.username;
				//res.redirect("/session");
				res.redirect("/fecha/7");
			}else{
				req.flash('loginfalse', 'No existe usuario registrado con esos datos');
				res.redirect("users/login");
			}
		}else{
			req.flash('loginfalse', 'No existe usuario registrado con esos datos');
			res.redirect("users/login");
		}
		
	}).error(function(err){
		res.json(err);
	});
}





module.exports = User;