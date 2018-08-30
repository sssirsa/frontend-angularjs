(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('asignacionServicioController', asignacionServicioController);

    function asignacionServicioController(SalePoint, OPTIONS, toastr, Translate, $state, $mdDialog) {
        var vm = this;

        vm.selectedKind = 'unasigned';
        vm.salePoints = null;
        vm.salePointKinds = [{id: 'unasigned', value: 'Sin asignar'}];
        vm.Assing = Assing;

        function Assing(salePoint) {
            console.log(salePoint);
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
                    vm.selectedKind = 'unasigned';
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
            if (vm.selectedKind) {
                vm.objectAtention = null;
                switch (vm.selectedKind) {
                    case 'unasigned':
                        vm.loadingPromise = SalePoint.listUnasignedServices('?limit=20&offset='+vm.offset)
                            .then(function (salePointsSuccess) {
                                vm.objectAtention = salePointsSuccess;
                                prepareDataFunction();
                                console.log(salePointsSuccess);
                            })
                            .catch(function (salePointsError) {
                                console.log(salePointsError);
                                toastr.error(
                                    Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                                    Translate.translate('MAIN.MSG.ERROR_TITLE')
                                );
                            });
                        break;
                }
            }
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
