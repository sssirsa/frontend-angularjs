(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('asignacionServicioController', asignacionServicioController);

    function asignacionServicioController(SalePoint, OPTIONS, toastr, Translate, $state, $mdDialog) {
        var vm = this;

        vm.selectedKind = 'unasigned';
        vm.salePoints = null;
        vm.Assing = Assing;

        function Assing(salePoint) {
            $mdDialog.show({
                controller: 'dialogAsignacionTecnicoController',
                templateUrl: 'app/mainApp/service/external/asignacionServicio/Dialog/dialogAsignacionTecnico.tmpl.html',
                parent: angular.element(document.body),
                controllerAs: 'vm',
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    salePoint: salePoint
                }
            })
                .then(function () {
                    vm.salePoints = null;
                    vm.listSalePoints();
                });

        }

        //Function mapping
        vm.listSalePoints = listSalePoints;
        vm.selectSalePoint = selectSalePoint;


        //datos para paginado
        vm.objectAtention = null;
        vm.offset = 0;
        vm.sig = sigPage;
        vm.prev = prevPage;

        function listSalePoints() {
            vm.objectAtention = null;
            vm.loadingPromise = SalePoint.listUnasignedServices(20, vm.offset)
                .then(function (salePointsSuccess) {
                    vm.objectAtention = salePointsSuccess;
                    prepareDataFunction();
                })
                .catch(function (salePointsError) {
                    toastr.error(
                        Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                        Translate.translate('MAIN.MSG.ERROR_TITLE')
                    );
                });
        }

        function prepareDataFunction() {
            vm.salePoints = vm.objectAtention.results;
        }

        function sigPage() {
            vm.offset += 20;
            listSalePoints();
        }

        function prevPage() {
            vm.offset -= 20;
            listSalePoints();
        }

        function selectSalePoint(salePoint) {
            $state.go('triangular.admin-default.serviceAssignDetail', {id: salePoint.folio, tipo: vm.selectedKind});
        }

        initial();

        function initial(){
            listSalePoints();
        }


    }

})();
