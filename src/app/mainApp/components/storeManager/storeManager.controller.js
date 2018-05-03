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
        Stores,
        Segmentation) {
        var vm = this;

        //Variable declaration
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.store = null;
        vm.urlArchivo = null;
        vm.no_cliente = null;

        //Function Parsing
        vm.searchStore = searchStore;
        vm.createStore = createStore;
        vm.modifyStore = modifyStore;
        vm.deleteStore = deleteStore;
        vm.showStoreLocation = showStoreLocation;

        //edit by Alex
        vm.showCredential = showCredential;
        vm.showPDF = showPDF;
        vm.selectSegmentation = selectSegmentation;


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
                    vm.storeSelected({store:store});
                    showPDF();
                    selectSegmentation();
                })
                .catch(function(storeError){
                    if(storeError){
                        $log.error(storeError);
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
                    vm.storeSelected({store:store});
                    showPDF();
                    selectSegmentation();
                })
                .catch(function(storeError){
                    if(storeError){
                        $log.error(storeError);
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
                    vm.storeSelected({store:store});
                    showPDF();
                    selectSegmentation();
                })
                .catch(function(storeError){
                    if(storeError){
                        $log.error(storeError);
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
                    vm.deletingStore = Stores.remove(vm.store.no_cliente)
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

        function showCredential() {
            var credential = angular.copy(vm.store.qr_code);
            $mdDialog.show({
                controller: 'credentialStoreController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/storeManager/modals/credentialStore.modal.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    data: credential
                }
            })
                .then(function () {
                })
                .catch(function(){
                });
        }

        function showPDF() {
            vm.no_cliente = angular.copy(vm.store.no_cliente);
            Stores.getPDF(vm.no_cliente)
                .then(function (res) {
                    vm.urlPDF = res;
                })
                .catch(function (err) {
                })
        }

        function selectSegmentation() {
            Segmentation.list()
                .then(function (res) {
                    vm.storeSegmentation = res;
                    vm.segmentationSelect = vm.store.segmentacion.id;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

    }

})();
