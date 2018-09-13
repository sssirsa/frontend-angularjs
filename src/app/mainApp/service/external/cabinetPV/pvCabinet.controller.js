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
        vm.limit = 20;
        vm.refreshPaginationButtonsComponent = false;
        vm.textToSearch = '';
        vm.preTextToSearch = '';
        vm.querySet = 'economico__contains=';
        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;
        vm.filterList = filterList;

        function aRefresh() {
            vm.todosprev = null;
            vm.todos = [];
            vm.objectPaginado = null;
            vm.offset = 0;
            listcabinets();
        }

        function paginadoRefresh() {
            vm.todosprev = null;
            vm.todos = [];
            listcabinets();
        }

        listcabinets();

        function listcabinets(){
            vm.refreshPaginationButtonsComponent = false;
            if (vm.preTextToSearch !== vm.textToSearch) {
                vm.offset = 0;
                vm.preTextToSearch = vm.textToSearch;
            }
            if (vm.textToSearch.length === 0) {
                vm.loadingPromise = cabinetPV.list(vm.limit, vm.offset)
                    .then(function (res) {
                        vm.objectPaginado = res;
                        prepareDataFunction();
                        prepareFinalObjects();
                        vm.refreshPaginationButtonsComponent = true;
                    })
                    .catch(function (err) {

                    });
            }
            else {
                var sendQuery = vm.querySet + vm.textToSearch;
                vm.loadingPromise = cabinetPV.list(vm.limit, vm.offset, sendQuery)
                    .then(function (res) {
                        vm.objectPaginado = res;
                        prepareDataFunction();
                        prepareFinalObjects();
                        vm.refreshPaginationButtonsComponent = true;
                    })
                    .catch(function (err) {

                    });
            }

        }

        function prepareFinalObjects() {
            var ux = "Activo";
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
        }

        function prepareDataFunction() {
            vm.todosprev = Helper.filterDeleted(vm.objectPaginado.results, true);
            console.log(vm.todosprev);
        }

        function sigPage() {
            vm.offset += vm.limit;
            paginadoRefresh();
        }

        function prevPage() {
            vm.offset -= vm.limit;
            paginadoRefresh();
        }

        function goToNumberPage(number) {
            vm.offset = number * vm.limit;
            paginadoRefresh();
        }

        function filterList(economicFilter) {
            console.log(economicFilter,1);
            vm.textToSearch = ''+economicFilter;
            paginadoRefresh();
        }
    }

})();
