
(function () {
    angular
        .module('app.mainApp.solicitudes')
        .controller('NewCabinetPrerequestController', NewCabinetPrerequestController);

    function NewCabinetPrerequestController(OPTIONS, URLS, udn, TipoEquipo, Helper, $mdEditDialog, $mdDialog, cabinetPV)
    {
        var vm = this;

        vm.todosprev = null;
        vm.todos = [];
        vm.loadingPromise = null;

        vm.aRefresh = aRefresh;
        vm.listcabinets = listcabinets;

        function aRefresh() {
            console.log("Refresca la principal");
            vm.todosprev = null;
            vm.todos = [];
            listcabinets();

        }

        listcabinets();

        function listcabinets(){
            var ux = "Activo";

            vm.loadingPromise = cabinetPV.list()
                .then(function (res) {
                    vm.todosprev = Helper.filterDeleted(res, true);

                    angular.forEach(vm.todosprev, function (cabinet) {

                        if(cabinet.activo === true){
                            ux = "Activo";
                        }else{
                            ux = "Inactivo";
                        }

                        var cabinetPreview = {
                            economico: cabinet.economico,
                            modelo: {
                                id: cabinet.modelo.id,
                                deleted: cabinet.modelo.deleted,
                                nombre: cabinet.modelo.nombre,
                                descripcion: cabinet.modelo.descripcion,
                                palabra_clave: cabinet.modelo.palabra_clave,
                                tipo: cabinet.modelo.tipo,
                                marca: cabinet.modelo.marca
                            },
                            modelo_id: cabinet.modelo_id,
                            antiguedad: cabinet.antiguedad,
                            activo: cabinet.activo,
                            estado: ux,
                            no_incidencias: cabinet.no_incidencias,
                            qr_code: cabinet.qr_code,
                            deleted: cabinet.deleted,
                            no_serie: cabinet.no_serie
                        };

                        vm.todos.push(cabinetPreview);
                    });
                    console.log("vm.todos", vm.todosprev);
                })
                .catch(function (err) {

                });
        }

    }

})();
