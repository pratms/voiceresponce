
				  //  var myApp = angular.module("myApp" , [])
				  //  .controller("myController" , function($scope, $http)
				   	
				  //  {
				  

						// $scope.SendData = function() {
						// $http.post('/view1',$scope.formData).
						// success(function(data) {
						// $scope.success = "Message Sent";
						// }).error(function(data) {
						// console.error("error in posting");
						// })
						// }

						// $scope.ReceiveData = function(){

						// $http.get("/posts").success(function (response)
						// {
							
						// 	$scope.show = true;


						// $scope.data = response;



						// });




						// }
					

						// $http.get("/").success(function (response)
						// {


						// $scope.data = response;



						// });

		   
				  //  });
var app = angular.module('myApp', ['chart.js']); 
    
app.controller('DoughnutCtrl', function ($scope, $http) {
    $scope.labels = [];
$scope.data=[];
    
 $http.get("/results").success(function (response)
						{
							console.log(response);
						$scope.zdata= response.sort();
						console.log($scope.zdata.sort());
						var datalength = $scope.zdata.length;
						
						
						var current = null;
						var cnt = 0;

						for (var i = 0; i < datalength; i++) {
							if ($scope.zdata[i].response != current) {
								if (cnt > 0) {
									var label = "Rated"+current;
									$scope.labels.push(label);
									$scope.data.push(cnt);
									
								}
								current = $scope.zdata[i].response;
								cnt = 1;

							} else 
							{
								cnt++;
								

							}


						}
						if (cnt > 0) {
							label = "Rated"+current;
							$scope.labels.push(label);
							$scope.data.push(cnt);
							
						}
						console.log($scope.data);
						
						});


    $scope.Color= ['#90EE90', '#FF6600', '#8080FF'];
    //PieDataSetOverride is used to draw lines to display the labels

    $scope.DataSetOverride = [{ yAxisID: 'y-axis-1' }]; //y-axis-1 is the ID defined in scales under options.

    $scope.options = {
        legend: { display: true },
        responsive: true,  // set to false to remove responsiveness. Default responsive value is true.
     animation:{
        animateRotate:true,
        animateScale:true,
    },
    cutoutPercentage:70,

        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }]
        }
    }
});
