(function(){
    'use_strict';

    angular.module('app.mainApp')
    .factory('XLSX', XLSXController);

    function XLSXController($window){
        return $window.XLSX;
    }
})();