(function(){
    'use_strict';

    angular.module('app.mainApp').factory('_',_);
    function _($window){
        return $window._;
    }
})();
