'use strict';

myApp.controller('MainCtrl', function ($scope, $rootScope, IDB) {
    var self = this;
    var INVOICE_STORE = "invoiceStore";

    var myDefaultList = [
        {
            id: 1,
            name: "Broom",
            param: "100"
        },
        {
            id: 2,
            name: "VVV",
            param: "100"
        },
        {
            id: 3,
            name: "Phenyl",
            param: "10"
        },
        {
            id: 4,
            name: "Sanitizer",
            param: "1000"
        }
    ];

    $scope.listOThings = [];

    $scope.combobox = function() {
        $( "#combobox" ).combobox();
        $( "#toggle" ).click(function() {
        $( "#combobox" ).toggle();
        });
    };

    $scope.addItem = function(item){
        IDB.put(INVOICE_STORE, item);
    };

    $scope.removeAll = function(){
        IDB.removeAll(INVOICE_STORE);
    };

    $scope.removeItem = function(id) {
        IDB.remove(INVOICE_STORE, id);
    };

    this.update = function (data) {
        $rootScope.$apply(function () {
            console.log('update, apply', data);
            $scope.listOThings = data;
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
