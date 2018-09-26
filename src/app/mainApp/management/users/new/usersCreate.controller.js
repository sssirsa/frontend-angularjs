(function () {
    angular
        .module('app.mainApp.management.users')
        .controller('usersCreateController', UsersCreateController);

    function UsersCreateController(groups,
        NotificationPanel,
        Persona_Admin,
        toastr,
        Helper,
        Translate,
        $scope,
        URLS
    ) {
        var vm = this;
        vm.isClient = true;
        activate();
        vm.cpassword = "";
        vm.fotoByPass = null;
        vm.ifeByPass = null;
        vm.guardarUsuario = guardarUsuario;
        vm.enviar = enviar;
        vm.clean = clean;
        vm.cancel = cancel;
        vm.selectionFoto = selectionFoto;
        vm.selectionIFE = selectionIFE;
        vm.onSubsidiarySelect = onSubsidiarySelect;

        vm.catalogues = {
            sucursal: {
                catalog: {
                    url: URLS.sucursal,
                    kind: 'Web',
                    name: Translate.translate('ADMIN_PERSONA.PROPERTY.SUCURSALDEF'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            }
        };

        function activate() {

            vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
            vm.successCreateMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_CREATE');
            vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_MESSAGE');
            vm.errorSize = Translate.translate('MAIN.MSG.FILE_SIZE');
            vm.erroNumSolConf = Translate.translate('ADMIN_PERSONA.ERROR_MESSAGE.ERRORNUMSOLCONF');
            groups.list().then(function (rest) {
                vm.grupos = rest;
            }).catch(function (error) {

            });
        }


        vm.user = {
            "mail": ""
        };
        vm.user_ini = {
            "user": {
                "username": "",
                "email": "",
                "password": "",
                "role": ""
            },
            "nombre": "",
            "apellido_paterno": "",
            "apellido_materno": null,
            "direccion": "",
            "telefono": "",
            "ife": null,
            "foto": null
        };

        vm.user_vacio = {
            "user": {
                "username": "",
                "email": "",
                "password": "",
                "role": ""
            },
            "nombre": "",
            "apellido_paterno": "",
            "apellido_materno": null,
            "direccion": "",
            "telefono": "",
            "ife": null,
            "foto": null
        };


        function clean() {
            cancel();
        }

        function enviar() {

            vm.user = {
                user: "",
                password: "",
                confirm: "",
                mail: "",
                tipo: ""

            };
        }

        function guardarUsuario() {
            vm.user_ini.foto = vm.picFoto;
            vm.user_ini.ife = vm.picIFE;

            if (vm.user_ini.sucursal == null)
                delete vm.user_ini['sucursal'];
            Persona_Admin.createObject(vm.user_ini).then(function (res) {
                toastr.success(vm.successCreateMessage);
                clean();
                var grupo = _.findWhere(vm.grupos, { name: "Administrador" });
                var role = null;
                if (vm.user_ini.user.role == grupo.id && vm.user_ini.sucursal != null) {
                    role = 0;
                } else {
                    role = vm.user_ini.user.role;
                }
                var request = {
                    username: vm.user_ini.user.username,
                    name: vm.user_ini.nombre + " " + vm.user_ini.apellido_paterno + " " + vm.user_ini.apellido_materno,
                    office: vm.user_ini.sucursal,
                    profile: role
                };
                // NotificationPanel.createUser(request).then(function () {
                //     toastr.success(vm.successCreateMessage, vm.successTitle);
                //     cancel();
                //     activate();
                // }).catch(function (error) {
                //     toastr.error(error, vm.errorTitle);
                // });
            }).catch(function (err) {
                if (err.status == 400 && err.data.message == "El usuario ya existe") {
                    toastr.error(vm.erroNumSolConf, vm.errorTitle);
                } else {
                    toastr.error(vm.errorMessage, vm.errorTitle);
                }
            });
        }


        function cancel() {
            $scope.objectForm.$setPristine();
            $scope.objectForm.$setUntouched();
            vm.user_ini = _.clone(vm.user_vacio);
            vm.picFoto = null;
            vm.picIFE = null;
            vm.ifeByPass = null
            vm.fotoByPass = null;

            vm.cpassword = ''
        }


        function selectionFoto($files) {
            if ($files.length > 0) {
                var file = $files[0];
                var extn = file.name.split(".").pop();
                if (file.size / 1000000 > 1) {
                    toastr.warning(vm.errorSize, vm.errorTitle);
                    vm.picFoto = null;

                } else if (!Helper.acceptFile(file.type)) {
                    if (!Helper.acceptFile(extn)) {
                        toastr.warning(vm.errorTypeFile, vm.errorTitle);
                        vm.picFoto = null;
                    }
                } else {
                    vm.fotoByPass = vm.picFoto;
                }
            } else {
                if (vm.fotoByPass != null) {
                    vm.picFoto = vm.fotoByPass;
                    console.log("algo");
                }

            }

        }

        function selectionIFE($files) {
            if ($files.length > 0) {
                var file = $files[0];
                var extn = file.name.split(".").pop();
                if (file.size / 1000000 > 1) {
                    toastr.warning(vm.errorSize, vm.errorTitle);
                    vm.picIFE = null;

                } else if (!Helper.acceptFile(file.type)) {
                    if (!Helper.acceptFile(extn)) {
                        toastr.warning(vm.errorTypeFile, vm.errorTitle);
                        vm.picIFE = null;
                    }
                } else {
                    vm.ifeByPass = vm.picIFE;
                }
            } else {
                if (vm.ifeByPass != null) {
                    vm.picIFE = vm.ifeByPass;
                    console.log("algo2");
                }

            }

        }

        function onSubsidiarySelect(element) {
            vm.user_ini.sucursal = element;
        }

    }

})();
