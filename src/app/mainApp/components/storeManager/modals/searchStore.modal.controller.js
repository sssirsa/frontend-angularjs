(function () {
    'use_strict';
    angular
        .module('storeManager')
        .controller('searchStoreController', searchStoreController);

    /* @ngInject */
    function searchStoreController(
        Stores,
        toastr,
        Translate,
        $mdDialog,
        Helper,
        $log,
        ErrorHandler,
        EnvironmentConfig,
        QUERIES,
        URLS
    ) {
        var vm = this;

        //Variables
        vm.translateRoot = 'MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH';
        vm.client_id = null;
        vm.state = null;
        vm.city = null;
        vm.locality = null;
        vm.postal_code = null;
        vm.economic = null;
        vm.selectedTab = 0;

        //Translates
        vm.noResultsMessage = Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS');
        vm.nextButtonText = Translate.translate('MAIN.BUTTONS.NEXT');
        vm.previousButtonText = Translate.translate('MAIN.BUTTONS.PREVIOUS');
        vm.loadMoreButtonText = Translate.translate('MAIN.BUTTONS.LOAD_MORE');

        //Functions
        vm.accept = accept;
        vm.cancel = cancel;
        vm.selectState = selectState;
        vm.selectCity = selectCity;
        vm.selectLocality = selectLocality;
        vm.search = search;
        vm.changeTab = changeTab;

        vm.catalogManager = Stores.manager;

        vm.catalogues = Stores.catalogues;

        activate();

        function activate() {
            //Initial handling
        }


        function accept(store) {
            $mdDialog.hide(store);
        }

        function cancel() {
            $mdDialog.cancel(null);
        }

        function selectState(state) {
            vm.catalogManager.url = null;
            vm.catalogManager.query = null;
            vm.catalogManager.queryValue = null;
            vm.state = state;
            vm.city = null;
            vm.locality = null;
            vm.cities = null;
            vm.localities = null;
            vm.catalogues['cities'].catalog.query = QUERIES.city.by_state;
            vm.catalogues['cities'].catalog.query_value = vm.state;
        }

        function selectCity(city) {
            vm.catalogManager.url = null;
            vm.catalogManager.query = null;
            vm.catalogManager.queryValue = null;
            vm.city = city;
            vm.locality = null;
            vm.localities = null;
            vm.catalogues['localities'].catalog.query = QUERIES.locality.by_city;
            vm.catalogues['localities'].catalog.query_value = vm.city;
        }

        function selectLocality(locality) {
            vm.catalogManager.url = null;
            vm.catalogManager.query = null;
            vm.catalogManager.queryValue = null;
            vm.locality = locality;
        }

        function search() {
            //vm.stores = null;
            //vm.refreshPaginationButtonsComponent = false;
            var storeUrl = EnvironmentConfig.site.rest.api
                + '/' + URLS.salepoint.base
                + '/' + URLS.salepoint.catalogues.base
                + '/' + URLS.salepoint.catalogues.stores;
            switch (vm.selectedTab) {
                case 0:
                    vm.loadingPromise = Stores.getByID(vm.client_id)
                        .then(function (store) {
                            vm.accept(store);
                        })
                        .catch(function (storeError) {
                            $log.error(storeError);
                            if (storeError.status == 404) {
                                toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                            }
                            else {
                                ErrorHandler.errorTranslate(storeError);
                            }
                        });
                    break;
                case 1:
                    if (vm.state) {
                        if (vm.city) {
                            if (vm.locality) {
                                //Look up by locality
                                vm.catalogManager.url = storeUrl;
                                vm.catalogManager.query = QUERIES.store.by_locality;
                                vm.catalogManager.queryValue = vm.locality;
                            }
                            else {
                                //Look up by city
                                vm.catalogManager.url = storeUrl;
                                vm.catalogManager.query = QUERIES.store.by_city;
                                vm.catalogManager.queryValue = vm.city;
                            }
                        }
                        else {
                            //Look up by state
                            vm.catalogManager.url = storeUrl;
                            vm.catalogManager.query = QUERIES.store.by_state;
                            vm.catalogManager.queryValue = vm.state;
                        }
                    }
                    break;
                case 2:
                    vm.catalogManager.url = storeUrl;
                    vm.catalogManager.query = QUERIES.store.by_postal_code;
                    vm.catalogManager.queryValue = vm.postal_code;
                    break;
                case 3:
                    //vm.loadingPromise = Stores.getByEconomic(vm.economic, vm.limit, vm.offset)
                    //    .then(function (storeList) {
                    //        vm.fullStores = storeList;
                    //        var justStores = [];
                    //        angular.forEach(storeList.results, function (item) {
                    //            if (!item.fecha_salida)
                    //                justStores.push(item.establecimiento_obj);
                    //        });
                    //        vm.stores = Helper.filterDeleted(justStores, true);
                    //        vm.refreshPaginationButtonsComponent = true;
                    //    })
                    //    .catch(function (storeListError) {
                    //        $log.error(storeListError);
                    //        toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.ERRORS.NO_RESULTS'));
                    //    });
                    break;
            }
        }

        function changeTab() {
            vm.state = null;
            vm.city = null;
            vm.locality = null;
            vm.client_id = null;
            vm.postal_code = null;
            vm.economic = null;
            vm.catalogManager.url = null;
            vm.catalogManager.query = null;
            vm.catalogManager.queryValue = null;
            //vm.fullStores = null;
        }
    }

})();
