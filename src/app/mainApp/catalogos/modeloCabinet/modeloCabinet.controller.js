(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .controller('ModeloCabinetController', ModeloCabinetController)
        .filter('modeloSearch', modeloSearch);

    /* @ngInject */
    function ModeloCabinetController(ModeloCabinet, $scope, toastr, Translate,$mdDialog,MarcaCabinet) {

        var vm = this;
        vm.isDisabled = false;
        vm.selectedModelos = selectedModelos;
        vm.registrar = registrar;
        vm.eliminar=eliminar;
        vm.editar = editar;
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = querySearch;
        vm.showRegister = showRegister;
        vm.clearForm = clearForm;
        vm.selectedModelo = null;
        vm.tooltipVisible = false;
        vm.hideProject = false;
        vm.editable=true;
        vm.hover = false;
        var modelo = {
            nombre: null,
            descripcion: null,
            palabra_clave: null,
            cantidad: null,
            tipo_compresor: null,
            tipo_refrigerante:null,
            tipo:null,
            marca: null
        };
        vm.operation = 0;//0- View, 1-Register, 2-Update
        vm.modelo = angular.copy(modelo);
        vm.numberBuffer = '';
        activate();
        init();
        function init() {
            vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
            vm.successCreateMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_CREATE');
            vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_MESSAGE');
            vm.successUpdateMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_UPDATE');
            vm.successDeleteMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_DELETE');
        }

        function activate() {
            vm.modelos=ModeloCabinet.list();
            vm.marcas=MarcaCabinet.list();
        }

        function editar(){
            vm.operation=2;
            vm.editable=!vm.editable;
        }

        function showRegister($event) {
            vm.operation = 1;
            vm.selectedModelo=null;
            vm.editable=!vm.editable;
            clearForm();
        }
        function eliminar(ev) {
            var confirm = $mdDialog.confirm()
                .title('Confirmación para eliminar')
                .textContent('¿Esta seguro de eliminar este elemento?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Aceptar')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function() {
                ModeloCabinet.remove(vm.modelo).then(function (res) {
                    toastr.success(vm.successDeleteMessage, vm.successTitle);
                    vm.modelo = angular.copy(modelo);
                    vm.selectedModelo=null;
                    clearForm();
                    activate();
                }).catch(function (res) {
                    console.log(res);
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                });
            }, function() {

            });
        }
        function clearForm() {
            $scope.ModelCabinetForm.$setPristine();
            $scope.ModelCabinetForm.$setUntouched();
            vm.modelo = angular.copy(modelo);

            vm.selectedModelo=null;
        }

        function selectedModelos(project) {
            vm.selectedModelo = project;
            vm.operation = 0;
            vm.modelo = angular.copy(project);
            vm.editable=true;
        }


        function querySearch(query) {
            var results = query ? vm.modelos.filter(createFilterFor(query)) : vm.modelos, deferred;
            return results;

        }

        function createFilterFor(query) {

            return function filterFn(linea) {
                return (linea.nombre.indexOf(query) === 0);
            };
        }

        function registrar() {
            if(vm.operation ==1) {
                ModeloCabinet.create(vm.modelo).then(function (res) {
                    toastr.success(vm.successCreateMessage, vm.successTitle);
                    vm.modelo = angular.copy(modelo);
                    clearForm();
                    vm.numberBuffer=null;
                    activate();
                }).catch(function (res) {
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                });
            }else{
                ModeloCabinet.update(vm.modelo).then(function (res) {
                    toastr.success(vm.successUpdateMessage, vm.successTitle);
                    vm.operation=0;
                    vm.editable=true;
                    vm.selectedModelo=null;
                    activate();
                }).catch(function (res) {
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                });
            }
        }

    }

    function modeloSearch() {
        return function (input, text) {
            if (!angular.isString(text) || text === '') {
                return input;
            }

            return input.filter(function (item) {
                return (item.nombre.indexOf(text) > -1);
            });
        };

    }
})();