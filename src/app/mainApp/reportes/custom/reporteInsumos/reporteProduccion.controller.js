/**
 * Created by franciscojaviercerdamartinez on 20/06/17.
 */
(function () {
    "use strict";
    angular.module("app.mainApp.tecnico").controller("reporteProduccionController", reporteProduccionController);

    function reporteProduccionController(CONFIGS,MarcaCabinet, TipoEquipo,$window, Servicios, Helper, toastr, Sucursal, Reporte) {
        var vm = this;
        vm.reporte = {
            fecha: ""
        };
        vm.cabinetBuffer = "";
        vm.cabinet=[];
        vm.mes = null;
        vm.anio = null;
        vm.meses = CONFIGS.ADTConfig.monthsNames;
        vm.saveReporte = saveReporte;
        vm.appendElement = appendElement;
        vm.filterModels=filterModels;
        getFecha();
        getEtapasList();
        getSucursal();
        activate();
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
                notifyError(res.status);
            });
        }

        function activate(){
            vm.marca=null;
            MarcaCabinet.listObject().then(function(res){
                vm.marcas=Helper.filterDeleted(res,true);
                vm.marcas = Helper.sortByAttribute(vm.marcas, 'descripcion');
            }).catch(function(err){
                toastr.error(vm.errorMessage,vm.errorTitle);
                vm.marcas=[];
            });
            vm.modelos=[];
            TipoEquipo.listWitout().then(function (res) {
                vm.tiposEquipo=Helper.filterDeleted(res,true);
                vm.tiposEquipo=_.sortBy(vm.tiposEquipo, 'nombre');
            });
        }

        function filterModels(){
            if(vm.marca!=null) {
                vm.modelos = MarcaCabinet.getModels(vm.marca).then(function(res){
                    if(res.length>0) {
                        vm.modelos = Helper.filterDeleted(res,true);
                    }
                }).catch(function(){
                    vm.modelos=[];
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

        function getFecha() {
            var CurrentDate = new Date();
            vm.day = CurrentDate.getDate();
            vm.month = CurrentDate.getMonth();
            vm.anioActual = CurrentDate.getFullYear();
        }

        function saveReporte() {
            //vm.reporte.fecha = vm.meses.indexOf(vm.mes) + '-' + vm.anio;
            vm.reporte.fecha = vm.meses.indexOf(vm.mes) + '-2017';
            var promise = Reporte.reporteInsumos(vm.reporte);
            promise.then(function (res) {
                $window.open(res.url, '_blank', '');
            }).catch(function (res) {
                console.log(res);
                toastr.error(vm.errorMessage, vm.errorTitle);
            });

        }
    }
})();
