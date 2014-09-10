(function($){
	'use strict';

	var App = {};

	App.Forecast = {
		init: function(){
			this.events();
			this.get();
		},

		events: function(){
			$(".select-fecha").on("change", function(){
				var fechaNumber = this.value;
				window.location = "/fecha/" + fechaNumber;
			});

			$("#send-forecast").on("click", this.saveForecast);
		},

		get: function(){
			var fechaNumber = window.location.pathname.split("/")[2];
			$.ajax({
				url: '/users/forecast/' + fechaNumber,
				dataType:"json",
				success: function(data){
					$.each(data, function(index, value){
						$('input:radio[name=match-'+ value.match_id +']').each(function(i, v){ 
							//console.log(value.result)
							//console.log($(this).attr("value"))
							if($(this).attr("value") == value.result){
								$(this).attr("checked", "checked");	
							} 
						});
					});
					
				},
				error: function(err){
					console.log(err);
				}
			});
		},

		saveForecast: function(e){
			e.preventDefault();
			var forecastToSave = [];

			$(".form-forecast").find("input[type=radio]").each(function(index, value){
				var that = $(this);
				if(that.is(":checked")){
					//console.log($(this).attr("name"));
					//console.log($(this).attr("value"));
					var idMatch = that.attr("name").split("-")[1];
					var result  = that.attr("value");
					// save object  with input radios defined
					forecastToSave.push({ idMatch: idMatch, result: result });  
					//console.log(forecastToSave.length)
				}
			});


			// loop over and save forecast
			console.log(forecastToSave.length)
			var forecastLen = forecastToSave.length;
			var countSave = 0;

			for(var index in forecastToSave){
				$.ajax({
					url: "/forecast/save",
					method: "post",
					dataType: "json",
					data: forecastToSave[index],
					success: function(data){
						countSave++;
						console.log(countSave);
						console.log(forecastLen)
						if(countSave == forecastLen){
							// show success message
							$("#success-message-forecast").fadeIn();
						}
					},
					error: function(){

					}
				})


			}
			
		}
	}


	App.Forecast.init();

})(jQuery);