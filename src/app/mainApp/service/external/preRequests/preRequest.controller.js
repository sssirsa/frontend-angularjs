(function(){
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('preRequestListController',preRequestListController);
    function preRequestListController(preRequests, toastr, Translate) {

        var vm = this;
        //Listado de Variables

        vm.list=[];
        vm.offset = 0;
        vm.filteredActivated = false;
        vm.limit = 5;
        vm.lastFilter = 'Todo';
        vm.lastKindFilter = 'Todo';

        //Listado de funciones

        vm.listpreRequests=listpreRequests;
        vm.listFilteredpreRequests=listFilteredpreRequests;
        vm.sig = sigPage;
        vm.prev = prevPage;
        listpreRequests();

        function listpreRequests() {
            vm.loadingPromise = preRequests.getAll(vm.limit, vm.offset)
                .then(function(listprerequestelements){
                    vm.list=listprerequestelements;
                    prepareDataFunction();
                })
                .catch(function (errCarga) {
                    toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.ERROR'));
                });

        }
        function listFilteredpreRequests(requestKind) {
            vm.filteredActivated = true;
            vm.lastFilter = requestKind;
            if (vm.lastKindFilter !== requestKind){
                vm.offset = 0;
                vm.lastKindFilter = requestKind;
            }
            if (requestKind === 'Todo') {
                listpreRequests();
            }
            else {
                var filterSTR = 'status='+requestKind;
                vm.loadingPromise = preRequests.getAll(vm.limit, vm.offset, filterSTR)
                    .then(function(listprerequestelements){
                        vm.list=listprerequestelements;
                        prepareDataFunction();
                    })
                    .catch(function (errCarga) {
                        toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.ERROR'));
                    });
            }
        }

        function prepareDataFunction() {
            vm.requests = vm.list.results;
            vm.filteredActivated = false;
        }

        function sigPage() {
            vm.offset += vm.limit;
            listFilteredpreRequests(vm.lastFilter);
        }

        function prevPage() {
            vm.offset -= vm.limit;
            listFilteredpreRequests(vm.lastFilter);
        }

    }
})();
