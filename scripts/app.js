
var myApp = angular.module('synerzenApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
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
            controller: 'ItemCtrl'
        })
        .when('/parties', {
            templateUrl: 'views/parties.html',
            controller: 'PartyCtrl'
        })
        .when('/tax', {
            templateUrl: 'views/tax.html',
            controller: 'TaxCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
