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
    ],
    function($httpProvider)
{
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data)
  {
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */ 
    var param = function(obj)
    {
      var query = '';
      var name, value, fullSubName, subName, subValue, innerObj, i;
      
      for(name in obj)
      {
        value = obj[name];
        
        if(value instanceof Array)
        {
          for(i=0; i<value.length; ++i)
          {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value instanceof Object)
        {
          for(subName in value)
          {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value !== undefined && value !== null)
        {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
      
      return query.length ? query.substr(0, query.length - 1) : query;
    };
    
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
}
);

myApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginCntrl'
        })
        .when('/order', {
            templateUrl: 'views/orders.html',
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

