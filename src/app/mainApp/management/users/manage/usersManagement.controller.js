(function () {
    'use strict';

    angular
        .module('app.mainApp.management.users')
        .controller('usersManagementController', UsersManagementController)
        .filter('personaSearch', personaSearch);

    function UsersManagementController(
        $scope,
        toastr,
        Translate,
        $mdDialog,
        $document,
        Persona_Admin,
        //Administration,
        Persona,
        _
    ) {

        var vm = this;
        vm.lookup = lookup;
        vm.querySearch = querySearch;
        vm.selectedItemChange = selectedItemChange;
        vm.selectedPersonas = selectedPersonas;
        vm.cancel = cancel;
        vm.clean = clean;
        vm.remove = remove;
        vm.update = update;
        vm.getPersonaAdmin = getPersonaAdmin;
        //vm.addGroup = addGroup;
        //vm.removeGroup = removeGroup;
        //vm.loadGrupo = loadGroup;
        vm.selectedIndex = 0;
        vm.picFoto = "assets/images/modelo.svg";
        vm.search_items = [];
        vm.searchText = '';
        vm.user_ini = null;
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

        vm.personaUpdate = {
            "user": {
                "email": ""
            },
            "nombre": "",
            "apellido_paterno": "",
            "apellido_materno": "",
            "direccion": "",
            "telefono": ""
        };
        var group_persona = {
            "grupo_id": null,
            "persona": null
        };
        vm.persona = angular.copy(persona);
        vm.group_persona = angular.copy(group_persona);
        vm.diabled = true;
        activate();
        init();

        function init() {
            vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
            vm.successCreateMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_CREATE');
            vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_MESSAGE');
            vm.successUpdateMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_UPDATE');
            vm.successAddedGroupMessage = Translate.translate('ADMIN_PERSONA.MESSAGE.SUCCESS_GROUP_ADD');
            vm.successDeleteMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_DELETE');
            vm.deleteButton = Translate.translate('MAIN.BUTTONS.DELETE');
            vm.cancelButton = Translate.translate('MAIN.BUTTONS.CANCEL');
            vm.dialogTitle = Translate.translate('MAIN.DIALOG.DELETE_TITLE');
            vm.dialogMessage = Translate.translate('MAIN.DIALOG.DELETE_MESSAGE');
            vm.dialogDeleteGroupMessage = Translate.translate('ADMIN_PERSONA.MESSAGE.DELETE_GROUP');
        }

        function activate() {
            getPersonaAdmin();
        }

        function getPersonaAdmin() {
            vm.loadingPromise = Persona_Admin.listPromise(200, 0).then(function (rest) {
                vm.personas_admin = rest.results;
                Persona.listProfile().then(function (rest) {
                    vm.user_ini = rest;
                    vm.personas_admin = _.filter(vm.personas_admin, function (item) {
                        return item.id != vm.user_ini.id;
                    });
                }).catch(function () {
                });
            }).catch(function () {

            });
        }

        function remove() {
            var confirm = $mdDialog.confirm()
                .title(vm.dialogTitle)
                .textContent(vm.dialogMessage)
                .ariaLabel('Confirmar eliminación')
                .ok(vm.deleteButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function () {
                Persona_Admin.deleteData(vm.persona).then(function () {
                    toastr.success(vm.successDeleteMessage, vm.successTitle);
                    getPersonaAdmin();
                    cancel();
                    activate();
                }).catch(function () {
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                });
            }, function () {

            });

        }

        //function removeGroup(grupo) {
        //    var confirm = $mdDialog.confirm()
        //        .title(vm.dialogTitle)
        //        .textContent(vm.dialogDeleteGroupMessage)
        //        .ariaLabel('Confirmar eliminación')
        //        .ok(vm.deleteButton)
        //        .cancel(vm.cancelButton);
        //    $mdDialog.show(confirm).then(function () {
        //        Administration.deleteGroup(grupo).then(function () {
        //            loadGroup(vm.persona.user);
        //            toastr.success(vm.successDeleteMessage, vm.successTitle);
        //        }).catch(function () {
        //            toastr.warning(vm.errorMessage, vm.errorTitle);
        //        });
        //    }, function () {

        //    });

        //}

        //function loadGroup(usuario) {
        //    vm.loadingPromiseGroup = Administration.getGroups(usuario.username).then(function (groups_response) {
        //        vm.grupo_user = groups_response;
        //    });
        //}

        function update() {
            vm.personaUpdate.id = vm.persona.id;
            vm.personaUpdate.user.email = vm.persona.user.email;
            vm.personaUpdate.nombre = vm.persona.nombre;
            vm.personaUpdate.apellido_paterno = vm.persona.apellido_paterno;
            vm.personaUpdate.apellido_materno = vm.persona.apellido_materno;
            vm.personaUpdate.direccion = vm.persona.direccion;
            vm.personaUpdate.telefono = vm.persona.telefono;

            Persona_Admin.modify(vm.personaUpdate).then(function () {
                toastr.success(vm.successUpdateMessage, vm.successTitle);
                cancel();
                activate();
            }).catch(function () {
                toastr.warning(vm.errorMessage, vm.errorTitle);
            });

        }

        function cancel() {
            $scope.objectForm.$setPristine();
            $scope.objectForm.$setUntouched();
            vm.persona = angular.copy(persona);
            vm.selectedPersonaList = null;
            vm.searchText = '';
        }

        //function addGroup(event) {
        //    var config = {
        //        controller: 'assignGroupDialogController',
        //        controllerAs: 'vm',
        //        bindToController: true,
        //        templateUrl: 'app/mainApp/management/users/modal/assignGroupDialog.tmpl.html',
        //        parent: angular.element($document.body),
        //        targetEvent: event,
        //        clickOutsideToClose: true,
        //        fullscreen: false,
        //        locals: {
        //            groups_user: vm.grupo_user
        //        }
        //    };
        //    $mdDialog.show(config).then(function (object) {
        //        vm.group_persona.grupo_id = _.pluck(object, "id");
        //        vm.group_persona.persona = vm.persona.id;
        //        Administration.createGroup(vm.group_persona).then(function () {
        //            vm.group_persona = angular.copy(group_persona);
        //            toastr.success(vm.successAddedGroupMessage, vm.successTitle);
        //            loadGroup(vm.persona.user);
        //        }).catch(function () {
        //            toastr.warning(vm.errorMessage, vm.errorTitle);
        //        });
        //    }
        //    );
        //}

        function clean() {
            $scope.objectForm.$setPristine();
            $scope.objectForm.$setUntouched();
            vm.persona.user.username = "";
            vm.persona.user.email = "";
            vm.persona.nombre = "";
            vm.persona.apellido_paterno = "";
            vm.persona.apellido_materno = "";
            vm.persona.direccion = "";
            vm.persona.telefono = "";
            vm.selectedModeloList = null;

        }

        //**
        function querySearch(query) {
            var results = query ? lookup(query) : vm.personas_admin;
            return results;

        }

        function lookup(search_text) {
            vm.search_items = _.filter(vm.personas_admin, function (item) {
                return item.nombre.toLowerCase().indexOf(search_text.toLowerCase()) >= 0;
            });
            return vm.search_items;
        }

        function selectedPersonas(project) {
            vm.selectedIndex = 0;
            vm.selectedPersonaList = project;
            vm.persona = angular.copy(project);
            vm.diabled = false;
        }

        function selectedItemChange(item) {
            vm.persona = angular.copy(item);
            vm.selectedPersonaList = item;
            vm.diabled = false;
        }


    }

    function personaSearch(_) {
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
