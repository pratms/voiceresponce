
				   var myApp = angular.module("myApp" , [])
				   .controller("myController" , function($scope, $http)
				   	
				   {
				  

						$scope.SendData = function() {
						$http.post('/view1',$scope.formData).
						success(function(data) {
						$scope.success = "Message Sent";
						}).error(function(data) {
						console.error("error in posting");
						})
						}

						$scope.ReceiveData = function(){

						$http.get("/posts").success(function (response)
						{
							
							$scope.show = true;


						$scope.data = response;



						});




						}
					

						$http.get("/").success(function (response)
						{


						$scope.data = response;



						});

		   
				   });