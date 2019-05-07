(function () {
    angular
        .module('app.mainApp.salepoint.pre_request')
        .controller('preRequestController', preRequestController);

    function preRequestController(
        URLS,
        PREREQUESTS,
        ErrorHandler,
        $state
    ) {

        var vm = this;

        //Listado de Variables

        vm.list=[];
        vm.offset = 0;
        vm.filteredActivated = false;
        vm.limit = 20;
        vm.lastFilter = 'Abierta';
        vm.lastKindFilter = 'Abierta';
        vm.refreshPaginationButtonsComponent = false;

        //Listado de funciones

        vm.listPreRequests=listPreRequests;
        vm.listFilteredPreRequests=listFilteredPreRequests;
        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;
        vm.statusDetail = statusDetail;
        listFilteredPreRequests('Abierta');

        function listPreRequests() {
            vm.loadingPromise = PREREQUESTS.listPreRequests(vm.limit, vm.offset)
                .then(function(listprerequestelements){
                    vm.list=listprerequestelements;
                    prepareDataFunction();
                })
                .catch(function (errCarga) {
                    ErrorHandler.errorTranslate(errCarga);
                });

        }
        function listFilteredPreRequests(requestKind) {
            vm.filteredActivated = true;
            vm.refreshPaginationButtonsComponent = false;
            vm.lastFilter = requestKind;
            if (vm.lastKindFilter !== requestKind){
                vm.offset = 0;
                vm.lastKindFilter = requestKind;
            }
            if (requestKind === 'Todo') {
                listPreRequests();
            }
            else {
                var filterSTR = 'status='+requestKind;
                vm.loadingPromise = PREREQUESTS.listPreRequests(vm.limit, vm.offset, filterSTR)
                    .then(function(listprerequestelements){
                        vm.list=listprerequestelements;
                        prepareDataFunction();
                    })
                    .catch(function (errCarga) {
                        ErrorHandler.errorTranslate(errCarga);
                    });
            }
        }

        function statusDetail(id) {
            $state.go('triangular.admin-default.detail-pre-request', {id: id});
        }

        function prepareDataFunction() {
            vm.requests = vm.list.results;
            if (vm.list.count > vm.limit) {
                vm.refreshPaginationButtonsComponent = true;
            }
            vm.filteredActivated = false;
        }

        function sigPage() {
            vm.offset += vm.limit;
            listFilteredPreRequests(vm.lastFilter);
        }

        function prevPage() {
            vm.offset -= vm.limit;
            listFilteredPreRequests(vm.lastFilter);
        }

        function goToNumberPage(number) {
            vm.offset = number * vm.limit;
            listFilteredPreRequests(vm.lastFilter);
        }

    }

})();
