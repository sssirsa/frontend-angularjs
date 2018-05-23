(function () {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('NewRequestPageController', NewRequestPageController);

    /* @ngInject */
    function NewRequestPageController($log,
                                      $state,
                                      toastr,
                                      Translate,
                                      SCORES,
                                      TipoEquipo,
                                      OPTIONS,
                                      SalePointRequests,
                                      Sucursal,
                                      Helper,
                                      User) {

        var vm = this;
        vm.user = User.getUser();

        //Function mapping
        vm.storeSelected = storeSelected;
        vm.selectedEquipmentKindChange = selectedEquipmentKindChange;
        vm.searchEquipmentKind = searchEquipmentKind;
        vm.save = save;
        vm.loadSucursales = loadSucursales;
        vm.filesSelected = filesSelected;

        //Variable declaration
        vm.request = {};
        vm.equipmentKinds = null;
        vm.routes = null;
        vm.sucursales = null;
        vm.store = null;
        vm.equipmentKindSearchText = null;

        //Constants declaration
        vm.scores = SCORES;
        vm.requestKinds = OPTIONS.requestKinds;
        vm.fileValidations = {
            size: {
                max: '5MB',
                min: '10B'
            }
        };
        vm.minimalHour = '09:00:00';
        vm.maximalHour = '18:00:00';

        //Auxiliary variables
        vm.startHour = null;
        vm.endHour = null;

        activate();

        function activate() {
            loadEquipmentKinds();
        }

        function loadEquipmentKinds() {
            return TipoEquipo.listWitout()
                .then(function (equipmentKindList) {
                    vm.equipmentKinds = equipmentKindList;
                })
                .catch(function (equipmentKindListError) {
                    $log.error(equipmentKindListError);
                });
        }

        function loadSucursales() {
            if (!vm.sucursales) {
                return Sucursal.listObject()
                    .then(function (sucursalList) {
                        vm.sucursales = Helper.filterDeleted(sucursalList, true);
                    })
                    .catch(function (sucursalListError) {
                        $log.error(sucursalListError);
                    });
            }
        }

        function storeSelected(store) {
            vm.store = store;
            console.debug(store);
            if (vm.request.cabinet) {
                vm.request.cabinet = null;
            }
            vm.request.establecimiento = store.no_cliente;
        }

        function selectedEquipmentKindChange() {
            vm.equipmentKind = vm.assignedEquipmentKind;
            //Remove any previos assignment
            vm.request.solicitudes_cabinet = [];
            //Assign new kind
            vm.request.solicitudes_cabinet = [{
                id_tipo: vm.equipmentKind.id,
                tipo: vm.equipmentKind.nombre,
                cantidad: 1
            }];
        }

        function searchEquipmentKind() {
            if (!vm.equipmentKinds) {
                return TipoEquipo.list()
                    .then(function (userListSuccess) {
                        vm.equipmentKinds = Helper.filterDeleted(userListSuccess, true);
                        return searchEquipmentKindCollection();
                    })
                    .catch(function (userListError) {
                        vm.personList = null;
                        $log.error(userListError);
                        toastr.error(
                            Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                            Translate.translate('MAIN.MSG.ERROR_TITLE')
                        );
                    });
            }
            else {
                return searchEquipmentKindCollection();
            }

        }

        function searchEquipmentKindCollection() {
            if (!vm.equipmentKindSearchText) {
                return vm.equipmentKinds;
            }
            else {
                return _.filter(vm.equipmentKinds, function (item) {
                    return item.nombre.toLowerCase().includes(vm.equipmentKindSearchText.toLowerCase());

                });
            }
        }

        function save() {
            //vm.request.hora_cliente_inicio = getTime(vm.startHour);
            vm.request.hora_cliente_inicio = vm.startHour.toTimeString().substring(0,9);
            //vm.request.hora_cliente_fin = getTime(vm.endHour);
            vm.request.hora_cliente_fin = vm.endHour.toTimeString().substring(0,9);

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
                    vm.request.evidencia.push({foto: base64Image});
                };
            });
        }

    }
})();
