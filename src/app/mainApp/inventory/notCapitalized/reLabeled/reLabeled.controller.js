/**
 * Created by Alex on 19/10/2016.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.inventory')
        .controller('reLabeledController', reLabeledController);

    function reLabeledController(
        $mdDialog,
        URLS,
        noLabeled,
        noLabeledID,
        Translate,
        toastr,
        MANAGEMENT,
        ErrorHandler,
        EnvironmentConfig,
        QUERIES,
        PAGINATION,
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
        var validate = true;

        //funciones
        vm.onBrandSelect = onBrandSelect;
        vm.onElementSelect = onElementSelect;
        vm.create = create;
        vm.cancel = cancelClick;

        activate();

        function activate() {
            vm.noLabeled = noLabeledID;
        }

        //Blank variables templates
        vm.catalogues = {
            marca: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.catalogues.base
                    + '/' + URLS.management.catalogues.cabinet_brand,
                    
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.TRADEMARK'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre'
                },
                pagination: {
                    total: PAGINATION.total,
                    limit: PAGINATION.limit,
                    offset: PAGINATION.offset,
                    pageSize: PAGINATION.pageSize
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
                    
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.MODEL'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre'
                },
                pagination: {
                    total: PAGINATION.total,
                    limit: PAGINATION.limit,
                    offset: PAGINATION.offset,
                    pageSize: PAGINATION.pageSize
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
                    
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.CONDITION'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'letra'
                },
                pagination: {
                    total: PAGINATION.total,
                    limit: PAGINATION.limit,
                    offset: PAGINATION.offset,
                    pageSize: PAGINATION.pageSize
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
                    
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.CATEGORY'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre'
                },
                pagination: {
                    total: PAGINATION.total,
                    limit: PAGINATION.limit,
                    offset: PAGINATION.offset,
                    pageSize: PAGINATION.pageSize
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

        function cancelClick() {
            $mdDialog.cancel(null);
        }

        function create() {
            vm.cabinet['economico'] = vm.economico;
            vm.cabinet['no_serie'] = vm.no_serie;
            vm.cabinet['year'] = vm.year;
            vm.cabinet['id_unilever'] = vm.id_unilever;
            vm.cabinet['no_capitalizado_id'] = vm.noLabeled;

            //variables de los catalogos
            vm.cabinet['modelo_id'] = vm.cabinet['modelo_id'];


            validate = _.contains(_.values(vm.cabinet), undefined);

            if(validate){
                toastr.error("Llene corectamente todos los campos");
            }else{
                noLabeled.lebeled(vm.cabinet)
                    .then(function (cabinetCreated) {
                        $mdDialog.hide(cabinetCreated);
                        toastr.success(Translate.translate('SUCCESS.CREATE'));
                    })
                    .catch(function (err) {
                        $mdDialog.cancel(err);
                        ErrorHandler.errorTranslate(err);
                    });
            }
        }

    }
})();
