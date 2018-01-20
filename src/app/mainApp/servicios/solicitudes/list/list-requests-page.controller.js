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
        vm.selectedKind = null;
        vm.requestKinds = [
            {id: 'pending', value: 'Abiertas'},
            {id: 'attended', value: 'Atendidas'}
        ];

        vm.requests = null;
        vm.attendedRequests = [
            {
                folio: 'CUN-01-PROD-17',
                estado: 'Atendida',
                fecha: '27/11/2017 13:00:00'
            },
            {
                folio: 'CUN-02-PROD-17',
                estado: 'Atendida',
                fecha: '27/11/2017 13:09:54'
            },
            {
                folio: 'MEX-01-HANG-17',
                estado: 'Atendida',
                fecha: '26/10/2017 07:12:33'
            },
            {
                folio: 'HUX-01-BAND-17',
                estado: 'Atendida',
                fecha: '27/10/2017 07:54:02'
            }
        ];
        vm.pendingRequests = [
            {
                folio: 'MTY-01-PROD-17',
                estado: 'Abierta',
                fecha: '24/11/2017 13:45:57'
            },
            {
                folio: 'CUN-03-PROD-17',
                estado: 'Abierta',
                fecha: '20/11/2017 13:09:54'
            },
            {
                folio: 'MEX-02-HANG-17',
                estado: 'Abierta',
                fecha: '27/10/2017 07:12:33'
            },
            {
                folio: 'HUX-02-BAND-17',
                estado: 'Abierta',
                fecha: '22/10/2017 07:54:02'
            },
            {
                folio: 'MTY-02-HANG-17',
                estado: 'Abierta',
                fecha: '25/11/2017 13:45:57'
            },
            {
                folio: 'CUN-04-BAND-17',
                estado: 'Abierta',
                fecha: '21/11/2017 13:09:54'
            },
            {
                folio: 'MEX-03-CORP-17',
                estado: 'Abierta',
                fecha: '27/10/2017 11:12:33'
            },
            {
                folio: 'HUX-03-HANG-17',
                estado: 'Abierta',
                fecha: '23/10/2017 07:54:02'
            }
        ];
        vm.cancelledRequests = [
            {
                folio: 'CUN-05-PROD-17',
                estado: 'Cancelada',
                fecha: '27/11/2017 13:00:00'
            },
            {
                folio: 'CUN-06-PROD-17',
                estado: 'Cancelada',
                fecha: '27/11/2017 13:09:54'
            },
            {
                folio: 'MEX-04-HANG-17',
                estado: 'Cancelada',
                fecha: '26/10/2017 07:12:33'
            },
            {
                folio: 'HUX-04-BAND-17',
                estado: 'Cancelada',
                fecha: '27/10/2017 07:54:02'
            }
        ];
        vm.closedRequests = [
            {
                folio: 'CUN-08-PROD-17',
                estado: 'Cerrada',
                fecha: '27/11/2017 13:00:00'
            },
            {
                folio: 'HUX-05-BAND-17',
                estado: 'Cerrada',
                fecha: '27/10/2017 07:54:02'
            }
        ];
        vm.inProcessRequests = [
            {
                folio: 'CUN-07-PROD-17',
                estado: 'En_proceso',
                fecha: '27/11/2017 13:09:54'
            },
            {
                folio: 'MEX-05-HANG-17',
                estado: 'En_proceso',
                fecha: '26/10/2017 07:12:33'
            }
        ];

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
