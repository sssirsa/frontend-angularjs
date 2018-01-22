(function() {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('NewRequestPageController', NewRequestPageController);

    /* @ngInject */
    function NewRequestPageController($log, $state, toastr, Translate, Stores, Geolocation, STORE_SEGMENTATION, SCORES,
                                      TipoEquipo) {
        var vm = this;

        //Function mapping
        vm.selectedPersonChange = selectedPersonChange;
        vm.searchPerson = searchPerson;
        vm.showStoreLocation = showStoreLocation;

        //Variable declaration
        vm.request={};
        vm.store=null;

        vm.stores = null;
        vm.equipmentKinds = null;
        vm.personSearchText = null;

        //Constants declaration
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.scores = SCORES;

        activate();

        function activate(){
            loadEquipmentKinds();
        }

        function loadEquipmentKinds(){
            vm.equipmentKinds = TipoEquipo.listWitout()
                .then(function(equipmentKindList){
                    vm.equipmentKinds = equipmentKindList;
                })
                .catch(function(equipmentKindListError){
                    $log.error(equipmentKindListError);
                });
        }

        function showStoreLocation() {
            Geolocation.locate(vm.store.latitud, vm.store.longitud);
        }

        function selectedPersonChange() {
            vm.store = vm.assignedPerson;
            vm.request.establecimiento = vm.assignedPerson.id;
        }

        function searchPerson() {
            if (!vm.stores) {
                return Stores.list()
                    .then(function (userListSuccess) {
                        vm.stores = userListSuccess;
                        return searchPersonCollection();
                    })
                    .catch(function (userListError) {
                        vm.personList = null;
                        console.log(userListError);
                        console.log("Error al obtener personas");
                        toastr.error(
                            Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                            Translate.translate('MAIN.MSG.ERROR_TITLE')
                        );
                    });
            }
            else{
                return searchPersonCollection();
            }

        }

        function searchPersonCollection() {
            if (!vm.personSearchText) {
                return vm.stores;
            }
            else {
                return _.filter(vm.stores, function (item) {
                    return item.nombre_establecimiento.toLowerCase().includes(vm.personSearchText.toLowerCase());

                });
            }
        }

    }
})();
