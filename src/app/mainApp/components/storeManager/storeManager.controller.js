(function () {

    angular
        .module('app.mainApp')
        .component('storeManager', {
            templateUrl: 'app/mainApp/components/storeManager/storeManager.tmpl.html',
            controller: storeManagerController,
            bindings: {
                canCreate: '<',
                canModify: '<',
                canDelete: '<',
                canSearch: '<',
                store: '<',
                storeSelected: '&'
            }
        });

    /* @ngInject */
    function storeManagerController(Translate, toastr, $log, STORE_SEGMENTATION, Geolocation, $mdDialog) {
        var vm = this;

        //Variable declaration
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.store = null;

        //Function Parsing
        vm.searchStore = searchStore;
        vm.createStore = createStore;
        vm.modifyStore = modifyStore;
        vm.deleteStore = deleteStore;
        vm.showStoreLocation = showStoreLocation;


        function searchStore() {
            $mdDialog.show({
                controller: 'searchStoreController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/storeManager/modals/searchStore.modal.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true
            })
                .then(function (store) {
                    vm.store = store;
                })
                .catch(function(storeError){
                    if(storeError){
                        //TODO: Error handling
                    }
                });
        }

        function createStore() {

        }

        function modifyStore() {

        }

        function deleteStore() {

        }

        function showStoreLocation() {
            Geolocation.locate(vm.store.latitud, vm.store.longitud);
        }

    }

})();
