angular.module('stockMarketApp.services', [])

.factory('encodeURIService', function(){
  return{
    encode : function(string) {
      console.log(string);
      return encodeURIComponent(string)
      .replace(/\"/g, "%22")
      .replace(/\ /g, "%20")
      .replace(/[!'()]/g, escape);
    }
  };
})

.service('modalService', function($ionicModal){
  this.openModal = function(){
    var _this = this;

    if (id == 1) {
      // Create the search modal
      $ionicModal.fromTemplateUrl('templates/search.html', {
        scope: null,
        controller: 'SearchCtrl'
      }).then(function(modal) {
        _this.modal = modal;
        _this.modal.show();
      });
    } else if (id == 2) {
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
    } else if (id == 3) {
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
    }
  };
  
  this.closeModal = function() {

    var _this = this;

    if (!_this.modal) return;
    _this.modal.hide();
    _this.modal.remove();
  };
  
})

.factory('dateService', function($filter){

  var currentDate = function() {
    var d = new Date();
    var date = $filter('date')(d, 'yyyy-MM-dd');
    return date;
  };

  var oneYearAgoDate = function() {
    var d = new Date(new Date().setDate(new Date().getDate() - 365));
    var date = $filter('date')(d, 'yyyy-MM-dd');
    return date;
  };

  return {
    currentDate: currentDate,
    oneYearAgoDate: oneYearAgoDate
  };

})

.factory('chartDataCacheService', function(CacheFactory){
  var chartDataCache;
  
  if(!CacheFactory.get('chartDataCache')){
    chartDataCache = CacheFactory('chartDataCache', {
      maxAge: 60 * 60 * 8 * 1000,
      deleteOnExpire: 'aggressive',
      storageMode: 'localStorage'
    });
  } else{
    chartDataCache = CacheFactory.get('chartDataCache');
  }
  
  return chartDataCache;
})

.factory('notesCacheService', function(CacheFactory){
  var notesCache;
  
  if(!CacheFactory.get('notesCache')){
    notesCache = CacheFactory('notesCache', {
      maxAge: 60 * 60 * 8 * 1000,
      deleteOnExpire: 'aggressive',
      storageMode: 'localStorage'
    });
  } else{
    notesCache = CacheFactory.get('notesCache');
  }
  
  return notesCache;
})

.factory('followStockService', function(myStocksArrayService, myStocksCacheService){
  return{
    follow : function(ticker){
      var stockToAdd = {"ticker" : ticker};
      
      myStocksArrayService.push(stockToAdd);
      myStocksCacheService.put('myStocks', myStocksArrayService);
    },
    
    unfollow : function(ticker){
      for(var i = 0; i < myStocksArrayService.length; i++){
        if(myStocksArrayService[i].ticker == ticker){
          myStocksArrayService.splice(i, 1);
          myStocksCacheService.remove('myStocks');
          myStocksCacheService.put('myStocks', myStocksArrayService);

          break;
        }
      }
    },
    
    checkFollowing : function(ticker){
      for (var i = 0; i < myStocksArrayService.length; i++) {
        if (myStocksArrayService[i].ticker == ticker) {
          return true;
        }
      }

      return false;
    }
  };
})

.factory('chartDataService', function($q, $http, encodeURIService, chartDataCacheService){
  var getHistoricalData = function(ticker, fromDate, todayDate){
    var deferred = $q.defer(),
        cacheKey = ticker,
        chartDataCache = chartDataCacheService.get(cacheKey),
        query = 'select * from yahoo.finance.historicaldata where symbol = "' +
                ticker + '" and startDate = "' + fromDate + '" and endDate = "' + todayDate + '"',
        url = 'http://query.yahooapis.com/v1/public/yql?q=' +
                encodeURIService.encode(query) +
                '&format=json&env=http://datatables.org/alltables.env';
    
    if(chartDataCache){
      deferred.resolve(chartDataCache);
    } else{
      $http.get(url)
        .success(function(){
          var jsonData = json.query.results.quote;
          var priceData = [],
              volumeData = [];
              
          jsonData.forEach(function(){
            var dateToMills = dayDataObject.Date,
                date = Date.parse(dateToMills),
                price = parseFloat(Math.round(dayDataObject.Close * 100) / 100).toFixed(3),
                volume = dayDataObject.Volume,
                volumeDatum = '[' + date + ',' + volume + ']',
                priceDatum = '[' + date + ',' + price + ']';

            console.log(volumeDatum, priceDatum);

            volumeData.unshift(volumeDatum);
            priceData.unshift(priceDatum);
          }); 
          
        var formattedChartData = 
          '[{' +
              '"key":' + '"volume",' +
              '"bar":' + 'true,' +
              '"values":' + '[' + volumeData + ']' +
          '},' +
          '{' +
              '"key":' + '"' + ticker + '",' +
              '"values":' + '[' + priceData + ']' +
          '}]';
          
          deferred.resolve(formattedChartData);
          chartDataCacheService.put(cacheKey, formattedChartData);
        })
        .error(function(error){
          console.log("Chart data error: " + error);
          deferred.reject();
        });
    }
    
    return deferred.promise;
  };
  
  return{
   getHistoricalData: getHistoricalData 
  };
})

.factory('notesService', function(notesCacheService){
  return{
    function(){
      return notesCacheService.get(ticker);
    },
    
    addNote : function(ticker, note){
      var stockNotes = [];
      
      if (notesCacheService.get(ticker)) {
        stockNotes = notesCacheService.get(ticker);
        stockNotes.push(note);
      } else {
        stockNotes.push(note);
      }
      
      notesCacheService.put(ticker, stockNotes);
    },
    
    deleteNote : function(){
      var stockNotes = [];

      stockNotes = notesCacheService.get(ticker);
      stockNotes.splice(index, 1);
      notesCacheService.put(ticker, stockNotes);
    }
  };
  
})


.factory('newsService', function($q, $http) {

  return {

    getNews: function(ticker) {
      var deferred = $q.defer(),

        x2js = new X2JS(),

        url = "http://finance.yahoo.com/rss/headline?s=" + ticker;

      $http.get(url)
        .success(function(xml) {
          var xmlDoc = x2js.parseXmlString(xml),
            json = x2js.xml2json(xmlDoc),
            jsonData = json.rss.channel.item;
          deferred.resolve(jsonData);
        })
        .error(function(error) {
          deferred.reject();
          console.log("News error: " + error);
        });

      return deferred.promise;
    }
  };
})