(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint')
        .controller('NewRequestPageController', NewRequestPageController);

    /* @ngInject */
    function NewRequestPageController(
        $log,
        $state,
        toastr,
        Translate,
        SCORES,
        OPTIONS,
        SalePointRequests,
        Helper,
        User,
        URLS,
        EnvironmentConfig
    ) {

        var vm = this;
        vm.user = User.getUser();

        //Function mapping
        vm.storeSelected = storeSelected;
        vm.save = save;
        vm.filesSelected = filesSelected;
        vm.onSelectedSucursal = onSelectedSucursal;
        vm.onSelectedEquipmentKind = onSelectedEquipmentKind;

        //Variable declaration
        vm.request = {};
        vm.routes = null;
        vm.store = null;

        //Constants declaration
        vm.scores = SCORES;
        vm.requestKinds = OPTIONS.requestKinds;
        vm.fileValidations = {
            size: {
                max: '5MB',
                min: '10B'
            }
        };
        vm.catalogSucursal = {
            catalog: {
                url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.subsidiary,
                kind: 'Generic',
                name: 'Sucursal',
                loadMoreButtonText: 'Cargar mas',
                model: 'id',
                option: 'nombre'
            },
            elements: 'results'

        };
        vm.catalogEquipmentKind = {
            catalog: {
                url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.equipment_type,
                kind: 'Generic',
                name: 'Tipo Equipo a asignar',
                loadMoreButtonText: 'Cargar mas',
                model: 'id',
                option: 'nombre'
            },
            elements: 'results'

        };
        vm.minimalHour = '09:00:00';
        vm.maximalHour = '18:00:00';

        //Auxiliary variables
        vm.startHour = null;
        vm.endHour = null;

        //function loadEquipmentKinds() {
        //    return TipoEquipo.listWitout(vm.limitEquipo, vm.offsetEquipo)
        //        .then(function (equipmentKindList) {
        //            vm.equipmentKinds = equipmentKindList.results;
        //        })
        //        .catch(function (equipmentKindListError) {
        //            $log.error(equipmentKindListError);
        //        });
        //}

        //function loadSucursales() {
        //    if (!vm.sucursales) {
        //        return Sucursal.listObject(vm.limitSucursales, vm.limitSucursales)
        //            .then(function (sucursalList) {
        //                vm.sucursales = Helper.filterDeleted(sucursalList.results, true);
        //            })
        //            .catch(function (sucursalListError) {
        //                $log.error(sucursalListError);
        //            });
        //    }
        //}

        function onSelectedSucursal(element) {
            vm.request.sucursal = element;
        }

        function onSelectedEquipmentKind() {
            vm.equipmentKind = vm.assignedEquipmentKind;
            //Remove any previos assignment
            vm.request.solicitudes_cabinet = [];
            //Assign new kind, quantity limited to 1 due to actual constraint
            vm.request.solicitudes_cabinet = [{
                id_tipo: vm.equipmentKind.id,
                tipo: vm.equipmentKind.nombre,
                cantidad: 1
            }];
        }

        function storeSelected(store) {
            vm.store = store;
            if (vm.request.cabinet) {
                vm.request.cabinet = null;
            }
            vm.request.establecimiento = store.no_cliente;
        }        

        function save() {
            //vm.request.hora_cliente_inicio = getTime(vm.startHour);
            vm.request.hora_cliente_inicio = vm.startHour.toTimeString().substring(0, 9);
            //vm.request.hora_cliente_fin = getTime(vm.endHour);
            vm.request.hora_cliente_fin = vm.endHour.toTimeString().substring(0, 9);

            vm.savingPromise = SalePointRequests.create(vm.request)
                .then(function () {
                    $state.go('triangular.admin-default.listRequest');
                    toastr.success(
                        Translate.translate('MAIN.MSG.GENERIC_SUCCESS_CREATE')
                    );
                })
                .catch(function (requestSuccessError) {
                    $log.error(requestSuccessError);
                    toastr.error(
                        Translate.translate('MAIN.MSG.ERROR_MESSAGE')
                    );
                });
        }

        function filesSelected(files) {
            vm.request.evidencia = [];
            angular.forEach(files, function (image) {
                var base64Image = null;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(image);
                fileReader.onloadend = function () {
                    base64Image = fileReader.result;
                    vm.request.evidencia.push({ foto: base64Image });
                };
            });
        }

    }
})();
