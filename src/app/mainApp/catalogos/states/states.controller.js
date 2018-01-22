(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .controller('statesController', statesController)
        .filter('lineaSearch', custom);

    /* @ngInject */
    function statesController(States, Helper, $scope, toastr, Translate, $mdDialog) {

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
        vm.state = angular.copy(store);
        vm.numberBuffer = '';
        vm.myHeight = window.innerHeight - 250;
        vm.myStyle = {"min-height": "" + vm.myHeight + "px"};
        vm.toggleDeleted = true;

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
                States.remove(vm.state.id).then(function (res) {
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
            States.update(vm.state, vm.state.id).then(function (res) {
                toastr.success(vm.successUpdateMessage, vm.successTitle);
                cancel();
                activate();
            }).catch(function (err) {
                console.log(err);
                if (err.status == 400 && err.data.razon_social != undefined) {
                    toastr.error(vm.duplicateMessage, vm.errorTitle);
                } else {
                    toastr.error(vm.errorMessage, vm.errorTitle);
                }
            });
        }

        function create() {
            States.create(vm.state).then(function (res) {
                toastr.success(vm.successCreateMessage, vm.successTitle);
                vm.state = angular.copy(store);
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
                vm.state.deleted = false;
                States.update(vm.state).then(function (res) {
                    toastr.success(vm.successRestoreMessage, vm.successTitle);
                    cancel();
                    activate();
                }).catch(function (res) {
                    vm.state.deleted = true;
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                });
            }, function () {

            });

        }

        function cancel() {
            vm.state = angular.copy(store);
            vm.selectedLineaList = null;
            vm.numberBuffer = null;
            vm.searchText = null;


            $scope.StateForm.$setPristine();
            $scope.StateForm.$setUntouched();
        }

        function listlineas() {
            vm.loadingPromise = States.list().then(function (res) {
                vm.lineas = Helper.filterDeleted(res, vm.toggleDeleted);
                vm.lineas = _.sortBy(vm.lineas, 'razon_social');
            }).catch(function (err) {

            });
        }

        function selectedItemChange(item) {
            if (item != null) {
                vm.state = angular.copy(item);

            } else {
                cancel();
            }
        }

        function selectedLineas(project) {
            vm.selectedLineaList = project;
            vm.state = angular.copy(project);
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

    }

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
