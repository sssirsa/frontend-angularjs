/**
 * Created by Alejandro Noriega on 15/10/2018.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.inventory')
        .controller('notCapitalizedDialogController', notCapitalizedDialogController);

    function notCapitalizedDialogController($mdDialog, MANAGEMENT, Translate, toastr, User, URLS, $scope, Helper)
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


        function create() {
            if($scope.newNCForm.$error.pattern !== undefined){
                console.log("error",$scope.newNCForm.$error);
            }else{
                $scope.newNCForm.$setPristine();
                $scope.newNCForm.$setUntouched();

                $mdDialog.hide("Regreso lo que hizo");
                /*vm.createPromise = Cabinet.createClean(vm.cabinet).then(function (res) {
                    $mdDialog.hide(vm.cabinet.economico);
                }).catch(function (err) {
                    $mdDialog.cancel(err);
                });*/
            }
        }

        function cancel() {
            console.log("Cancelaaaaa");
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
