(function(){
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('preRequestListController',preRequestListController);
    function preRequestListController(preRequests) {

        var vm = this;
        //Listado de Variables

        vm.list=[];

        //Listado de funciones

        vm.listpreRequests=listpreRequests;
        listpreRequests();

        function listpreRequests() {
            var promiseListadoPreRequests=preRequests.getAll();
            promiseListadoPreRequests.then(function(listprerequestelements){
                vm.list=listprerequestelements;
                console.log(vm.list);
            }).catch(function (errCarga) {
                console.log(errCarga);

            });

        }



    }
})();
