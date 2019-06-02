//Create by Alex 25/01/2019

(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('modalImpedimentController',modalImpedimentController);

    function modalImpedimentController(
        cabinetUC,
        $mdDialog,
        data,
        $scope,
        toastr,
        Translate,
        URLS,
        ErrorHandler,
        EnvironmentConfig,
        PAGINATION
    )
    {
        var vm = this;

        //variables
        vm.cabinet = {};
        vm.economico = data.economico;
        vm.service = true;

        vm.loadingPromise = null;
        vm.confirmation = "";
        vm.validate = true;

        //funciones
        vm.cerrar = cerrar;
        vm.impediment = impediment;
        vm.acceptConfirm = acceptConfirm;
        vm.cancelConfirm = cancelConfirm;
        vm.onElementSelect = onElementSelect;

        //Translates
        vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
        vm.successImpediment = Translate.translate('MAIN.MSG.SUCCESS_IMPEDIMENT');

        //Blank variables templates
        vm.catalogues = {
            motivo: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.impediment,
                    kind: 'Generic',
                    name: Translate.translate('MAIN.MENU.CATALOGS.IMPEDIMENT_REASON'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion',
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

        function cerrar() {
            $mdDialog.cancel(null);
        }

        function impediment() {
            vm.confirmation = "confirma";
        }

        function onElementSelect(element, field) {
            vm.cabinet[field] = element;
            vm.validate = false;
        }

        function acceptConfirm() {
            vm.cabinet['economico_id'] = vm.economico;

            if(vm.service === true){
                vm.cabinet['atendible'] = true;
            }else{
                vm.cabinet['atendible'] = false;
            }

            cabinetUC.notDepartures(vm.cabinet)
                .then(function (res) {
                    toastr.success(vm.successImpediment, vm.successTitle);
                    $mdDialog.hide(res);
                })
                .catch(function (err) {
                    ErrorHandler.errorTranslate(err);
                    $mdDialog.hide(err);
                });
        }

        function cancelConfirm() {
            $mdDialog.cancel(null);
        }


    }

})();
