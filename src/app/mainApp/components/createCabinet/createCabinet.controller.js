//Create by Alex 26/04/2018

(function () {

    angular
        .module('app.mainApp')
        .component('createCabinet', {
            templateUrl: 'app/mainApp/components/createCabinet/createCabinet.tmpl.html',
            controller: createCabinetController
        });

    /* @ngInject */
    function createCabinetController (cabinetPV, ModeloCabinet, MarcaCabinet, Helper, Translate, toastr, $log, $mdDialog) {
        var vm = this;

        vm.economico = null;
        vm.marca = null;
        vm.modelo_id = null;
        vm.no_serie = null;
        vm.antiguedad = null;

        vm.marcas = null;
        vm.modelos = null;
        vm.loadingPromise = null;

        var models = null;

        //functions
        vm.listMarcas = listMarcas;
        vm.listModelos = listModelos;
        vm.changeTrademark = changeTrademark;

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
            }).catch(function(err){

            });
        }

        function changeTrademark() {
            vm.modelos = null;
            vm.modelos = _.where(models, {marca: parseInt(vm.marca)});
        }

        vm.accept = accept;
        function accept() {
            var cabinetCreated = null;
            var aux = {
                economico: vm.economico,
                modelo_id: parseInt(vm.modelo_id),
                no_serie: vm.no_serie.toUpperCase(),
                antiguedad: vm.antiguedad.toUpperCase()
            }
            console.log("objeto final", aux);

            cabinetPV.create(aux)
                .then(function (res) {
                    cabinetCreated = res;
                    vm.economico = null;
                    vm.marca = null;
                    vm.modelo_id = null;
                    vm.no_serie = null;
                    vm.antiguedad = null;

                    $mdDialog.show({
                        controller: 'newCabinetPreController',
                        controllerAs: 'vm',
                        templateUrl: 'app/mainApp/components/createCabinet/modal/modalNewCabinet.tmpl.html',
                        fullscreen: true,
                        clickOutsideToClose: true,
                        focusOnOpen: true,
                        locals: {
                            data: cabinetCreated
                        }
                    })
                        .then(function () {

                        })
                        .catch(function(){

                        });

                })
                .catch(function (err) {
                    console.log("Error", err);
                })

        }

    }

})();
