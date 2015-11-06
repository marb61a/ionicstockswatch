angular.module('stockMarketApp.controllers', [])

.controller('AppCtrl',['$scope', '$modalService', 
      function($scope, $modalService){
        $scope.modalService = modalService;
      }])
      
.controller('MyStocksCtrl', ['$scope', 'myStocksArrayService',
      function($scope, myStocksArrayService){
        $scope.myStockArray = myStocksArrayService;
      }])     
