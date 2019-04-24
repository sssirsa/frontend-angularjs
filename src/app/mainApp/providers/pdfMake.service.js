(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('pdfMake', pdfMakeProvider);
    function pdfMakeProvider($window){
        return $window.pdfMake;
    }
})();
