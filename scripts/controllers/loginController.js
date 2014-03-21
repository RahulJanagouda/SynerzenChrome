myApp.controller('LoginCntrl', function ($scope,$http,$rootScope) {


$rootScope.navBar = document.getElementsByTagName('nav')[0];

$rootScope.navBar.style.visibility = 'hidden';


	$scope.login = function () {
		$http({method: 'POST', url: 'http://vibhava-market.appspot.com/Login', data: $scope.isUser}).
		success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(JSON.stringify(data, null, 4));

  	console.log(data);
	
	// navBar.style.visibility = 'visible';

  	window.location = "#invoice";

  }).
		error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
		
		

		window.location = "#invoice";
      console.log("Error");
  });

	};

})