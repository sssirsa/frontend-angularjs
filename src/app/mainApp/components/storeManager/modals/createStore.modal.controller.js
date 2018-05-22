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
                                   States,
                                   Cities,
                                   Localities,
                                   Segmentation,
                                   ErrorHandler,
                                   Geolocation) {
        var vm = this;

        //Variables
        //vm.storeSegmentation = STORE_SEGMENTATION;
        vm.storeSegmentation = null;
        vm.segmentationSelect = null;
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

        vm.estado_nombre = null;
        vm.municipio_nombre = null;

        //Functions
        vm.accept = accept;
        vm.cancel = cancel;
        vm.listStates = listStates;
        vm.listCities = listCities;
        vm.listLocalities = listLocalities;
        vm.selectState = selectState;
        vm.selectCity = selectCity;
        vm.selectSegmentation = selectSegmentation;

        activate();

        function activate() {
            listStates();
            selectSegmentation();
        }


        function accept() {
            vm.store.localidad_id = vm.locality.id;
            vm.store.segmentacion_id = vm.segmentationSelect;

            vm.loadingPromise = Geolocation.getMap(vm.store.latitud, vm.store.longitud)
                .then( function (mapThumbnail){
                    vm.store.mapa = 'data:image/png;base64,'+_arrayBufferToBase64(mapThumbnail.data);
                    createStore();
                })
                .catch(function(errorMapThumbnail){
                    console.error(errorMapThumbnail);
                    toastr.warning(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.WARNING_IMAGE'));
                    createStore();
                });


        }

        function createStore(){
            vm.loadingPromise = Stores.create(vm.store)
                .then(function (createdStore) {
                    toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.CREATE_SUCCESS'));
                    $mdDialog.hide(createdStore);
                })
                .catch(function (errorCreateStore) {
                    ErrorHandler.errortranslate(errorCreateStore);
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
                        ErrorHandler.errortranslate(stateListError);
                        vm.states = null;
                    });
            }
        }

        function listCities(state) {
            if (state) {
                vm.loadingCities = Cities.getByState(state)
                    .then(function (citiesList) {
                        vm.cities = _.sortBy(Helper.filterDeleted(citiesList, true), 'nombre');

                        angular.forEach(vm.states, function (estado) {
                            if (estado.id == state) {
                                vm.estado_nombre = estado.nombre;
                            }
                        });
                    })
                    .catch(function (citiesListError) {
                        vm.cities = null;
                        ErrorHandler.errortranslate(citiesListError);
                    });
            }
        }

        function listLocalities(city) {
            if (city) {
                vm.loadingLocalities = Localities.getByCity(city)
                    .then(function (localitiesList) {
                        vm.localities = _.sortBy(Helper.filterDeleted(localitiesList, true), 'nombre');

                        angular.forEach(vm.cities, function (ciudad) {
                            if (ciudad.id == city) {
                                vm.municipio_nombre = ciudad.nombre;
                            }
                        });
                    })
                    .catch(function (localitiesListError) {
                        vm.localities = null;
                        ErrorHandler.errortranslate(localitiesListError);
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

        function selectSegmentation() {
            Segmentation.list()
                .then(function (listSegments) {
                    vm.storeSegmentation = listSegments;
                })
                .catch(function (errorListSegments) {
                    ErrorHandler.errortranslate(errorListSegments);
                });
        }

        function _arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }

    }

})();
