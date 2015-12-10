angular.module('stockMarketApp.controllers', [])

.controller('AppCtrl', ['$scope', 'modalService', 'userService',
  function($scope, modalService, userService) {

    $scope.modalService = modalService;

    $scope.logout = function() {
      userService.logout();
    };

}])
      
.controller('MyStocksCtrl', ['$scope', 'myStocksArrayService', 'stockDataService', 'stockPriceCacheService', 'followStockService',
  function($scope, myStocksArrayService, stockDataService, stockPriceCacheService, followStockService) {

    $scope.$on("$ionicView.afterEnter", function() {
      $scope.getMyStocksData();
    });

    $scope.getMyStocksData = function() {

      myStocksArrayService.forEach(function(stock) {

        var promise = stockDataService.getPriceData(stock.ticker);

        $scope.myStocksData = [];

        promise.then(function(data) {
          $scope.myStocksData.push(stockPriceCacheService.get(data.symbol));
        });
      });

      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.unfollowStock = function(ticker) {
      followStockService.unfollow(ticker);
      $scope.getMyStocksData();
    };
}])
      
.contoller('StockCtrl', ['$scope', '$stateParams', '$window', '$ionicPopup', 'followStockService', 'stockDataServce', 'dateService', 'chartDataService', 'notesService', 'newsService',
      function($scope, $stateParams, $window, $ionicPopup, followStockService, stockDataServce, dateService, chartDataService, notesService, newsService){
            $scope.ticker = $stateParams.stockTicker;
            $scope.chartView = 4;
            $scope.oneYearAgoDate = dateService.oneYearAgoDate();
            $scope.todayDate = dateService.currentDate();
            $scope.stockNotes = [];
            $scope.following = followStockService.checkFollowing($scope.ticker);
            
            $scope.chartViewFunc = function(n){
                $scope.chartView = n;
            };
            
            $scope.$on("$ionicView.afterEnter", function(){
                getPriceData();
                getDetailsData();
                getChartData();
                getNews();
                $scope.stockNotes = notesService.getNotes($scope.ticker);
            });
            
            $scope.toggleFollow = function() {
                if ($scope.following) {
                followStockService.unfollow($scope.ticker);
                $scope.following = false;
                } else {
                followStockService.follow($scope.ticker);
                $scope.following = true;
                }
            };
            
            $scope.openWindow = function(link) {
                
            };
            
            $scope.addNote = function() {
                $scope.note = {title: 'Note', body: '', date: $scope.todayDate, ticker: $scope.ticker};
                
                var note = $ionicPopup.show({
                template: '<input type="text" ng-model="note.title" id="stock-note-title"><textarea type="text" ng-model="note.body" id="stock-note-body"></textarea>',
                title: 'New Note for ' + $scope.ticker,
                scope: $scope,
                buttons: [
                  {
                    text: 'Cancel',
                    onTap: function(e) {
                      return;
                    }
                  },
                  {
                    text: '<b>Save</b>',
                    type: 'button-balanced',
                    onTap: function(e) {
                      notesService.addNote($scope.ticker, $scope.note);
                      console.log("save: ", $scope.note);
                    }
                  }
                ]
                });
                note.then(function(res) {
                    $scope.stockNotes = notesService.getNotes($scope.ticker);
                });
            };
            
              $scope.openNote = function(index, title, body) {
              $scope.note = {title: title, body: body, date: $scope.todayDate, ticker: $scope.ticker};
        
              var note = $ionicPopup.show({
                template: '<input type="text" ng-model="note.title" id="stock-note-title"><textarea type="text" ng-model="note.body" id="stock-note-body"></textarea>',
                title: $scope.note.title,
                scope: $scope,
                buttons: [
                  {
                    text: 'Delete',
                    type: 'button-assertive button-small',
                    onTap: function(e) {
                      notesService.deleteNote($scope.ticker, index);
                    }
                  },
                  {
                    text: 'Cancel',
                    type: 'button-small',
                    onTap: function(e) {
                      return;
                    }
                  },
                  {
                    text: '<b>Save</b>',
                    type: 'button-balanced button-small',
                    onTap: function(e) {
                      notesService.deleteNote($scope.ticker, index);
                      notesService.addNote($scope.ticker, $scope.note);
                      console.log("save: ", $scope.note);
                    }
                  }
                ]
              });
              note.then(function(res) {
                $scope.stockNotes = notesService.getNotes($scope.ticker);
              });
            };

          function getPriceData() {
            var promise = stockDataServce.getPriceData($scope.ticker);
      
            promise.then(function(data){
              console.log(data);
              $scope.stockPriceData = data;
      
              if (data.chg_percent >= 0 && data !== null) {
                $scope.reactiveColor = {
                  'background-color': '#33cd5f',
                  'border-color': 'rgba(255,255,255,.3)'
                };
              } else if (data.chg_percent < 0 && data === null) {
                $scope.reactiveColor = {
                  'background-color': '#ef473a',
                  'border-color': 'rgba(0,0,0,.2)'
                };
            }
          });
        }
        
        function getDetailsData() {
          var promise = stockDataServce.getDetailsData($scope.ticker);
    
          promise.then(function(data){
            console.log(data);
            $scope.stockDetailsData = data;
          });
        }
        
        function getChartData(){
          var promise = chartDataService.getHistoricalData($scope.ticker, $scope.oneYearAgoDate, $scope.todayDate);
          
          promise.then(function(data) {

            $scope.myData = JSON.parse(data)
                          	.map(function(series) {
                          		series.values = series.values.map(function(d) { return {x: d[0], y: d[1] }; });
                          		return series;
                          	});
          });
          }
         
         var marginBottom = ($window.innerWidth / 100) * 10;

      }])
      
      
.controller('SearchCtrl', ['$scope', '$state', 'modalService', 'searchService', function($scope, $state, modalService, searchService){
  $scope.closeModal = function(){
    modalService.closeModal();
  };
  
  $scope.search = function(){
    $scope.searchResults = '';
    startSearch($scope.searchQuery);
  }
  
  var startSearch = ionic.debounce(function(query) {
      searchService.search(query)
        .then(function(data) {
          $scope.searchResults = data;
        });
    }, 400);

  $scope.goToStock = function(ticker) {
    modalService.closeModal();
    $state.go('app.stock', {stockTicker: ticker});
  };
  
}])      