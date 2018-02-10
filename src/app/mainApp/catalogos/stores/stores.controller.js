(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .controller('storesController', storesController)
        .filter('lineaSearch', custom);

    /* @ngInject */
    function storesController(Stores, Helper, $scope, toastr, Translate, $mdDialog, States, Cities, Localities, $log,
                              STORE_SEGMENTATION, Geolocation) {

        var vm = this;

        vm.lookup = lookup;
        vm.querySearch = querySearch;
        vm.selectedLineas = selectedLineas;
        vm.selectedItemChange = selectedItemChange;
        vm.toggleDeletedFunction = toggleDeletedFunction;
        vm.cancel = cancel;
        vm.create = create;
        vm.restore = restore;
        vm.remove = remove;
        vm.update = update;
        vm.listCities = listCities;
        vm.listLocalities = listLocalities;
        vm.selectState = selectState;
        vm.selectLocality = selectLocality;
        vm.showStoreLocation = showStoreLocation;

        vm.search_items = [];
        vm.searchText = '';
        var store = null;
        vm.store = {};
        vm.numberBuffer = '';
        vm.myHeight = window.innerHeight - 250;
        vm.myStyle = {"min-height": "" + vm.myHeight + "px"};
        vm.toggleDeleted = true;

        vm.states = null;
        vm.cities = null;
        vm.localities = null;
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.state = null;
        vm.city = null;
        vm.locality = null;
        vm.zip_code = null;

        activate();
        init();

        function init() {
            vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
            vm.successCreateMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_CREATE');
            vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_MESSAGE');
            vm.successUpdateMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_UPDATE');
            vm.successDeleteMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_DELETE');
            vm.deleteButton = Translate.translate('MAIN.BUTTONS.DELETE');
            vm.cancelButton = Translate.translate('MAIN.BUTTONS.CANCEL');
            vm.dialogTitle = Translate.translate('MAIN.DIALOG.DELETE_TITLE');
            vm.dialogMessage = Translate.translate('MAIN.DIALOG.DELETE_MESSAGE');
            vm.duplicateMessage = Translate.translate('TRANSPORT_LINE.FORM.LABEL.DUPLICATE');
            vm.dialogRestoreTitle = Translate.translate('MAIN.DIALOG.RESTORE_TITLE');
            vm.dialogRestoreMessage = Translate.translate('MAIN.DIALOG.RESTORE_MESSAGE');
            vm.restoreButton = Translate.translate('MAIN.BUTTONS.RESTORE');
            vm.successRestoreMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_RESTORE');
        }


        function activate() {
            listlineas();
            listStates();
        }

        function toggleDeletedFunction() {
            listlineas();
            cancel();
        }

        function remove(ev) {
            var confirm = $mdDialog.confirm()
                .title(vm.dialogTitle)
                .textContent(vm.dialogMessage)
                .ariaLabel('Confirmar eliminación')
                .ok(vm.deleteButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function () {
                Stores.remove(vm.store.id).then(function (res) {
                    toastr.success(vm.successDeleteMessage, vm.successTitle);
                    cancel();
                    activate();
                }).catch(function (res) {
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                });
            }, function () {

            });
        }

        function update() {
            Stores.update(vm.store, vm.store.id).then(function (res) {
                toastr.success(vm.successUpdateMessage, vm.successTitle);
                cancel();
                activate();
            }).catch(function (err) {
                console.log(err);
                if (err.status == 400 && err.data.nombre_establecimiento != undefined) {
                    toastr.error(vm.duplicateMessage, vm.errorTitle);
                } else {
                    toastr.error(vm.errorMessage, vm.errorTitle);
                }
            });
        }

        function create() {
            vm.store.latitud = vm.store.latitud.toFixed(6);
            vm.store.longitud = vm.store.longitud.toFixed(6);
            Stores.create(vm.store).then(function (res) {
                toastr.success(vm.successCreateMessage, vm.successTitle);
                vm.store = angular.copy(store);
                cancel();
                activate();
            }).catch(function (err) {
                console.log(err);
                if (err.status == 400 && err.data.nombre_establecimiento != undefined) {
                    toastr.error(vm.duplicateMessage, vm.errorTitle);
                } else {
                    toastr.error(vm.errorMessage, vm.errorTitle);
                }
            });
        }

        function restore() {
            var confirm = $mdDialog.confirm()
                .title(vm.dialogRestoreTitle)
                .textContent(vm.dialogRestoreMessage)
                .ariaLabel('Confirmar restauración')
                .ok(vm.restoreButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function () {
                vm.store.deleted = false;
                Stores.update(vm.store).then(function (res) {
                    toastr.success(vm.successRestoreMessage, vm.successTitle);
                    cancel();
                    activate();
                }).catch(function (res) {
                    vm.store.deleted = true;
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                });
            }, function () {

            });

        }

        function cancel() {
            vm.store = angular.copy(store);
            vm.selectedLineaList = null;
            vm.numberBuffer = null;
            vm.searchText = null;

            vm.state = null;
            vm.city = null;
            vm.locality = null;
            vm.zip_code = null;

            $scope.StoreForm.$setPristine();
            $scope.StoreForm.$setUntouched();
        }

        function listlineas() {
            vm.loadingPromise = Stores.list().then(function (res) {
                vm.lineas = Helper.filterDeleted(res, vm.toggleDeleted);
                vm.lineas = _.sortBy(vm.lineas, 'nombre_establecimiento');
            }).catch(function (err) {

            });
        }

        function selectedItemChange(item) {
            if (item != null) {
                vm.store = angular.copy(item);

            } else {
                cancel();
            }
        }

        function selectedLineas(project) {
            vm.selectedLineaList = project;
            vm.store = angular.copy(project);
        }

        function querySearch(query) {
            var results = query ? lookup(query) : vm.lineas;
            return results;

        }

        function lookup(search_text) {
            vm.search_items = _.filter(vm.lineas, function (item) {
                return item.nombre_establecimiento.toLowerCase().indexOf(search_text.toLowerCase()) >= 0;
            });
            return vm.search_items;
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
                        vm.cities = citiesList;
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
                        vm.localities = localitiesList;
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
            if (vm.store) {
                vm.store.localidad_id = null;
            }
        }

        function selectLocality() {
            if (vm.locality) {
                vm.store['localidad_id'] = vm.locality.id;
                vm.zip_code = vm.locality.codigo_postal;
            }
        }

        function showStoreLocation() {
            Geolocation.locate(vm.store.latitud, vm.store.longitud);
        }

    }

//Outside the controller
    function custom() {
        return function (input, text) {
            if (!angular.isString(text) || text === '') {
                return input;
            }

            return _.filter(input, function (item) {
                return item.nombre_establecimiento.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            });

        };
    }

})();
