//Create by Alex 26/04/2018

(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('cabinetPVController',cabinetPVController);

    function cabinetPVController(cabinetPV, MarcaCabinet, ModeloCabinet, Helper, $mdDialog, data, $scope, toastr, Translate)
    {
        var vm = this;

        vm.info = data;
        vm.modelo = vm.info.modelo_id;
        vm.marca = vm.info.modelo.marca;
        vm.urlQR = vm.info.qr_code;
        vm.activo = "Activo";

        vm.eco = vm.info.economico;

        vm.marcas = null;
        vm.modelos = null;
        vm.loadingPromise = null;

        vm.confirmation = "";

        vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
        vm.successDeleteMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_DELETE');
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_MESSAGE');

        var models = null;

        //functions
        vm.listMarcas = listMarcas;
        vm.listModelos = listModelos;
        vm.changeTrademark = changeTrademark;
        vm.putActive = putActive;
        vm.cerrar = cerrar;
        vm.accept = accept;
        vm.remove = remove;
        vm.acceptConfirm = acceptConfirm;
        vm.cancelConfirm = cancelConfirm;

        listMarcas();
        listModelos();

        function putActive() {
            if(vm.info.activo === true){
                vm.activo = "Activo";
            }else{
                vm.activo = "Inactivo";
            }
        }

        function listMarcas(){
            vm.loadingPromise = MarcaCabinet.listPromise()
                .then(function (res) {
                    vm.marcas = Helper.filterDeleted(res, true);
                })
                .catch(function (err) {

                });
        }

        function listModelos() {
            vm.loadingPromise = ModeloCabinet.listWitout().then(function (res) {
                models = Helper.filterDeleted(res, true);
                changeTrademark();
            }).catch(function(err){

            });
        }

        function changeTrademark() {
            vm.modelos = null;
            vm.modelos = _.where(models, {marca: parseInt(vm.marca)});
        }

        function accept() {
            var aux = {
                economico: vm.info.economico,
                modelo_id: vm.modelo,
                activo: vm.info.activo,
                no_serie: vm.info.no_serie.toUpperCase(),
                no_incidencias: vm.info.no_incidencias,
                antiguedad: vm.info.antiguedad.toUpperCase()
            };

            cabinetPV.update(parseInt(vm.info.economico), aux)
                .then(function (res) {
                    $mdDialog.hide();
                })
                .catch(function (err) {

                });
        }

        function cerrar() {
            $mdDialog.cancel(null);
        }

        function remove() {
            vm.confirmation = "confirma";
        }

        function acceptConfirm() {
            cabinetPV.dlete(vm.eco)
                .then(function (res) {
                    toastr.success(vm.successDeleteMessage, vm.successTitle);
                    $mdDialog.hide(null);
                })
                .catch(function (err) {
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                    $mdDialog.hide(null);
                });
        }

        function cancelConfirm() {
            $mdDialog.cancel(null);
        }


    }

})();
