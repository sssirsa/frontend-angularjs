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
                                   store,
                                   Localities,
                                   Segmentation,
                                   ErrorHandler,
                                   Geolocation) {
        var vm = this;

        //Variables
        //vm.storeSegmentation = STORE_SEGMENTATION;
        activate();

        vm.states = null;
        vm.cities = null;
        vm.localities = null;
        vm.state = null;
        vm.city = null;
        vm.locality = null;
        vm.postal_code = null;

        //Control variables
        vm.changedLocation = null;

        //Functions
        vm.accept = accept;
        vm.cancel = cancel;
        vm.listStates = listStates;
        vm.listCities = listCities;
        vm.listLocalities = listLocalities;
        vm.selectState = selectState;
        vm.selectCity = selectCity;
        vm.selectSegmentation = selectSegmentation;
        vm.changeLocation = changeLocation;

        activate();

        function activate() {
            vm.store = store;
            vm.store.latitud = parseFloat(vm.store.latitud);
            vm.store.longitud = parseFloat(vm.store.longitud);
            listStates();
            selectSegmentation();
        }


        function accept() {
            if (vm.changedLocation || !vm.store.mapa) {
                vm.loadingPromise = Geolocation.getMap(vm.store.latitud, vm.store.longitud)
                    .then(function (mapThumbnail) {
                        vm.store.mapa = 'data:image/png;base64,' + _arrayBufferToBase64(mapThumbnail.data);
                        modifyStore();
                    })
                    .catch(function (errorMapThumbnail) {
                        $log.error(errorMapThumbnail);
                        toastr.warning(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.WARNING_IMAGE'));
                        modifyStore();
                    });
            }
            else {
                modifyStore();
            }
        }

        function modifyStore() {
            vm.store.segmentacion_id = vm.segmentationSelect;

            var storeToSend = {
                no_cliente: vm.store.no_cliente,
                localidad_id: vm.store.localidad.id,
                nombre_establecimiento: vm.store.nombre_establecimiento,
                calle: vm.store.calle,
                numero: vm.store.numero,
                entre_calle1: vm.store.entre_calle1,
                entre_calle2: vm.store.entre_calle2,
                latitud: vm.store.latitud,
                longitud: vm.store.longitud,
                nombre_encargado: vm.store.nombre_encargado,
                telefono_encargado: vm.store.telefono_encargado,
                segmentacion_id: vm.store.segmentacion_id
            };

            vm.loadingPromise = Stores.update(storeToSend, vm.store.no_cliente)
                .then(function (createdStore) {
                    toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.UPDATE_SUCCESS'));
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
                        vm.state = vm.store.localidad.municipio.estado.id;
                        listCities(vm.state);
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
                        vm.city = vm.store.localidad.municipio.id;

                        angular.forEach(vm.states, function (stado) {
                            if (stado.id == state) {
                                vm.estado_nombre = stado.nombre;
                            }
                        });
                        listLocalities(vm.city);
                    })
                    .catch(function (citiesListError) {
                        ErrorHandler.errortranslate(citiesListError);
                        vm.cities = null;
                    });
            }
        }

        function listLocalities(city) {
            if (city) {
                vm.loadingLocalities = Localities.getByCity(city)
                    .then(function (localitiesList) {
                        vm.localities = _.sortBy(Helper.filterDeleted(localitiesList, true), 'nombre');
                        vm.locality = vm.store.localidad.id;
                        vm.codigo_postal = vm.store.localidad.codigo_postal;

                        angular.forEach(vm.cities, function (ciudad) {
                            if (ciudad.id == city) {
                                vm.municipio_nombre = ciudad.nombre;
                            }
                        });

                    })
                    .catch(function (localitiesListError) {
                        ErrorHandler.errortranslate(localitiesListError);
                        vm.localities = null;
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
            //vm.locality = null;
            //vm.localities = null;
        }

        function selectSegmentation() {
            Segmentation.list()
                .then(function (listSegments) {
                    vm.storeSegmentation = listSegments;
                    vm.segmentationSelect = vm.store.segmentacion.id;
                })
                .catch(function (errorListSegments) {
                    ErrorHandler.errortranslate(errorListSegments);
                });
        }

        function changeLocation() {
            vm.changedLocation = true;
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
