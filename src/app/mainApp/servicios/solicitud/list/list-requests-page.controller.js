(function () {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('ListRequestPageController', ListRequestPageController);

    /* @ngInject */
    function ListRequestPageController($state) {
        var vm = this;

        //Function mapping
        vm.listRequests = listRequests;
        vm.selectRequest = selectRequest;

        //Variable declaration
        vm.requests = null;

        activate();

        function activate(){

        }

        function listRequests(requestKind) {
            switch (requestKind) {
                case 'Abierta':
                    vm.requests = vm.pendingRequests;
                    break;
                case 'Atendida':
                    vm.requests = vm.attendedRequests;
                    break;
                case 'Cancelada':
                    vm.requests = vm.cancelledRequests;
                    break;
                case 'Cerrada':
                    vm.requests = vm.closedRequests;
                    break;
                case 'En_proceso':
                    vm.requests = vm.inProcessRequests;
                    break;
            }

        }

        function selectRequest(request) {
            $state.go('triangular.detailRequest', {id: request.folio});
        }

    }
})();
