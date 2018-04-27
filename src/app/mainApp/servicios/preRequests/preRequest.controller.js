(function(){
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('preRequestListController',preRequestListController);
    function preRequestListController( ) {

        var vm = this;

        vm.list=[];


    }
})();
