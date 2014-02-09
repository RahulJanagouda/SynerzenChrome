'use strict';

myApp.controller('InvoiceCtrl', function ($scope, $rootScope, IDB, $http) {
    
    var self = this;
    var INVOICE_STORE = "invoiceStore";
    var INVOICE_HEADER = "invoiceMaster";
    var INVOICE_LINES = "invoiceLine";
	var ITEMS_STORE = "items";
    var EPMASTER_STORE = "EPMaster";

    $scope.allInvoices = [];

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

$scope.getAllInvoices = function() {
    IDB.getAll(INVOICE_HEADER);
};


    var myDefaultList = [
    {
        "id" : 8906044570078,
        "name" : "Mango Premium 5kg",
        "price" : 4,
        "quantity" : 100,
        "discount" : 100,
        "taxCode" : "T005",
        "taxName" : "VAT  5.5%",
        "taxRate" : 5.5,
        "taxAmount" : 16.500,
        "total" : 316.500,
        "invoiceId" : 123456,
    }
    ];


$scope.saveInvoice = function(invoice,lineItems) {

invoice.lineItems = $scope.listOThings;
console.log(JSON.stringify(invoice, null, 4));
// console.log(JSON.stringify($scope.listOThings, null, 4));

    IDB.put(INVOICE_HEADER, invoice);
    // IDB.batchInsert(INVOICE_LINES, lineItems);


    var temp = IDB.getAll(INVOICE_HEADER);
    for (var i = 0; i < temp.length; i++) {
        console.log("Objecto numero: "+i);
    };

};





    $scope.listOThings = [];
    $scope.addItem = function(item){


        var lineItem = {};
        lineItem.id = item.name.ItemCode;
        lineItem.name = item.name.ItemDesc;
        lineItem.price =  new Number((new Number(item.name.FixedCost)).toFixed(3));
        lineItem.quantity = new Number((new Number(item.quantity)).toFixed(3));
        lineItem.discount =  new Number((new Number(item.discount)).toFixed(3));
        lineItem.taxCode= item.tax.TaxCode;
        lineItem.taxName = item.tax.TaxDisc;
        lineItem.taxRate = new Number((new Number(item.tax.AmtOrPerc)).toFixed(3));

        var a = new Number((lineItem.price*lineItem.quantity-lineItem.discount)*lineItem.taxRate/100);
        lineItem.taxAmount = new Number(a.toFixed(3));
        var b = new Number((lineItem.price*lineItem.quantity-lineItem.discount)+a);
        lineItem.total = new Number(b.toFixed(3));
        
        IDB.put(INVOICE_STORE, lineItem);
        console.log(JSON.stringify(lineItem, null, 4) + "Inserted !!");

    };

    $scope.removeAll = function(){
        IDB.removeAll(INVOICE_STORE);
    };


$scope.calculateTotal = function() {
    var lineItemArray = $scope.listOThings;
    $scope.invoice.grandTotal=0;
    $scope.invoice.totalQuantity=0;
    $scope.invoice.totalTaxAmount=0;
    console.log("In calculate");
    for (var i = lineItemArray.length - 1; i >= 0; i--) {
        $scope.invoice.grandTotal += lineItemArray[i].total;

        $scope.invoice.totalQuantity += lineItemArray[i].quantity;
        $scope.invoice.totalTaxAmount += lineItemArray[i].taxAmount;

        // console.log(JSON.stringify(lineItemArray[i].total, null, 4));
    };
};


    

    $scope.removeItem = function(id) {
        IDB.remove(INVOICE_STORE, id);
    };

    this.update = function (data) {
        $rootScope.$apply(function () {
            console.log('update, apply', data);
            $scope.listOThings = data;
            $scope.calculateTotal();
            $scope.getAllInvoices();
            if (!$scope.listOThings || $scope.listOThings.length <= 0) {
                $scope.listOThings = [];
                 IDB.batchInsert(INVOICE_STORE, myDefaultList);
                
            }
        });
    };

    var dbupdate = function (event, args) {
        console.log("list-o-things DBUPDATE");
        console.log('args', args);
        var dbname = args[0],
            storeName = args[1],
            data = args[2];
        console.log('update', dbname, storeName, data);
        if (dbname === dbParams.name && INVOICE_STORE === storeName)
            self.update(data);
    };

    var getAllThings = function (transaction) {
        console.log('getAllThings', transaction);
        if (transaction instanceof IDBTransaction)
            IDB.getInit(transaction, INVOICE_STORE);
        else
            IDB.getAll(INVOICE_STORE);
    };

    var getAll = function (event, data) {
        console.log("things DBGETALL");
        var dbname = data[0],
            storeName = data[1],
            transaction = data[2];
        console.log('getAll', dbname, storeName, transaction);
        if (dbname === dbParams.name && INVOICE_STORE === storeName)
            getAllThings(transaction);
    };

    // This callback is for after the database is initialized the first time
    var postInitDb = function (event, data) {
        var dbname = data[0],
            transaction = data[1];
        console.log('postInit', dbname, transaction);
        if (dbname !== dbParams.name)
            return;

        getAllThings(transaction);
    };


    $rootScope.$on('failure', function () {
        console.log('failed to open db')
    });
    $rootScope.$on('dbopenupgrade', postInitDb);
    $rootScope.$on('dbopen', postInitDb);

    $rootScope.$on('getinit', dbupdate);
    $rootScope.$on('getall', dbupdate);
    $rootScope.$on('remove', getAll);
    $rootScope.$on('put', getAll);
    $rootScope.$on('clear', getAll);
    $rootScope.$on('batchinsert', getAll);

    (function () {
        // if the db has not been initialized, then the listeners should work
        if (!IDB.db)
            return;
        // if the db has been initialized, then the listeners won't get the events,
        // and we need to just do a request immediately
        getAllThings();
    })();




});

