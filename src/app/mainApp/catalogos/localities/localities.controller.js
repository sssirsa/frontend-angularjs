(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .controller('localitiesController', localitiesController)
        .filter('lineaSearch', custom);

    /* @ngInject */
    function localitiesController(Localities, Cities, States, Helper, $scope, toastr, Translate, $mdDialog, $log) {

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
        vm.selectState = selectState;
        vm.selectCity = selectCity;

        vm.search_items = [];
        vm.searchText = '';
        vm.lineas = null;
        var locality = null;
        vm.locality = angular.copy(locality);
        vm.numberBuffer = '';
        vm.myHeight = window.innerHeight - 250;
        vm.myStyle = {"min-height": "" + vm.myHeight + "px"};
        vm.toggleDeleted = true;
        vm.localityRoute = null;
        vm.states = null;
        vm.cities = null;
        vm.state = null;

        activate();
        init();

        function init() {
            vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
            vm.successCreateMessage = Translate.translate('MAIN.MSG.SUCESSS_TRANSPORTE_MESSAGE');
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
                Localities.remove(vm.locality.id).then(function (res) {
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
            vm.locality['ruta_id'] = vm.localityRoute;
            Localities.update(vm.locality).then(function (res) {
                toastr.success(vm.successUpdateMessage, vm.successTitle);
                cancel();
                activate();
            }).catch(function (err) {
                if (err.status == 400 && err.data.razon_social != undefined) {
                    toastr.error(vm.duplicateMessage, vm.errorTitle);
                } else {
                    toastr.error(vm.errorMessage, vm.errorTitle);
                }
                console.log(err);
            });
        }

        function create() {
            vm.locality['ruta_id'] = vm.localityRoute;
            Localities.create(vm.locality).then(function (res) {
                toastr.success(vm.successCreateMessage, vm.successTitle);
                vm.locality = angular.copy(locality);
                cancel();
                activate();
            }).catch(function (err) {
                if (err.status == 400 && err.data.razon_social != undefined) {
                    toastr.error(vm.duplicateMessage, vm.errorTitle);
                } else {
                    toastr.error(vm.errorMessage, vm.errorTitle);
                }
                console.log(err);
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
                vm.locality.deleted = false;
                vm.locality.ruta_id = vm.localityRoute;
                Localities.update(vm.locality).then(function (res) {
                    toastr.success(vm.successRestoreMessage, vm.successTitle);
                    cancel();
                    activate();
                }).catch(function (res) {
                    vm.locality.deleted = true;
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                    console.log(err);
                });
            }, function () {

            });

        }

        function cancel() {
            $scope.LocalityForm.$setPristine();
            $scope.LocalityForm.$setUntouched();
            vm.locality = angular.copy(locality);
            vm.localityRoute = null;
            vm.selectedLineaList = null;
            vm.numberBuffer = null;
            vm.searchText = null;
            vm.state = null;
        }

        function listlineas() {
            vm.loadingPromise = Localities.list().then(function (res) {
                vm.lineas = Helper.filterDeleted(res, vm.toggleDeleted);
                vm.lineas = _.sortBy(vm.lineas, 'razon_social');
            }).catch(function (err) {

            });
        }

        function selectedItemChange(item) {
            if (item != null) {
                listCities(item.municipio.estado.id);
                vm.locality = angular.copy(item);
                vm.state = item.municipio.estado.id;
                vm.locality.municipio_id = vm.locality.municipio.id;
            } else {
                cancel();
            }
        }

        function selectedLineas(project) {
            listCities(project.municipio.estado.id);
            vm.selectedLineaList = project;
            vm.locality = angular.copy(project);
            vm.state = project.municipio.estado.id;
            vm.locality.municipio_id = vm.locality.municipio.id;
        }

        function querySearch(query) {
            var results = query ? lookup(query) : vm.lineas;
            return results;
        }


        function lookup(search_text) {
            vm.search_items = _.filter(vm.lineas, function (item) {
                return item.nombre.toLowerCase().indexOf(search_text.toLowerCase()) >= 0;
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
                        vm.cities = Helper.filterDeleted(citiesList,true);
                    })
                    .catch(function (citiesListError) {
                        $log.error(citiesListError);
                    });
            }
        }

        function selectState() {
            vm.locality.municipio_id = null;
        }

        function selectCity(city) {
            vm.state = city.estado.id;
        }

    }

//Outside the controller
    function custom() {
        return function (input, text) {
            if (!angular.isString(text) || text === '') {
                return input;
            }

            return _.filter(input, function (item) {
                return item.nombre.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            });

        };
    }

})();
