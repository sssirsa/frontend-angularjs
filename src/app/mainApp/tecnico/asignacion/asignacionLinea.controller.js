/**
 * Created by franciscojaviercerdamartinez on 19/07/16.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.tecnico')
        .controller('asignacionLineaController', asignacionLineaController);

    function asignacionLineaController(Cabinet, toastr, Translate, ModeloCabinet,$scope, $mdDialog) {
        var vm = this;
        $scope.form = {};
        //Inicializacion de variables
        vm.cabinet = {
            activo: false,
            status: "",
            economico: "",
            tipoEntrada: "",
            noSerie: "",
            ano: "",
            incidencias: "",
            linea_x: "",
            linea_y: "",
            linea_z: "",
            modelo: '"'

        };
        vm.ver = false;
        vm.cabinetPartial = {
            activo: false,
            status: "",
            economico: "",
            tipoEntrada: "",
            noSerie: "",
            ano: "",
            incidencias: "",
            linea_x: "",
            linea_y: "",
            linea_z: "",
            modelo: '"'

        };
        vm.modelos = [];
        activate();


        //Declaracion de funciones
        vm.guardar = guardar;
        vm.buscar = buscar;
        vm.limpiar = limpiar;
        vm.buscarModelos = buscarModelos;
        //Funciones
        function activate() {
            vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
            vm.successCreateMessage = Translate.translate('MAIN.MSG.SUCCESS_LINE_MESSAGE');
            vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_MESSAGE');
            vm.notFoundMessage = Translate.translate('MAIN.MSG.NOT_FOUND');
            vm.notFoundInput = Translate.translate('MAIN.MSG.NOT_FOUND_INPUT');
            vm.errorTypeFile = Translate.translate('MAIN.MSG.ERORR_TYPE_FILE');
            vm.errorSize = Translate.translate('MAIN.MSG.FILE_SIZE');
            vm.cabinetDeleted = Translate.translate('MAIN.MSG.ERROR_DISABLED_CABINET');
            buscarModelos();
        }

        function buscarModelos() {

            vm.modelos = ModeloCabinet.list();

        }

        function buscar() {
            if (vm.idCabinet != null) {
                var promise = Cabinet.get(vm.idCabinet);
                promise.then(function (res) {
                    vm.cabinet = res;
                    if (vm.cabinet.deleted = true) {
                        notifyError(999);
                        vm.limpiar();
                    }
                    vm.ver = true;


                }).catch(function (res) {
                    notifyError(res.status);
                });
            }
            else {
                notifyError(400);
            }


        }

        function notifyError(status) {
            switch (status) {
                case 404:
                    toastr.info(vm.notFoundMessage, vm.errorTitle);
                    break;
                case 999:
                    toastr.warning(vm.cabinetDeleted, vm.errorMessage);
                    break;
                default:
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                    break;

            }
        }

        function guardar() {
            if (vm.idCabinet != null) {

                vm.cabinet.partial = true;
                vm.cabinetPartial = _.omit(vm.cabinet, 'foto');
                var promise = Cabinet.modify(vm.cabinetPartial);
                promise.then(function (res) {
                    vm.cabinet = res;
                    //console.log(vm.cabinet);
                    limpiar();
                    vm.cabinet = null;
                    vm.cabinetPartial = null;
                    toastr.success(vm.successCreateMessage, vm.successTitle);

                }).catch(function (res) {
                    notifyError(res.status);
                });
            }
            else {
                notifyError(400);
            }

        }

        function limpiar() {
            vm.cabinet = {
                activo: false,
                status: "",
                economico: "",
                tipoEntrada: "",
                noSerie: "",
                ano: "",
                incidencias: "",
                linea_x: "",
                linea_y: "",
                linea_z: "",
                marca: '"'

            };
            vm.idCabinet = null;
            vm.ver = false;


        }

        vm.verInfo = function () {
            $mdDialog.show({
                locals: {parent: vm},
                controller: function () {
                    this.parent = vm
                },
                templateUrl: 'app/mainApp/tecnico/asignacion/dialogInfoCabinet.tmpl.html',
                parent: angular.element(document.body),
                controllerAs: 'vm',
                clickOutsideToClose: true
            })

        };


    }


})();
