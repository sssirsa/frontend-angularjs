(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .controller('citiesController', citiesController)
        .filter('lineaSearch', custom);

    /* @ngInject */
    function citiesController(Cities, States, Helper, $scope, toastr, Translate, $mdDialog, $log) {

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

        vm.search_items = [];
        vm.searchText = '';
        var store = null;
        vm.city = angular.copy(store);
        vm.numberBuffer = '';
        vm.myHeight = window.innerHeight - 250;
        vm.myStyle = {"min-height": "" + vm.myHeight + "px"};
        vm.toggleDeleted = true;
        vm.states = null;

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
                Cities.remove(vm.city.id).then(function (res) {
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
            vm.city.estado_id = vm.city.estado.id;
            delete vm.city.estado;
            Cities.update(vm.city, vm.city.id).then(function (res) {
                toastr.success(vm.successUpdateMessage, vm.successTitle);
                cancel();
                activate();
            }).catch(function (err) {
                console.log(err);
                if (err.status == 400 && err.data.nombre != undefined) {
                    toastr.error(vm.duplicateMessage, vm.errorTitle);
                } else {
                    toastr.error(vm.errorMessage, vm.errorTitle);
                }
            });
        }

        function create() {
            vm.city.estado_id = vm.city.estado.id;
            delete vm.city.estado;
            Cities.create(vm.city).then(function (res) {
                toastr.success(vm.successCreateMessage, vm.successTitle);
                vm.city = angular.copy(store);
                cancel();
                activate();
            }).catch(function (err) {
                console.log(err);
                if (err.status == 400 && err.data.codigo_estado != undefined) {
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
                vm.city.deleted = false;
                Cities.update(vm.city).then(function (res) {
                    toastr.success(vm.successRestoreMessage, vm.successTitle);
                    cancel();
                    activate();
                }).catch(function (res) {
                    vm.city.deleted = true;
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                });
            }, function () {

            });

        }

        function cancel() {
            vm.city = angular.copy(store);
            vm.selectedLineaList = null;
            vm.numberBuffer = null;
            vm.searchText = null;


            $scope.CityForm.$setPristine();
            $scope.CityForm.$setUntouched();
        }

        function listlineas() {
            vm.loadingPromise = Cities.list()
                .then(function (res) {
                    vm.lineas = Helper.filterDeleted(res, vm.toggleDeleted);
                    vm.lineas = _.sortBy(vm.lineas, 'nombre');
                    listStates();
                })
                .catch(function (err) {

                });
        }

        function selectedItemChange(item) {
            if (item != null) {
                vm.city = angular.copy(item);

            } else {
                cancel();
            }
        }

        function selectedLineas(project) {
            vm.selectedLineaList = project;
            vm.city = angular.copy(project);
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
            if(!vm.states) {
                States.list()
                    .then(function (stateList) {
                        vm.states = _.sortBy(Helper.filterDeleted(stateList, true),'nombre');
                    })
                    .catch(function (stateListError) {
                        $log.error(stateListError);
                        vm.states=null;
                        toastr.error(Translate.translate('CITIES.TOASTR.ERROR_STATE_LIST'));
                    });
            }
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
