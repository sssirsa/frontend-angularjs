(function () {
    'use_strict';
    angular
        .module('app.mainApp')
        .controller('createStoreController', createStoreController);

    /* @ngInject */
    function createStoreController(
        Stores,
        toastr,
        Translate,
        $mdDialog,
        Helper,
        ErrorHandler,
        $log,
        QUERIES
    ) {
        var vm = this;

        //Variables
        vm.store = {};
        vm.state = null;
        vm.city = null;
        vm.canLoadLocalities = false;
        vm.postalCode = null;
        vm.postalCodeQuery = null;
        vm.knownPostalCode = true;
        vm.catalogues = Stores.catalogues;

        //Functions
        vm.accept = accept;
        vm.cancel = cancel;
        vm.selectState = selectState;
        vm.selectCity = selectCity;
        vm.selectLocality = selectLocality;
        vm.selectSegmentation = selectSegmentation;
        vm.changeSwitch = changeSwitch;
        vm.changePostalCode = changePostalCode;

        function accept() {
            createStore();
        }

        function createStore() {
            vm.loadingPromise = Stores.create(vm.store)
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
            vm.state = state;
            vm.city = null;
            vm.store['localidad_id'] = null;
            vm.catalogues['cities'].catalog.query = QUERIES.city.by_state;
            vm.catalogues['cities'].catalog.query_value = vm.state;
        }

        function selectCity(city) {
            vm.city = city;
            vm.store['localidad_id'] = null;
            vm.catalogues['localities'].catalog.query = QUERIES.locality.by_city;
            vm.catalogues['localities'].catalog.query_value = vm.city;

        }

        function selectLocality(locality) {
            vm.store['localidad_id'] = locality;
        }

        function selectSegmentation(segmentation) {
            vm.store['segmentacion_id'] = segmentation;
        }

        function changeSwitch() {
            vm.state = null;
            vm.city = null;
            vm.store['localidad_id'] = null;
            vm.postalCode = null;
            vm.postalCodeQuery = null;
        }

        function changePostalCode() {
            if (vm.postalCodeQuery.length === 5) {
                vm.postalCode = vm.postalCodeQuery;
                vm.catalogues['localities'].catalog.query = QUERIES.locality.by_postal_code;
                vm.catalogues['localities'].catalog.query_value = vm.postalCode;
            }
            else {
                vm.postalCode = null;
            }
        }
    }

})();
