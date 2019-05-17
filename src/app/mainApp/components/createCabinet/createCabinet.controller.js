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
    function createCabinetController(
        EnvironmentConfig,
        cabinetUC,
        Helper,
        Translate,
        toastr,
        $log,
        $mdDialog,
        $scope,
        ErrorHandler,
        URLS,
        QUERIES,
        _
    ) {
        var vm = this;

        //variables
        vm.cabinet = {};
        vm.economico = null;
        vm.no_serie = null;
        vm.year = null;
        vm.id_unilever = null;
        vm.marca = null;
        vm.modelos = [];

        vm.loadingPromise = null;
        vm.clear = "1";
        var validate = true;

        //funciones
        vm.onBrandSelect = onBrandSelect;
        vm.onElementSelect = onElementSelect;

        //Blank variables templates
        vm.catalogues = {
            marca: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.cabinet_brand,
                    kind: 'Generic',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.TRADEMARK'),
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
            modelo_by_marca: {
                catalog: {
                    url: null,
                    kind: 'Generic',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.MODEL'),
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
                    url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.condition,
                    kind: 'Generic',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.CONDITION'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'letra'
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
            categoria: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.category,
                    kind: 'Generic',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.CATEGORY'),
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
            }
        };


        function onBrandSelect(element) {
            vm.modelo = null;
            vm.marca = element;
            vm.catalogues.modelo_by_marca.catalog.url = EnvironmentConfig.site.rest.api
                + '/' + URLS.management.base
                + '/' + URLS.management.catalogues.base
                + '/' + URLS.management.catalogues.cabinet_model
                + QUERIES.cabinet.by_brand + element;
        }

        function onElementSelect(element, field) {
            vm.cabinet[field] = element;
        }

        function limpiar(){
            validate = true;
            vm.cabinet = {};
            vm.economico = null;
            vm.no_serie = null;
            vm.year = null;
            vm.id_unilever = null;
            vm.marca = null;
            vm.modelos = [];
            vm.clear = "1";
        }

        vm.accept = accept;
        function accept() {

            vm.cabinet['economico'] = vm.economico;
            vm.cabinet['no_serie'] = vm.no_serie;
            vm.cabinet['year'] = vm.year;
            vm.cabinet['id_unilever'] = vm.id_unilever;

            //variables de los catalogos
            vm.cabinet['modelo_id'] = vm.cabinet['modelo_id'];

            validate = _.contains(_.values(vm.cabinet), undefined);

            if(validate){
                toastr.error("Llene corectamente todos los campos");
            }else{
                vm.clear = "";
                cabinetUC.create(vm.cabinet)
                    .then(function (cabinetCreated) {

                        limpiar();
                        vm.toRefresh();

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
                            .catch(function () {
                                //vm.toRefresh();
                            });
                    })
                    .catch(function (err) {
                        limpiar();
                        ErrorHandler.errorTranslate(err);
                    });
            }
        }

    }

})();
