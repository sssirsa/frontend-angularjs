/**
 * Created by Alejandro Noriega on 15/10/2018.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.inventory')
        .controller('notCapitalizedUpdateDialogController', notCapitalizedUpdateDialogController);

    function notCapitalizedUpdateDialogController(
        $mdDialog,
        MANAGEMENT,
        EnvironmentConfig,
        Translate,
        toastr,
        URLS,
        $scope,
        noLabeled,
        data,
        PAGINATION
    )
    {
        var vm = this;
        vm.no_labeled = {};
        vm.no_serie = data.no_serie;
        vm.economicos = data.economicos;
        vm.change = null;
        vm.sw1 = false;
        vm.confirmation = "";
        vm.new_economico = data.new_economico;

        //variables de catalogos
        if(data.status){
            vm.estatusPrevio = data.status.nombre;
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
                    url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.status_not_labeled,
                    
                    name: Translate.translate('MAIN.COMPONENTS.NO_LABELED.STATUS'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre',
                    pagination: {
                        total: PAGINATION.total,
                        limit: PAGINATION.limit,
                        offset: PAGINATION.offset,
                        pageSize: PAGINATION.pageSize
                    },
                    elements: 'results',
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                required: true
            },
            motivo: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.reason_not_labeled,
                    
                    name: Translate.translate('MAIN.COMPONENTS.NO_LABELED.REASON'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre',
                    pagination: {
                        total: PAGINATION.total,
                        limit: PAGINATION.limit,
                        offset: PAGINATION.offset,
                        pageSize: PAGINATION.pageSize
                    },
                    elements: 'results',
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                required: true
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

            if (vm.sw1 === true) {
                if (angular.isUndefined(vm.no_labeled['motivo_id'])) {
                    vm.no_labeled['motivo_id'] = data.motivo.id;
                }

                if (angular.isUndefined(vm.no_labeled['status_id'])) {
                    vm.no_labeled['status_id'] = data.status.id;
                }
            }else{
                vm.no_labeled['status_id'] = data.status.id;
                vm.no_labeled['motivo_id'] = data.motivo.id;
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
