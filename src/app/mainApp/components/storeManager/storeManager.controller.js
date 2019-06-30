(function () {

    angular
        .module('storeManager')
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
    function storeManagerController(Translate,
                                    toastr,
                                    $log,
                                    Geolocation,
                                    $mdDialog,
                                    Stores,
                                    ErrorHandler) {
        var vm = this;

        //Variable declaration
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
                    vm.storeSelected({store: store});
                    //showPDF();
                })
                .catch(function (storeError) {
                    if (storeError) {
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
                    vm.storeSelected({store: store});
                    //showPDF();
                })
                .catch(function (storeError) {
                    if (storeError) {
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
                locals: {
                    store: vm.store
                }
            })
                .then(function (store) {
                    vm.store = store;
                    vm.storeSelected({store: store});
                    //showPDF();
                })
                .catch(function (storeError) {
                    if (storeError) {
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
                .then(function () {
                    vm.deletingStore = Stores.remove(vm.store.no_cliente)
                        .then(function () {
                            vm.store = null;
                            toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.DELETE_SUCCESS'));
                        })
                        .catch(function (errorDeleteStore) {
                            ErrorHandler.errorTranslate(errorDeleteStore);
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
                .catch(function () {
                });
        }

        function showPDF() {
            vm.no_cliente = angular.copy(vm.store.no_cliente);
            Stores.getPDF(vm.no_cliente)
                .then(function (pdfFile) {
                    vm.urlPDF = pdfFile;
                })
                .catch(function (pdfFileError) {
                    ErrorHandler.errorTranslate(pdfFileError);
                });
        }

    }

})();
