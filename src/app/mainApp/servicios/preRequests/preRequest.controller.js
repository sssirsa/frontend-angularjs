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
        vm.listFilteredpreRequests=listFilteredpreRequests;
        listpreRequests();

        function listpreRequests() {
            var promiseListadoPreRequests=preRequests.getAll();
            promiseListadoPreRequests.then(function(listprerequestelements){
                vm.list=listprerequestelements;
                vm.requests = vm.list;
                console.log(vm.list);
            }).catch(function (errCarga) {
                console.log(errCarga);

            });

        }
        function listFilteredpreRequests(requestKind) {
            if (requestKind !== 'Todo') {
                vm.requests = _.where(vm.list, {status: requestKind});
            }
            else {
                vm.requests = vm.list;
            }
        }



    }
})();
