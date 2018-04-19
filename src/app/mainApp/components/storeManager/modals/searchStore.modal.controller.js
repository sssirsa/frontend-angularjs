(function () {
    'use_strict';
    angular
        .module('app.mainApp')
        .controller('searchStoreController', searchStoreController);

    /* @ngInject */
    function searchStoreController(Stores,
                                   toastr,
                                   Translate,
                                   $mdDialog,
                                   Helper,
                                   $log,
                                   States,
                                   Cities,
                                   Localities) {
        var vm = this;

        //Variables
        vm.translateRoot = 'MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH';
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
        vm.search = search;
        vm.changeTab = changeTab;

        activate();

        function activate() {
            listStates();
        }


        function accept(store) {
            $mdDialog.hide(store);
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

        function search() {
            vm.stores = null;
            switch (vm.selectedTab) {
                case 0:
                    if (vm.state) {
                        if (vm.city) {
                            if (vm.locality) {
                                //Look up by locality
                                vm.loadingPromise = Stores.getByLocality(vm.locality)
                                    .then(function (storeList) {
                                        vm.stores = Helper.filterDeleted(storeList, true);
                                    })
                                    .catch(function (storeListError) {
                                        $log.error(storeListError);
                                        toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                                    });
                            }
                            else {
                                //Look up by city
                                vm.loadingPromise = Stores.getByCity(vm.city)
                                    .then(function (storeList) {
                                        vm.stores = Helper.filterDeleted(storeList, true);
                                    })
                                    .catch(function (storeListError) {
                                        $log.error(storeListError);
                                        toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                                    });
                            }
                        }
                        else {
                            //Look up by state
                            vm.loadingPromise = Stores.getByState(vm.state)
                                .then(function (storeList) {
                                    vm.stores = Helper.filterDeleted(storeList, true);
                                })
                                .catch(function (storeListError) {
                                    $log.error(storeListError);
                                    toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                                });
                        }
                    }
                    break;
                case 1:
                    vm.loadingPromise = Stores.getByPostalCode(vm.postal_code)
                        .then(function (storeList) {
                            vm.stores = Helper.filterDeleted(storeList, true);
                        })
                        .catch(function (storeListError) {
                            $log.error(storeListError);
                            toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                        });
                    break;
                case 2:
                    vm.loadingPromise = Stores.getByEconomic(vm.economic)
                        .then(function (storeList) {
                            var justStores = [];
                            angular.forEach(storeList, function (item) {
                                if(!item.fecha_salida)
                                justStores.push(item.establecimiento);
                            });
                            vm.stores = Helper.filterDeleted(justStores, true);
                        })
                        .catch(function (storeListError) {
                            $log.error(storeListError);
                            toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                        });
                    break;
            }
        }

        function changeTab() {
            vm.state = null;
            vm.city = null;
            vm.locality = null;
            vm.postal_code = null;
            vm.economic = null;
            vm.stores = null;
        }

    }

})();
