(function () {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('NewRequestPageController', NewRequestPageController);

    /* @ngInject */
    function NewRequestPageController($log, $state, toastr, Translate, Stores, Geolocation, STORE_SEGMENTATION, SCORES,
                                      TipoEquipo, OPTIONS, Routes, SalePointRequests, Sucursal, Helper) {
        var vm = this;

        //Function mapping
        vm.selectedStoreChange = selectedStoreChange;
        vm.searchStore = searchStore;

        vm.selectedEquipmentKindChange = selectedEquipmentKindChange;
        vm.searchEquipmentKind = searchEquipmentKind;

        vm.save = save;

        vm.showStoreLocation = showStoreLocation;

        vm.loadRoutes = loadRoutes;
        vm.loadSucursales = loadSucursales;

        //Variable declaration
        vm.request = {};
        vm.store = null;

        vm.stores = null;
        vm.equipmentKinds = null;
        vm.routes = null;
        vm.sucursales = null;

        vm.storeSearchText = null;
        vm.equipmentKindSearchText = null;

        //Constants declaration
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.scores = SCORES;
        vm.requestKinds = OPTIONS.requestKinds;

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
            return Sucursal.listObject()
                .then(function (sucursalList) {
                    vm.sucursales = Helper.filterDeleted(sucursalList,true);
                })
                .catch(function (sucursalListError) {
                    $log.error(sucursalListError);
                });
        }

        function showStoreLocation() {
            Geolocation.locate(vm.store.latitud, vm.store.longitud);
        }

        function selectedStoreChange() {
            vm.store = vm.assignedStore;
            vm.request.establecimiento = vm.assignedStore.id;
        }

        function searchStore() {
            if (!vm.stores) {
                return Stores.list()
                    .then(function (userListSuccess) {
                        vm.stores = Helper.filterDeleted(userListSuccess,true);
                        return searchStoreCollection();
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
                return searchStoreCollection();
            }

        }

        function searchStoreCollection() {
            if (!vm.storeSearchText) {
                return vm.stores;
            }
            else {
                return _.filter(vm.stores, function (item) {
                    return item.nombre_establecimiento.toLowerCase().includes(vm.storeSearchText.toLowerCase());

                });
            }
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
                        vm.equipmentKinds = Helper.filterDeleted(userListSuccess,true);
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

        function loadRoutes() {
            return Routes.list()
                .then(function (routeList) {
                    vm.routes = routeList;
                })
                .catch(function (routeListError) {
                    $log.error(routeListError);
                });
        }

        function save() {
            SalePointRequests.create(vm.request)
                .then(function () {
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

    }
})();
