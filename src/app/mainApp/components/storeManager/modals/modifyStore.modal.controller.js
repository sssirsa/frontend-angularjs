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
                                   Localities,
                                   Segmentation) {
        var vm = this;

        //Variables
        //vm.storeSegmentation = STORE_SEGMENTATION;
        activate();

        vm.store = store;
        vm.store.latitud= parseFloat(vm.store.latitud);
        vm.store.longitud= parseFloat(vm.store.longitud);
        vm.store.no_cliente = vm.store.no_cliente;
        vm.states = null;
        vm.cities = null;
        vm.localities = null;
        vm.state = null;
        vm.city = null;
        vm.locality = null;
        vm.postal_code = null;

        vm.estado_nombre = vm.store.localidad.municipio.estado.nombre;
        vm.municipio_nombre = vm.store.localidad.municipio.nombre;

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
            vm.store.segmentacion_id = vm.segmentationSelect;

            var data = {
                no_cliente: vm.store.no_cliente,
                localidad_id: vm.store.localidad_id,
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

            vm.loadingPromise = Stores.update(data, vm.store.no_cliente)
                .then(function(createdStore){
                    toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.UPDATE_SUCCESS'));
                    $mdDialog.hide(createdStore);

                    data = null;
                    vm.store = null;
                    vm.cities = null;
                    vm.localities = null;
                    vm.state = null;
                    vm.city = null;
                    vm.locality = null;
                    vm.postal_code = null;
                    vm.estado_nombre = null;
                    vm.municipio_nombre = null;
                })
                .catch(function(errorCreateStore){
                    toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.UPDATE_ERROR'));
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
                        vm.city = vm.store.localidad.municipio.id;

                        angular.forEach(vm.states, function (stado) {
                            if(stado.id == state){
                                vm.estado_nombre = stado.nombre;
                            }
                        });
                        listLocalities(vm.city);
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
                        vm.locality = vm.store.localidad.id;
                        vm.codigo_postal = vm.store.localidad.codigo_postal;

                        angular.forEach(vm.cities, function (ciudad) {
                            if(ciudad.id == city){
                                vm.municipio_nombre = ciudad.nombre;
                            }
                        });

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
            //vm.locality = null;
            //vm.localities = null;
        }

        function selectSegmentation() {
            Segmentation.list()
                .then(function (res) {
                    vm.storeSegmentation = res;
                    vm.segmentationSelect = vm.store.segmentacion.id;
                })
                .catch(function (err) {
                    console.error(err);
                });
        }

    }

})();
