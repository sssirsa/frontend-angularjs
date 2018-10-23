//Create by Alex 26/04/2018

(function () {

    angular
        .module('app.mainApp')
        .component('createCabinet', {
            templateUrl: 'app/mainApp/components/createCabinet/createCabinet.tmpl.html',
            controller: createCabinetController,
            controllerAs: '$ctrl',
            bindings:{
                toRefresh: '&'
            }
        });

    /* @ngInject */
    function createCabinetController (cabinetPV, ModeloCabinet, MarcaCabinet, Helper, Translate, toastr, $log, $mdDialog, $scope, ErrorHandler, URLS) {
        var vm = this;

        //variables
        vm.cabinet = {};
        vm.economico = null;
        vm.no_serie = null;
        vm.year = null;
        vm.unilever_id = null;
        vm.marca = null;
        vm.modelos = [];

        vm.loadingPromise = null;

        //funciones
        vm.onBrandSelect = onBrandSelect;
        vm.onElementSelect = onElementSelect;

        //Blank variables templates
        vm.catalogues = {
            marca: {
                catalog: {
                    url: URLS.marca,
                    kind: 'Web',
                    name: Translate.translate('INPUT.Dialogs.Cabinet.Brand'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            modelo_by_marca: {
                catalog: {
                    url: null,
                    kind: 'Web',
                    name: Translate.translate('INPUT.Dialogs.Cabinet.Model'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            condicion: {
                catalog: {
                    url: URLS.condicion,
                    kind: 'Web',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.CONDITION'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            status_unilever: {
                catalog: {
                    url: URLS.status_unilever,
                    kind: 'Web',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.STATUS_UNILEVER'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            status_com: {
                catalog: {
                    url: URLS.status_com,
                    kind: 'Web',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.STATUS_COM'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            }
        };


        function onBrandSelect(element) {
            vm.modelo = null;
            vm.marca = element;
            vm.catalogues.modelo_by_marca.catalog.url = URLS.marca + '/models/' + element;
        }

        function onElementSelect(element, field) {
            vm.cabinet[field] = element;
            console.log(vm.cabinet[field] = element);
        }

        vm.accept = accept;
        function accept() {

            vm.cabinet['economico'] = vm.economico;
            vm.cabinet['no_serie'] = vm.no_serie;
            vm.cabinet['year'] = vm.year;
            vm.cabinet['unilever_id'] = vm.unilever_id;

            var validate = _.contains(_.values(vm.cabinet), null);

            if(validate){
                toastr.error("Llene corectamente todos los campos");
            }else{
                /*cabinetPV.create(aux)
                    .then(function (cabinetCreated) {
                        vm.cabinet = {};
                        vm.economico = null;
                        vm.no_serie = null;
                        vm.year = null;
                        vm.unilever_id = null;
                        vm.marca = null;
                        vm.modelos = [];

                        $scope.newcabinetFrom.$setPristine();
                        $scope.newcabinetFrom.$setUntouched();

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
                                //vm.toRefresh();
                            })
                            .catch(function(){
                                //vm.toRefresh();
                            });
                    })
                    .catch(function (err) {
                        ErrorHandler.errorTranslate(err);
                    });*/

                toastr.success("Todo correcto");
            }

        }

    }

})();
