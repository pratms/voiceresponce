
var app = angular.module('myApp', ['chart.js']); 

app.controller('DoughnutCtrl', function ($scope, $http) {
	$scope.labels = [];
	$scope.data=[];    
	$http.get("/results").success(function (response)
	{
	
		$scope.zdata= response;

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
			

		});


    $scope.Color= ['#90EE90', '#FF6600','#4D5360'];
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
app.controller("BaseCtrl",
  function ($scope, $http) {
    $scope.labels = ['No','Yes'];
    $scope.data = [];
    $scope.type = 'polarArea';
    $http.get("/result2").success(function (response)
	{
		
		$scope.zdata= response;
		
			var datalength = $scope.zdata.length;


			var current = null;
			var cnt = 0;

			for (var i = 0; i < datalength; i++) {
				if ($scope.zdata[i].response != current) {
					if (cnt > 0) {
					
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
	
				$scope.data.push(cnt);

			}
		
});
    $scope.toggle = function () {
      $scope.type = $scope.type === 'polarArea' ?
        'pie' : 'polarArea';
    };
});
