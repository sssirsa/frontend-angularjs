(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('segmentationController', segmentationController)
        .filter('lineaSegmentationSearch', custom);

    /* @ngInject */
    function segmentationController(Segmentation, Helper, $scope, toastr, Translate, $mdDialog) {

        var vm = this;

        vm.cancel = cancel;
        vm.create = create;
        vm.restore = restore;
        vm.remove = remove;
        vm.update = update;

        vm.lookup = lookup;
        vm.querySearch = querySearch;
        vm.selectedLineas = selectedLineas;
        vm.selectedItemChange = selectedItemChange;
        vm.toggleDeletedFunction = toggleDeletedFunction;

        var segmentationLocal = null;

        vm.search_items = [];
        vm.searchText = '';
        vm.segmentation = angular.copy(segmentationLocal);
        vm.delete_or_edit = false;
        vm.numberBuffer = '';
        vm.myHeight = window.innerHeight - 250;
        vm.myStyle = {"min-height": "" + vm.myHeight + "px"};
        vm.toggleDeleted = true;
        vm.minicolorSettings = {
            control: 'hue',
            format: 'hex',
            letterCase: 'uppercase',
            position: 'bottom left'
        };



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

        function listlineas() {
            vm.loadingPromise = Segmentation.list().then(function (res) {
                vm.lineas = Helper.filterDeleted(res, vm.toggleDeleted);
                vm.lineas = _.sortBy(vm.lineas, 'nombre');
            }).catch(function (err) {

            });
        }

        function remove(ev) {
            var confirm = $mdDialog.confirm()
                .title(vm.dialogTitle)
                .textContent(vm.dialogMessage)
                .ariaLabel('Confirmar eliminación')
                .ok(vm.deleteButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function () {
                vm.formLoading = Segmentation.remove(vm.segmentation.id).then(function (res) {
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
            vm.formLoading = Segmentation.update(vm.segmentation, vm.segmentation.id).then(function (res) {
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
            vm.formLoading = Segmentation.create(vm.segmentation).then(function (res) {
                toastr.success(vm.successCreateMessage, vm.successTitle);
                vm.segmentation = angular.copy(segmentationLocal);
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
                vm.segmentation.deleted = false;
                vm.formLoading = Segmentation.update(vm.segmentation).then(function (res) {
                    toastr.success(vm.successRestoreMessage, vm.successTitle);
                    cancel();
                    activate();
                }).catch(function (res) {
                    vm.segmentation.deleted = true;
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                });
            }, function () {

            });
        }

        function cancel() {
            vm.segmentation = angular.copy(segmentationLocal);
            vm.delete_or_edit = false;
            vm.selectedLineaList = null;
            vm.numberBuffer = null;
            vm.searchText = null;


            $scope.SegmentationForm.$setPristine();
            $scope.SegmentationForm.$setUntouched();
        }



        function selectedItemChange(item) {
            if (item != null) {
                vm.segmentation = angular.copy(item);
                vm.delete_or_edit = vm.segmentation.deleted;
            } else {
                cancel();
            }
        }

        function selectedLineas(project) {
            vm.selectedLineaList = project;
            vm.segmentation = angular.copy(project);
            vm.delete_or_edit = vm.segmentation.deleted;
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
