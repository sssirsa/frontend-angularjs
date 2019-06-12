(function () {
    'use_strict';
    angular
        .module('app.mainApp')
        .controller('modifyStoreController', modifyStoreController);

    /* @ngInject */
    function modifyStoreController(
        Stores,
        store,
        toastr,
        Translate,
        $mdDialog,
        Helper,
        $log,
        ErrorHandler,
        QUERIES
    ) {
        var vm = this;

        //Variables
        vm.store = angular.fromJson(angular.toJson(store));
        vm.state = null;
        vm.city = null;
        vm.canLoadLocalities = false;
        vm.postalCode = null;
        vm.postalCodeQuery = null;
        vm.knownPostalCode = true;
        vm.catalogues = Stores.catalogues;
        vm.changedAddresElements = false;

        //Functions
        vm.accept = accept;
        vm.cancel = cancel;
        vm.selectState = selectState;
        vm.selectCity = selectCity;
        vm.selectLocality = selectLocality;
        vm.selectSegmentation = selectSegmentation;
        vm.changeSwitch = changeSwitch;
        vm.changePostalCode = changePostalCode;

        activate();

        function activate() {
            vm.store.latitud = parseFloat(vm.store.latitud);
            vm.store.longitud = parseFloat(vm.store.longitud);
            vm.postalCodeQuery = vm.store.localidad.codigo_postal;
            vm.postalCode = vm.store.localidad.codigo_postal;
            changePostalCode();
        }

        function accept() {
            modifyStore();
        }

        function modifyStore() {
            vm.loadingPromise = Stores.update(vm.store, vm.store.no_cliente)
                .then(function (createdStore) {
                    toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.CREATE_SUCCESS'));
                    $mdDialog.hide(createdStore);
                })
                .catch(function (errorCreateStore) {
                    ErrorHandler.errorTranslate(errorCreateStore);
                });
        }

        function cancel() {
            $mdDialog.cancel(null);
        }

        function selectState(state) {
            vm.catalogues['cities'].catalog.query = QUERIES.city.by_state;
            vm.catalogues['cities'].catalog.query_value = state;
            vm.state = state;
            if (state !== vm.store.localidad.municipio.estado.id) {
                vm.changedAddresElements = true;
                vm.city = null;
                vm.store['localidad_id'] = null;
            }
        }

        function selectCity(city) {
            vm.catalogues['localities'].catalog.query = QUERIES.locality.by_city;
            vm.catalogues['localities'].catalog.query_value = city;
            vm.city = city;
            if (city !== vm.store.localidad.municipio.id) {
                vm.changedAddresElements = true;
                vm.store['localidad_id'] = null;
            }
        }

        function selectLocality(locality) {
            vm.store['localidad_id'] = locality;
            if (locality !== vm.store.localidad.id) {
                vm.changedAddresElements = true;
            }
        }

        function selectSegmentation(segmentation) {
            vm.store['segmentacion_id'] = segmentation;
        }

        function changeSwitch() {
            if (vm.changedAddresElements) {
                vm.state = null;
                vm.city = null;
                vm.store['localidad'] = null;
                vm.postalCode = null;
                vm.postalCodeQuery = null;
            }
        }

        function changePostalCode() {
            if (vm.postalCodeQuery.length === 5) {
                vm.postalCode = vm.postalCodeQuery;
                vm.catalogues['localities'].catalog.query = QUERIES.locality.by_postal_code;
                vm.catalogues['localities'].catalog.query_value = vm.postalCode;
                if (vm.store.localidad.codigo_postal !== vm.postalCode) {
                    vm.changedAddresElements = true;
                }
            }
            else {
                vm.postalCode = null;
            }
        }

    }

})();
