/**
 * Created by Alejandro Noriega on 15/10/2018.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.inventory')
        .controller('notCapitalizedUpdateDialogController', notCapitalizedUpdateDialogController);

    function notCapitalizedUpdateDialogController($mdDialog, MANAGEMENT, Translate, toastr, URLS, $scope, noLabeled, data, ErrorHandler)
    {
        var vm = this;
        vm.no_labeled = {};
        vm.no_serie = data.no_serie;
        vm.economicos = data.economicos;
        vm.change = null;
        vm.sw1 = false;
        vm.confirmation = "";

        //variables de catalogos
        if(data.status){
            vm.estatusPrevio = data.status;
        }else{
            vm.estatusPrevio = "Sin asignar";
        }

        if(data.motivo){
            vm.motivoPrevio = data.motivo.nombre;
        }else{
            vm.motivoPrevio = "Sin asignar";
        }


        //Functions
        vm.update = update;
        vm.cancel = cancel;
        vm.onElementSelect = onElementSelect;
        vm.changeM = changeM;
        vm.remove = remove;
        vm.acceptConfirm = acceptConfirm;
        vm.cancelConfirm = cancelConfirm;
        vm.transformChip = transformChip;

        //Fields
        vm.catalogues = {
            estatus_no_capitalizado: {
                catalog: {
                    url: MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.estatus_no_capitalizado,
                    kind: 'Management',
                    name: Translate.translate('MAIN.COMPONENTS.NO_LABELED.STATUS'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            motivo: {
                catalog: {
                    url: MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.motivo_no_labeled,
                    kind: 'Management',
                    name: Translate.translate('MAIN.COMPONENTS.NO_LABELED.REASON'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            }
        };

        function changeM() {
            if(vm.sw1 === true){
                vm.change = "1";
            }else{
                vm.change = "";
            }
        }

        function update() {
            if(vm.no_serie) {
                vm.no_labeled['no_serie'] = vm.no_serie;
            }

            if(vm.economicos.length > 0){
                vm.no_labeled['economicos_id'] = vm.economicos;
            }

            //$mdDialog.hide("Regreso lo que hizo");
            noLabeled.update(data.id, vm.no_labeled)
                .then(function (res) {
                    $mdDialog.hide(res);
                })
                .catch(function (err) {
                    $mdDialog.hide(err);
                });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function onElementSelect(element, field) {
            vm.no_labeled[field] = element;
        }

        function transformChip(chip) {
            if (angular.isObject(chip)) {
                return chip;
            }

            return { name: chip, type: 'new' };
        }

        function remove() {
            vm.confirmation = "confirma";
        }

        function acceptConfirm() {
            noLabeled.dlete(data.id)
                .then(function (res) {
                    $mdDialog.hide(res);
                })
                .catch(function (err) {
                    $mdDialog.hide(err);
                });
        }

        function cancelConfirm() {
            $mdDialog.cancel(null);
        }
    }
})();
