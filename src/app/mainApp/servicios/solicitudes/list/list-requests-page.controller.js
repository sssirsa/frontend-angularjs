(function () {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('ListRequestPageController', ListRequestPageController);

    /* @ngInject */
    function ListRequestPageController($state, $log, toastr, SalePointRequests, Translate) {
        var vm = this;

        //Function mapping
        vm.listRequests = listRequests;
        vm.selectRequest = selectRequest;
        vm.downloadReport = downloadReport;

        //Variable declaration
        vm.selectedKind = null;
        vm.allRequests = null;

        activate();

        function activate() {
            vm.loadingPromise = SalePointRequests.getAll()
                .then(function (listRequestsSuccess) {
                    vm.allRequests = listRequestsSuccess;
                    vm.requests = vm.allRequests;
                })
                .catch(function (listRequestsError) {
                    $log.error(listRequestsError);
                    toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.ERROR'));
                });
        }

        function listRequests(requestKind) {
            if (requestKind !== 'Todo') {
                vm.requests = _.where(vm.allRequests, {status: requestKind});
            }
            else {
                vm.requests = vm.allRequests;
            }
        }

        function selectRequest(request) {
            $state.go('triangular.admin-default.detailRequest', {id: request.id});
        }

        function downloadReport(requestID){

        }

    }
})();
