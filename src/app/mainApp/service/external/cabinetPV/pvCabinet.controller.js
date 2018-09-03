(function () {
    angular
        .module('app.mainApp')
        .controller('NewCabinetPrerequestController', NewCabinetPrerequestController);

    function NewCabinetPrerequestController(OPTIONS, URLS, udn, TipoEquipo, Helper, $mdEditDialog, $mdDialog, cabinetPV)
    {
        var vm = this;

        vm.todosprev = null;
        vm.todos = [];
        vm.loadingPromise = null;

        vm.aRefresh = aRefresh;
        vm.listcabinets = listcabinets;

        //datos para paginado
        vm.objectPaginado = null;
        vm.offset = 0;
        vm.sig = sigPage;
        vm.prev = prevPage;

        function aRefresh() {
            console.log("Refresca la principal");
            vm.todosprev = null;
            vm.todos = [];
            vm.objectPaginado = null;
            vm.offset = 0;
            listcabinets();

        }

        function paginadoRefresh() {
            console.log("Refresca la principal");
            vm.todosprev = null;
            vm.todos = [];
            listcabinets();
        }

        listcabinets();

        function listcabinets(){
            var ux = "Activo";

            vm.loadingPromise = cabinetPV.list('50', vm.offset)
                .then(function (res) {
                    console.log(res);
                    vm.objectPaginado = res;
                    prepareDataFunction();


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
                })
                .catch(function (err) {

                });
        }

        function prepareDataFunction() {
            vm.todosprev = Helper.filterDeleted(vm.objectPaginado.results, true);
        }

        function sigPage() {
            vm.offset += 100;
            paginadoRefresh();
            //listcabinets();
        }

        function prevPage() {
            vm.offset -= 100;
            paginadoRefresh();
            //listcabinets();
        }

    }

})();
