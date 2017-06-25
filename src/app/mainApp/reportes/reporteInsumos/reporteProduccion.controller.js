/**
 * Created by franciscojaviercerdamartinez on 20/06/17.
 */
(function()
{
    'use strict';

    angular.module('app.mainApp.main').
    controller('reporteProduccionController',reporteProduccionController);

    function reporteProduccionController(Servicios, Sucursal, Reporte)
    {
        var vm = this;
        vm.reporte = {
            fecha:"",
            cabinet:[],
            etapa:""
            
        };
        vm.cabinetBuffer = '';
        vm.mes=null;
        vm.anio=null;
        vm.meses=[
            {id:"01",
            nombre:"Enero"},
            {id:"02",
                nombre:"Febrero"},
            {id:"03",
                nombre:"Marzo"},
            {id:"04",
                nombre:"Abril"},
            {id:"05",
                nombre:"Mayo"},
            {id:"06",
                nombre:"Junio"},
            {id:"07",
                nombre:"Julio"},
            {id:"08",
                nombre:"Agosto"},
            {id:"09",
                nombre:"Septiembre"},
            {id:"10",
                nombre:"Octubre"},
            {id:"11",
                nombre:"Noviembre"},
            {id:"12",
                nombre:"Diciembre"}
        ];
        vm.saveReporte=saveReporte;
        getFecha();
        getEtapasList();
        getSucursal();
        ////////////////
        function getEtapasList() {
            var promise = Servicios.etapaList();
            promise.then(function (res) {
                //vm.etapas = res;
                vm.etapas = Helper.filterDeleted(res, true);
                if (_.size(vm.etapas) == 0) {
                    notifyError(1000);
                }

            }).catch(function (res) {
                notifyError(res.status);
            });
        }
        function getSucursal(){
            Sucursal.listObject().then(function (res) {
                vm.Sucursales = Helper.filterDeleted(res, true);
                vm.Sucursales = _.sortBy(vm.Sucursales, 'nombre');
            }).catch(function () {
                toastr.error(vm.errorMessage, vm.errorTitle);
            });
        }
        function getFecha (){
            var CurrentDate = new Date();
                console.log(CurrentDate);
                vm.day=CurrentDate.getDate();
                vm.month=CurrentDate.getMonth();
                vm.anioActual=CurrentDate.getFullYear();
            
        }
        function saveReporte(){
            vm.reporte.fecha=vm.mes + '-' + vm.anio;
            var promise = Reporte.reporteInsumos(vm.reporte);
            promise.then(function (res) {
                vm.reporte=res;
            }).catch(function () {
                toastr.error(vm.errorMessage, vm.errorTitle);
            });
            
        }




    }


})();