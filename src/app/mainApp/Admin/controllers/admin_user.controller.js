(function () {
    'use strict';

    angular
        .module('app.mainApp.admin')
        .controller('admin_userController', admin_userController)
        .filter('modeloSearch', modeloSearch)
        .filter('personaSearch', personaSearch);

    /* @ngInject */
    function admin_userController(ModeloCabinet, $scope, toastr, Translate, $mdDialog, MarcaCabinet,Persona_Admin) {

        var vm = this;
        vm.lookup = lookup;
        vm.querySearch = querySearch;
        vm.lookup2 = lookup2;
        vm.querySearch2 = querySearch2;
        vm.selectedPersonas=selectedPersonas;
        vm.selectedModelos = selectedModelos;
        vm.showRegister=showRegister;
        vm.cancel = cancel;
        vm.create = create;
        vm.remove=remove;
        vm.update=update;

        vm.picFoto="assets/images/modelo.svg";
        vm.search_items = [];
        vm.searchText = '';
        var modelo = {
            nombre: null,
            descripcion: null,
            palabra_clave: null,
            cantidad: null,
            tipo_compresor: null,
            tipo_refrigerante: null,
            tipo: null,
            marca: null
        };
        vm.modelo = angular.copy(modelo);
        var persona = {
            "user": {
                "username": "",
                "email": ""
            },
            "nombre": "",
            "apellido_paterno": "",
            "apellido_materno": "",
            "direccion": "",
            "telefono": ""
        };
        vm.persona = angular.copy(persona);
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
            Persona_Admin.list().then(function (rest){
                console.log(vm.requisito);
                vm.personas_admin = rest;
                console.log(vm.personas_admin);
            }).catch(function(error){
                console.log(error);
            })
            vm.modelos = ModeloCabinet.list();
            vm.marcas = MarcaCabinet.list();
        }

        /*vm.isDisabled = false;
         vm.selectedModelos = selectedModelos;
         vm.registrar = registrar;
         vm.eliminar=eliminar;
         vm.editar = editar;
         vm.selectedItem = null;
         vm.searchText = null;

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
         }*/
        function showRegister($event) {
            clearForm();
        }
        function remove(ev) {
                var confirm = $mdDialog.confirm()
                    .title('Confirmación para eliminar')
                    .textContent('¿Esta seguro de eliminar este elemento?')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Aceptar')
                    .cancel('Cancelar');
                $mdDialog.show(confirm).then(function() {
                    Persona_Admin.deleteData(vm.persona).then(function(rest){
                        console.log(rest);
                        toastr.success(vm.successDeleteMessage, vm.successTitle);
                        cancel();
                        activate();
                    }).catch(function (res) {
                        console.log(res);
                        toastr.warning(vm.errorMessage, vm.errorTitle);
                    });
                }, function() {

                });

        }
        function update() {
            Persona_Admin.modify(vm.persona).then(function (res) {
                toastr.success(vm.successUpdateMessage, vm.successTitle);
                cancel();
                activate();
                console.log(res);
            }).catch(function (err) {
                toastr.warning(vm.errorMessage, vm.errorTitle);
                console.log(err);
            });
        }
        function create() {
            ModeloCabinet.create(vm.modelo).then(function (res) {
                toastr.success(vm.successCreateMessage, vm.successTitle);
                vm.modelo = angular.copy(modelo);
                cancel();
                activate();
            }).catch(function (res) {
                toastr.warning(vm.errorMessage, vm.errorTitle);
            });
        }

        function cancel() {
            $scope.objectForm.$setPristine();
            $scope.objectForm.$setUntouched();
            vm.perosna = angular.copy(persona);
            vm.selectedModeloList = null;
        }

        function selectedModelos(project) {
            vm.selectedModeloList = project;
            vm.modelo = angular.copy(project);
        }

        function querySearch(query) {
            console.log(query);
            var results = query ? lookup(query) : vm.modelos;
            return results;

        }

        function lookup(search_text) {
            vm.search_items = _.filter(vm.modelos, function (item) {
                return item.nombre.toLowerCase().indexOf(search_text.toLowerCase()) >= 0;
            });
            return vm.search_items;
        }

        //***********************

        function querySearch2(query) {
            console.log(query);
            var results = query ? lookup2(query) : vm.personas_admin;
            return results;

        }

        function lookup2(search_text) {
            vm.search_items = _.filter(vm.personas_admin, function (item) {
                return item.nombre.toLowerCase().indexOf(search_text.toLowerCase()) >= 0;
            });
            return vm.search_items;
        }

        function selectedPersonas(project) {
            vm.selectedPersonaList = project;
            vm.persona = angular.copy(project);
        }

        function buscarUsuario(){
            Persona_Admin.list().then(function (rest){
                console.log(vm.requisito);
                vm.personas_admin = rest;
                console.log(vm.personas_admin);
            }).catch(function(error){
                console.log(error);
            })
        }

    }

    function modeloSearch() {
        return function (input, text) {
            if (!angular.isString(text) || text === '') {
                return input;
            }

            return _.filter(input, function (item) {
                return item.nombre.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            });

        };

    }
    function personaSearch() {
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
