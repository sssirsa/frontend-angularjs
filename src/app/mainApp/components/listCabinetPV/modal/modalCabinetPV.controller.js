//Create by Alex 26/04/2018

(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('cabinetPVController',cabinetPVController);

    function cabinetPVController(MarcaCabinet, ModeloCabinet, Helper, $mdDialog, data)
    {
        var vm = this;

        vm.info = data;
        vm.modelo = vm.info.modelo_id;
        vm.marca = vm.info.modelo.marca;

        vm.marcas = null;
        vm.modelos = null;
        vm.loadingPromise = null;

        var models = null;

        //functions
        vm.listMarcas = listMarcas;
        vm.listModelos = listModelos;
        vm.changeTrademark = changeTrademark;
        vm.cerrar = cerrar;
        vm.submit = submit;

        listMarcas();
        listModelos();


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

        function submit()
        {
            $mdDialog.hide();
        }

        function cerrar() {
            $mdDialog.cancel(null);
        }


    }

})();
