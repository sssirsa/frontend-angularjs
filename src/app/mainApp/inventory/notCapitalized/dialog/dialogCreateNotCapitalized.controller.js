/**
 * Created by Alejandro Noriega on 15/10/2018.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.inventory')
        .controller('notCapitalizedDialogController', notCapitalizedDialogController);

    function notCapitalizedDialogController($mdDialog, MANAGEMENT, EnvironmentConfig, Translate, toastr, User, URLS, $scope, noLabeled, Helper)
    {
        var vm = this;
        vm.user = User.getUser();
        vm.no_labeled = {};
        vm.no_serie = null;
        vm.economicos = [];

        //Functions
        vm.create = create;
        vm.cancel = cancel;
        vm.onElementSelect = onElementSelect;

        //variables definicion
        vm.selectedItem = null;
        vm.transformChip = transformChip;

        //Fields
        vm.catalogues = {
            estatus_no_capitalizado: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.status_not_labeled,
                    kind: 'Generic',
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
                    url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.reason_not_labeled,
                    kind: 'Generic',
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


        function create() {
            if($scope.newNCForm.$error.pattern !== undefined){
                console.log("error",$scope.newNCForm.$error);
                toastr.error("Llene corectamente todos los campos");
            }else{

                if(vm.no_serie) {
                    vm.no_labeled['no_serie'] = vm.no_serie;
                }

                if(vm.economicos.length > 0){
                    vm.no_labeled['economicos_id'] = vm.economicos;
                }

                //$mdDialog.hide("Regreso lo que hizo");
                vm.createPromise = noLabeled.create(vm.no_labeled)
                    .then(function (res) {
                        $scope.newNCForm.$setPristine();
                        $scope.newNCForm.$setUntouched();

                        $mdDialog.hide(res);
                    }).catch(function (err) {
                        $mdDialog.cancel(err);
                    });
            }
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
    }
})();
