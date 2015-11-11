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