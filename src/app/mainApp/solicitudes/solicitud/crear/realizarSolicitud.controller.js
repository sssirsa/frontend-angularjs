
(function () {
    angular
        .module('app.mainApp.solicitudes')
        .controller('realizarSolicitudController', realizarSolicitudController);

    function realizarSolicitudController(OPTIONS, udn,TipoEquipo,$mdEditDialog, $mdDialog, Translate,toastr, Solicitudes, Solicitud_Servicio, Solicitudes_Admin, PersonaCapturista, Session, Socket,$scope) {
        var vm = this;

        var requisito = {
            "id": null,
            "udn": null,
            "fecha_inicio": new Date(),
            "fecha_termino": new Date(),
            "fecha_atendida": new Date(),
            "descripcion": null,
            "tipo_solicitud": null,
            "status": null,
            "comentario": null,
            "datos": [],
            "persona": null
        };
        var requisitoVenta = {
            "id": null,
            "razon_social": null,
            "nombre_negocio": null,
            "direccion": null,
            "telefono": null,
            "contacto_negocio": null,
            "fecha_atencion": new Date(),
            "udn": null,
            "created_at": new Date(),
            "updated_at": new Date()
        };
        vm.minDate = moment();
        vm.hideManualUpload = true;
        vm.hideMassiveUpload = false;
        vm.hideRegisteredSolicitud = true;
        vm.hideUnregisteredSolicitud = true;
        vm.udn = null;
        vm.persona = null;
        vm.types_request = OPTIONS.type_request;
        vm.status = OPTIONS.status;
        vm.status_equipment=OPTIONS.status_equipment;
        vm.udns = null;
        vm.personas = null;
        vm.isClient = true;
        vm.requisitoVenta = angular.copy(requisitoVenta);
        vm.entrada = angular.copy(requisitoVenta);
        vm.requisito = angular.copy(requisito);
        vm.showCreateDialog = showCreateDialog;
        vm.cancel = cancel;
        vm.eliminar = eliminar;
        vm.edit=edit;
        vm.guardarSolicitudAdmin = guardarSolicitudAdmin;
        vm.guardarSolicitudVenta = guardarSolicitudVenta;
        vm.guardarSolicitudCliente = guardarSolicitudCliente;
        vm.showMassiveUpload = showMassiveUpload;
        vm.showManualUpload = showManualUpload;
        vm.selectionFile = selectionFile;
        vm.guardar=guardar;
        activate();
        function activate() {
            vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
            vm.successCreateMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_CREATE');
            vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_MESSAGE');
            vm.udns = udn.list();
            vm.personas = PersonaCapturista.list();
            vm.tiposEquipo=TipoEquipo.list();
            vm.isClient = Session.userRole === 'Cliente';
            vm.requisitoVenta.fecha_atencion=moment();
        }

        function showMassiveUpload() {
            vm.hideManualUpload = true;
            vm.hideMassiveUpload = false;
        }

        function showManualUpload() {
            vm.hideManualUpload = false;
            vm.hideMassiveUpload = true;
        }

        function selectionFile($file) {
            vm.entrada.file = $file;
        }

        function guardar() {
            var fd = new FormData();
            //Is massive upload
            if (vm.entrada.file != null) {
                fd.append('file', vm.entrada.file);
                Solicitud_Servicio.postEntradaMasiva(fd).then(function (res) {
                    vm.entrada = res;
                    vm.hideRegisteredCabinets = false;
                    vm.hideUnregisteredCabinets = false;
                    toastr.success('Exito en la carga masiva', 'Exito');
                    console.log("vm.entrada");
                    console.log(vm.entrada);
                }).catch(function (err) {
                    toastr.error('Error en la carga masiva', 'Error');
                    console.log(err);
                });
            }
            else {
                Solicitud_Servicio.postEntrada(fd).then(function (res) {

                }).catch(function (err) {

                });
            }

        }

        function showCreateDialog(event) {
            var config = {
                controller: 'solicitudDataDialogController',
                controllerAs: 'vm',
                bindToController: true,
                templateUrl: 'app/mainApp/solicitudes/solicitud/crear/modal/solicitudDataDialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: false
            };
            $mdDialog.show(config).then(function (object) {
                vm.requisito.datos.push(object);
            }
            );
        }


        function eliminar(dato) {
            var resultado = _.indexOf(vm.requisito.datos, dato);
            if (resultado != -1) {
                vm.requisito.datos.splice(resultado, 1);
            }
        }

        function cancel() {
            vm.requisitoVenta = angular.copy(requisitoVenta);
            vm.requisito = angular.copy(requisito);

            $scope.solicitudForm.$setPristine();
            $scope.solicitudForm.$setUntouched();
            vm.udn = null;
            vm.persona = null;
            vm.isClient = Session.userRole === 'Cliente';
            vm.requisitoVenta.fecha_atencion=moment();
        }

        function guardarSolicitudAdmin() {
            vm.requisito.fecha_inicio = moment(vm.requisito.fecha_inicio).format('YYYY-MM-DD');
            vm.requisito.fecha_termino = moment(vm.requisito.fecha_termino).format('YYYY-MM-DD');
            vm.requisito.fecha_atendida = moment(vm.requisito.fecha_atendida).toISOString();
            vm.requisito.udn = vm.udn;
            vm.requisito.persona = vm.persona;
            vm.requisito.tipo_solicitud=OPTIONS.type_request[vm.requisito.tipo_solicitud].value_id;
            Solicitudes_Admin.create(vm.requisito).then(function () {
                var notification = {
                    id_solicitud: 1,
                    type_notification: vm.requisito.tipo_solicitud,
                    updated_at: moment().toDate()
                };
                Socket.emit('new:msg', {
                    canal: 'Administrador',
                    username: Session.userInformation.id,
                    solicitud: vm.requisito,
                    name: Session.userInformation.nombre,
                    notification: notification,
                    type: "normal"
                });
                cancel();
                toastr.success(vm.successCreateMessage, vm.successTitle);


            }).catch(function (res) {
                toastr.error(vm.errorMessage, vm.errorTitle);
            })
        }

        function guardarSolicitudCliente() {
            vm.requisito.fecha_inicio = moment(vm.requisito.fecha_inicio).format('YYYY-MM-DD');
            vm.requisito.fecha_termino = moment(vm.requisito.fecha_termino).format('YYYY-MM-DD');
            vm.requisito.udn = vm.udn;
            vm.requisito.tipo_solicitud=OPTIONS.type_request[vm.requisito.tipo_solicitud].value_id;
            Solicitudes.create(vm.requisito).then(function () {
                cancel();

                toastr.success(vm.successCreateMessage, vm.successTitle);


            }).catch(function (res)  {
                toastr.error(vm.errorMessage, vm.errorTitle);
            })
        }
        function edit(event,object,field) {
            var config =
            {
                modelValue: object[field],
                placeholder: 'Edita el campo',
                save: function (input) {
                    object[field] = input.$modelValue;
                },
                targetEvent: event,
                type:'number'
            };
            $mdEditDialog.small(config).then(function(ctrl){
            }).catch(function(err){
            });
        }
        function guardarSolicitudVenta() {
            vm.requisitoVenta.fecha_atencion = moment(vm.requisitoVenta.fecha_atencion).format('YYYY-MM-DD');
            vm.requisitoVenta.created_at = moment(vm.requisitoVenta.created_at).format('YYYY-MM-DD');
            vm.requisitoVenta.updated_at = moment(vm.requisitoVenta.updated_at).format('YYYY-MM-DD');
            vm.requisitoVenta.udn = vm.udn;
            Solicitud_Servicio.create(vm.requisitoVenta).then(function () {
                var notification = {
                    id_solicitud: 1,
                    type_notification: "Venta",
                    updated_at: moment().toDate()
                };
                Socket.emit('new:msg', {
                    canal: 'Administrador',
                    username: Session.userInformation.id,
                    name: Session.userInformation.nombre,
                    solicitud: vm.requisitoVenta,
                    notification: notification,
                    type: "normal"
                });

                cancel();

                toastr.success(vm.successCreateMessage, vm.successTitle);
            }).catch(function (res) {
                toastr.error(vm.errorMessage, vm.errorTitle);
            });
        }
    }

})();
