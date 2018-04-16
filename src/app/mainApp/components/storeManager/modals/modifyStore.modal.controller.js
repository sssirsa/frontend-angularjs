(function () {
    'use_strict';
    angular
        .module('app.mainApp')
        .controller('modifyStoreController', modifyStoreController);

    /* @ngInject */
    function modifyStoreController(Stores,
                                   toastr,
                                   Translate,
                                   $mdDialog,
                                   Helper,
                                   $log,
                                   States,
                                   Cities,
                                   STORE_SEGMENTATION,
                                   store,
                                   Localities) {
        var vm = this;

        //Variables
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.store = store;
        vm.store.latitud= parseFloat(store.latitud);
        vm.store.longitud= parseFloat(store.longitud);

        vm.states = null;
        vm.cities = null;
        vm.localities = null;
        vm.state = null;
        vm.city = null;
        vm.locality = null;
        vm.postal_code = null;
        vm.economic = null;
        vm.selectedTab = 0;
        vm.stores = null;

        //Functions
        vm.accept = accept;
        vm.cancel = cancel;
        vm.listStates = listStates;
        vm.listCities = listCities;
        vm.listLocalities = listLocalities;
        vm.selectState = selectState;
        vm.selectCity = selectCity;

        activate();

        function activate() {
            listStates();
        }


        function accept() {
            vm.store.localidad_id = vm.locality.id;
            vm.loadingPromise = Stores.update(vm.store, vm.store.id)
                .then(function(createdStore){
                    toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.CREATE_SUCCESS'));
                    $mdDialog.hide(createdStore);
                })
                .catch(function(errorCreateStore){
                    $log.error(errorCreateStore);
                    toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.CREATE_ERROR'));
                });
        }

        function cancel() {
            $mdDialog.cancel(null);
        }

        function listStates() {
            if (!vm.states) {
                vm.loadingStates = States.list()
                    .then(function (stateList) {
                        vm.states = _.sortBy(Helper.filterDeleted(stateList, true), 'nombre');
                    })
                    .catch(function (stateListError) {
                        $log.error(stateListError);
                        vm.states = null;
                        toastr.error(Translate.translate('CITIES.TOASTR.ERROR_STATE_LIST'));
                    });
            }
        }

        function listCities(state) {
            if (state) {
                vm.loadingCities = Cities.getByState(state)
                    .then(function (citiesList) {
                        vm.cities = _.sortBy(Helper.filterDeleted(citiesList, true), 'nombre');
                    })
                    .catch(function (citiesListError) {
                        $log.error(citiesListError);
                    });
            }
            else {
                vm.loadingCities = Cities.list()
                    .then(function (citiesList) {
                        vm.cities = Helper.filterDeleted(citiesList, true);
                    })
                    .catch(function (citiesListError) {
                        $log.error(citiesListError);
                    });
            }
        }

        function listLocalities(city) {
            if (city) {
                vm.loadingLocalities = Localities.getByCity(city)
                    .then(function (localitiesList) {
                        vm.localities = _.sortBy(Helper.filterDeleted(localitiesList, true), 'nombre');
                    })
                    .catch(function (localitiesListError) {
                        $log.error(localitiesListError);
                    });
            }
            else {
                vm.loadingLocalities = Localities.list()
                    .then(function (localitiesList) {
                        vm.cities = Helper.filterDeleted(localitiesList, true);
                    })
                    .catch(function (localitiesListError) {
                        $log.error(localitiesListError);
                    });
            }
        }

        function selectState() {
            listCities(vm.state);
            vm.city = null;
            vm.locality = null;
            vm.cities = null;
            vm.localities = null;
        }

        function selectCity() {
            listLocalities(vm.city);
            vm.locality = null;
            vm.localities = null;
        }

    }

})();
