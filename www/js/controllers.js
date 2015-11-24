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
        

      }])