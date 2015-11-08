angular.module('stockMarketApp.controllers', [])

.controller('AppCtrl',['$scope', '$modalService', 
      function($scope, $modalService){
        $scope.modalService = modalService;
      }])
      
.controller('MyStocksCtrl', ['$scope', 'myStocksArrayService',
      function($scope, myStocksArrayService){
        $scope.myStockArray = myStocksArrayService;
      }])     
.contoller('StockCtrl', ['$scope', '$stateParams', '$window', '$ionicPopup', 'followStockService', 'stockDataServce', 'dateService', 'chartDataService', 'notesService', 'newsService',
      function($scope, $stateParams, $window, $ionicPopup, followStockService, stockDataServce, dateService, chartDataService, notesService, newsService){
  
      }])