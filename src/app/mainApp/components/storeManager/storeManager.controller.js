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
    function storeManagerController(
        Translate,
        toastr,
        $log,
        STORE_SEGMENTATION,
        Geolocation,
        $mdDialog,
        Stores
    ) {
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
            $mdDialog.show({
                controller: 'createStoreController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/storeManager/modals/createStore.modal.tmpl.html',
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

        function modifyStore() {
            $mdDialog.show({
                controller: 'modifyStoreController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/storeManager/modals/modifyStore.modal.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals:{
                    store:vm.store
                }
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

        function deleteStore() {
            var confirm = $mdDialog.confirm()
                .title('Confirmar eliminación')
                .textContent('Confirma la eliminación del establecimiento')
                .ariaLabel('Delete store')
                .ok('Eliminar')
                .cancel('Cancelar');

            $mdDialog.show(confirm)
                .then(function(){
                    vm.deletingStore = Stores.remove(vm.store.id)
                        .then(function(){
                            vm.store=null;
                            toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.DELETE_SUCCESS'));
                        })
                        .catch(function(){
                            toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.DELETE_ERROR'));
                        });
                });

        }

        function showStoreLocation() {
            Geolocation.locate(vm.store.latitud, vm.store.longitud);
        }

    }

})();
