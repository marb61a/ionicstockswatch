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