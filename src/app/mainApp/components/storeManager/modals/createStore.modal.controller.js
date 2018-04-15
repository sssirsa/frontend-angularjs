(function () {
    'use_strict';
    angular
        .module('app.mainApp')
        .controller('createStoreController', createStoreController);

    /* @ngInject */
    function createStoreController(Stores,
                                   toastr,
                                   Translate,
                                   $mdDialog,
                                   Helper,
                                   $log,
                                   States,
                                   Cities,
                                   STORE_SEGMENTATION,
                                   Localities) {
        var vm = this;

        //Variables
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.store = null;
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
            Stores.create(vm.store)
                .then(function(){
                    toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.CREATE_SUCCESS'));
                    $mdDialog.hide();
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
                States.list()
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
                return Cities.getByState(state)
                    .then(function (citiesList) {
                        vm.cities = _.sortBy(Helper.filterDeleted(citiesList, true), 'nombre');
                    })
                    .catch(function (citiesListError) {
                        $log.error(citiesListError);
                    });
            }
            else {
                return Cities.list()
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
                return Localities.getByCity(city)
                    .then(function (localitiesList) {
                        vm.localities = _.sortBy(Helper.filterDeleted(localitiesList, true), 'nombre');
                    })
                    .catch(function (localitiesListError) {
                        $log.error(localitiesListError);
                    });
            }
            else {
                return Localities.list()
                    .then(function (localitiesList) {
                        vm.cities = Helper.filterDeleted(localitiesList, true);
                    })
                    .catch(function (localitiesListError) {
                        $log.error(localitiesListError);
                    });
            }
        }

        function selectState() {
            vm.city = null;
            vm.locality = null;
            vm.cities = null;
            vm.localities = null;
        }

        function selectCity() {
            vm.locality = null;
            vm.localities = null;
        }

    }

})();
