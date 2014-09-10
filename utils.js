var utils = {
	isValidEmail: function(email){
		if( /(.+)@(.+){2,}\.(.+){2,}/.test(email)){
			return true;
		}
	},

	isSame: function(p1, p2){
		if(p1 === p2){
			return true;
		}
	}
};


module.exports = utils;