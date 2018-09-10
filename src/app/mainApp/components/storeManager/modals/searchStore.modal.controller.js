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
        vm.limit = 20;
        vm.offset = 0;
        vm.fullStores = null;

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
        vm.sig = sigPage;
        vm.prev = prevPage;

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
                                vm.loadingPromise = Stores.getByLocality(vm.locality, vm.limit, vm.offset)
                                    .then(function (storeList) {
                                        prepareDataFunction(storeList);
                                    })
                                    .catch(function (storeListError) {
                                        $log.error(storeListError);
                                        toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                                    });
                            }
                            else {
                                //Look up by city
                                vm.loadingPromise = Stores.getByCity(vm.city, vm.limit, vm.offset)
                                    .then(function (storeList) {
                                        prepareDataFunction(storeList);
                                    })
                                    .catch(function (storeListError) {
                                        $log.error(storeListError);
                                        toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                                    });
                            }
                        }
                        else {
                            //Look up by state
                            vm.loadingPromise = Stores.getByState(vm.state, vm.limit, vm.offset)
                                .then(function (storeList) {
                                    prepareDataFunction(storeList);
                                })
                                .catch(function (storeListError) {
                                    $log.error(storeListError);
                                    toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                                });
                        }
                    }
                    break;
                case 1:
                    vm.loadingPromise = Stores.getByPostalCode(vm.postal_code, vm.limit, vm.offset)
                        .then(function (storeList) {
                            prepareDataFunction(storeList);
                        })
                        .catch(function (storeListError) {
                            $log.error(storeListError);
                            toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                        });
                    break;
                case 2:
                    vm.loadingPromise = Stores.getByEconomic(vm.economic, vm.limit, vm.offset)
                        .then(function (storeList) {
                            vm.fullStores = storeList;
                            var justStores = [];
                            angular.forEach(storeList.results, function (item) {
                                if(!item.fecha_salida)
                                    justStores.push(item.establecimiento_obj);
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
            vm.fullStores = null;
            vm.offset = 0;
        }

        function prepareDataFunction(Stores) {
            vm.fullStores = Stores;
            var list = Stores.results;
            vm.stores = Helper.filterDeleted(list, true);
        }

        function sigPage() {
            vm.stores = null;
            vm.offset += vm.limit;
            search();
        }

        function prevPage() {
            vm.stores = null;
            vm.offset -= vm.limit;
            search();
        }

    }

})();
