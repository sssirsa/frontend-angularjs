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

        //Variable declaration
        vm.selectedKind = null;
        vm.allRequests = null;

        activate();

        function activate() {
            SalePointRequests.getAll()
                .then(function (listRequestsSuccess) {
                    vm.allRequests = listRequestsSuccess;
                    $log.debug(listRequestsSuccess);
                })
                .catch(function (listRequestsError) {
                    $log.error(listRequestsError);
                    toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.ERROR'));
                });
        }

        function listRequests(requestKind) {
            vm.requests = _.findWhere(vm.requests, {status: requestKind});
        }

        function selectRequest(request) {
            $state.go('triangular.detailRequest', {id: request.folio});
        }

    }
})();
