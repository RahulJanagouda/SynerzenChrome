'use strict';

var dbParams = {
    name: 'synerzenDB',
    version: 11,
    options: [
        {
            storeName: 'invoiceStore',
            keyPath: 'id',
            indexes: [
                { name: 'name', unique: false }
            ]
        },
        {
            storeName: 'items',
            keyPath: 'ItemCode',
            indexes: [
                { name: 'ItemDesc', unique: false }
            ]
        },
        {
            storeName: 'EPMaster',
            keyPath: 'EPCode',
            indexes: [
                { name: 'EPName', unique: false }
            ]
        },
        {
            storeName: 'invoiceMaster',
            keyPath: 'invoiceId',
            indexes: [
                { name: 'invoiceId', unique: true }
            ]
        },
        {
            storeName: 'invoiceLine',
            keyPath: 'invoiceId',
            indexes: [
                { name: 'ItemCode', unique: false }
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
            templateUrl: 'views/login.html',
            controller: 'InvoiceCtrl'
        })
        .when('/invoice', {
            templateUrl: 'views/invoices.html',
            controller: 'InvoiceCtrl'
        })
        .when('/newInvoice', {
            templateUrl: 'views/createInvoice.html',
            controller: 'InvoiceCtrl'
        })
        .when('/items', {
            templateUrl: 'views/items.html',
            controller: 'InvoiceCtrl'
        })
        .when('/parties', {
            templateUrl: 'views/parties.html',
            controller: 'InvoiceCtrl'
        })
        .when('/tax', {
            templateUrl: 'views/tax.html',
            controller: 'InvoiceCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});

myApp.run(['IDB', function (IDB) {
    IDB.openDB(dbParams.name, dbParams.version, dbParams.options);
}]);

