/**
 * Created by franciscojaviercerdamartinez on 20/06/17.
 */
(function () {
    "use strict";
    angular.module("app.mainApp.tecnico").controller("reporteProduccionController", reporteProduccionController);

    function reporteProduccionController(CONFIGS,Persona, MarcaCabinet, Translate, TipoEquipo,  Servicios, Helper, toastr, Sucursal, Reporte) {
        var vm = this;
        vm.reporte = {
            fecha: ""
        };
        vm.cabinetBuffer = "";
        vm.cabinet = [];
        vm.mes = null;
        vm.anio = null;
        vm.meses = CONFIGS.ADTConfig.monthsNames;
        vm.saveReporte = saveReporte;
        vm.appendElement = appendElement;
        vm.deleteElement = deleteElement;
        vm.filterModels = filterModels;
        activate();
        getFecha();
        getEtapasList();
        getSucursal();
        getInformationUser();

        ////////////////
        function getEtapasList() {
            var promise = Servicios.etapaList();
            promise.then(function (res) {
                //vm.etapas = res;
                vm.etapas = Helper.filterDeleted(res, true);
                if (vm.etapas.length === 0) {
                    notifyError(1000);
                }
            }).catch(function (res) {
                toastr.error(vm.errorMessage, vm.errorTitle);
            });
        }

        function activate() {
            vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
            vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_CATALOG');
            vm.notFoundMessage = Translate.translate('MAIN.MSG.NOT_FOUND');
            vm.notGenerateMessage = Translate.translate('REPORTS.ERRORS.NOT_GENERATE');
            vm.successTitleExport = Translate.translate('REPORTS.MESSAGES.REPORT_EXPORT_TITLE_SUCCESS');
            vm.successExport = Translate.translate('REPORTS.MESSAGES.REPORT_EXPORT_MSG_SUCCESS');
            vm.marca = null;
            MarcaCabinet.listObject().then(function (res) {
                vm.marcas = Helper.filterDeleted(res, true);
                vm.marcas = Helper.sortByAttribute(vm.marcas, 'descripcion');
            }).catch(function (err) {
                toastr.error(vm.errorMessage, vm.errorTitle);
                vm.marcas = [];
            });
            vm.modelos = [];
            TipoEquipo.listWitout().then(function (res) {
                vm.tiposEquipo = Helper.filterDeleted(res, true);
                vm.tiposEquipo = _.sortBy(vm.tiposEquipo, 'nombre');
            }).catch(function (err) {
                toastr.error(vm.errorMessage, vm.errorTitle);
            });

        }

        function getInformationUser() {
            Persona.listProfile().then(function (res) {
                if (res.sucursal !== null) {
                    vm.sucursal = res.sucursal;
                }
            }).catch(function () {
                toastr.error(vm.errorMessage, vm.errorTitle);
            });
        }

        function filterModels() {
            if (vm.marca) {
                vm.modelos = MarcaCabinet.getModels(vm.marca).then(function (res) {
                    if (res.length > 0) {
                        vm.modelos = Helper.filterDeleted(res, true);
                    }
                }).catch(function () {
                    vm.modelos = [];
                });
            }
        }

        function getSucursal() {
            Sucursal.listObject().then(function (res) {
                vm.Sucursales = Helper.filterDeleted(res, true);
                vm.Sucursales = _.sortBy(vm.Sucursales, 'nombre');
            }).catch(function () {
                toastr.error(vm.errorMessage, vm.errorTitle);
            });
        }

        function appendElement(element, value) {
            if (element === "economico") {
                if (!vm.reporte.hasOwnProperty("economico")) {
                    vm.reporte[element] = [];
                }
                vm.reporte[element].push(value);
            } else {
                vm.reporte[element] = value;
            }
        }

        function deleteElement(value) {
            var index = vm.reporte.economico.indexOf(value);
            if (index > -1) {
                vm.reporte.economico.splice(index, 1);
            }
        }

        function getFecha() {
            var CurrentDate = new Date();
            vm.day = CurrentDate.getDate();
            vm.month = CurrentDate.getMonth();
            vm.anioActual = CurrentDate.getFullYear();
            vm.anios = [];
            for (i = 2016; i <= vm.anioActual; i++) {
                vm.anios.push(''+i);
            }
        }

        function saveReporte() {
            vm.reporte.fecha = (vm.meses.indexOf(vm.mes)+1) + '-' + vm.anio; 
            vm.loadingPromise = Reporte.reporteInsumos(vm.reporte).then(function (res) {
                toastr.success(vm.successExport, vm.successTitleExport);
            }).catch(function (res) {
                if (res.status === 404) {
                    toastr.warning(vm.notGenerateMessage, vm.errorTitle);
                } else {
                    toastr.error(vm.errorMessage, vm.errorTitle);
                }
            });

        }

        function notifyError(status) {
            switch (status) {
                case 400:
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                    break;
                case 1000:
                    toastr.warning(vm.notFoundMessage, vm.errorTitle);
                    break;
                case 500:
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                    break;


            }
        }
    }
})();
