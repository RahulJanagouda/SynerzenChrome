'use strict';

var dbParams = {
    name: 'synerzenDB',
    version: 1,
    options: [
        {
            storeName: 'invoiceStore',
            keyPath: 'id',
            indexes: [
                { name: 'name', unique: false }
            ]
        }
    ]
};

var myApp = angular.module('synerzenApp',
    [
        'ngRoute',
        'angular-indexeddb'
    ]
);

myApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/invoiceForm.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
myApp.run(['IDB', function (IDB) {
    IDB.openDB(dbParams.name, dbParams.version, dbParams.options);
}]);