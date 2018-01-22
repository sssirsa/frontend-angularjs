(function () {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('NewRequestPageController', NewRequestPageController);

    /* @ngInject */
    function NewRequestPageController($log, $state, toastr, Translate, Stores, Geolocation, STORE_SEGMENTATION, SCORES,
                                      TipoEquipo, OPTIONS) {
        var vm = this;

        //Function mapping
        vm.selectedStoreChange = selectedStoreChange;
        vm.searchStore = searchStore;
        vm.selectedEquipmentKindChange = selectedEquipmentKindChange;
        vm.searchEquipmentKind = searchEquipmentKind;

        vm.showStoreLocation = showStoreLocation;

        //Variable declaration
        vm.request = {};
        vm.store = null;
        vm.selectedKind = null;

        vm.stores = null;
        vm.equipmentKinds = null;
        vm.storeSearchText = null;

        //Constants declaration
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.scores = SCORES;
        vm.requestKinds = OPTIONS.requestKinds;

        activate();

        function activate() {
            loadEquipmentKinds();
        }

        function loadEquipmentKinds() {
            vm.equipmentKinds = TipoEquipo.listWitout()
                .then(function (equipmentKindList) {
                    vm.equipmentKinds = equipmentKindList;
                })
                .catch(function (equipmentKindListError) {
                    $log.error(equipmentKindListError);
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
                        vm.stores = userListSuccess;
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
            vm.request.solocitudes_cabinet = {};
            //Assign new kind
            vm.request.solocitudes_cabinet = {
                id_tipo: vm.equipmentKind.id,
                cantidad: 1
            };
        }

        function searchEquipmentKind() {
            if (!vm.equipmentKinds) {
                return TipoEquipo.list()
                    .then(function (userListSuccess) {
                        vm.equipmentKinds = userListSuccess;
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

    }
})();
