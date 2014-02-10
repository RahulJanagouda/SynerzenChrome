'use strict';

myApp.controller('InvoiceCtrl', function ($scope, $http) {
    
    var INVOICE_STORE = "invoiceStore";
    var INVOICE_HEADER = "invoiceMaster";


    $scope.invoices = [];

    var date = new Date();
    $scope.invoice = {};
    $scope.invoice.invoiceId = date.getTime();
    $scope.invoice.invoiceDate = date.getDate()+" "+date.getMonth()+" "+date.getFullYear();
    $scope.invoice.invoiceStatus = "Open";
    $scope.invoice.totalQuantity = 0 ;
    $scope.invoice.totalTaxAmount = 0 ;
    $scope.invoice.grandTotal = 0;
   
    $http.get('../data/invoiceMaster.json').success(function(data) {
    $scope.invoiceMasterContent = data;
    });
    
	$http.get('../data/ItemsMaster.json').success(function(data) {
	$scope.itemMasterContent = data;
	});

    var EPMasterContent = null;
    $http.get('../data/EPMaster.json').success(function(data) {
        $scope.EPMasterContent = data;
    });

    $http.get('../data/Tax.json').success(function(data) {
    $scope.taxContent = data;
    });


    var initCallback = function(){
        getInvoices();

        console.log("HERE"+JSON.stringify($scope.invoices, null, 4));
    };

    var dataStore = new IDBStore('invoiceStore', initCallback);

    var getInvoicesSuccess = function(data){
        $scope.invoices = data;
        // http://jimhoskins.com/2012/12/17/angularjs-and-apply.html 
        $scope.$apply(); 
    };

    var errorCallback = function(){
        console.log('error'); 
    };

    var getInvoices = function(){
        dataStore.getAll(getInvoicesSuccess,errorCallback);
        console.log('getInvoices '); 
    };

    $scope.deleteInvoices = function(invoice){
        dataStore.remove(invoice,getInvoices,errorCallback);
    }

    $scope.addInoice = function(invoice){
        dataStore.put(invoice,getInvoices,errorCallback); 
        $scope.itemname = ''; 
    };
});

