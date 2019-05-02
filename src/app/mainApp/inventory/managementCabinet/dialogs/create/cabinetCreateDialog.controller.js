/**
 * Created by Emmanuel on 15/10/2016.
 * Modified by Alex on 19/10/2016.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.inventory')
        .controller('CabinetDialogController', CabinetDialogController);
    function CabinetDialogController(
        $mdDialog,
        URLS,
        QUERIES,
        cabinetID,
        Helper,
        Translate,
        toastr,
        cabinetUC,
        MANAGEMENT,
        ErrorHandler,
        EnvironmentConfig,
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
            vm.economico = cabinetID;
        }

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
                    option: 'descripcion',
                    pagination: {
                        total: 'count',
                        next: 'next'
                    },
                    elements: 'results',
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                required: true
            },
            modelo_by_marca: {
                catalog: {
                    url: null,
                    kind: 'Generic',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.MODEL'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre',
                    pagination: {
                        total: 'count',
                        next: 'next'
                    },
                    elements: 'results',
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                required: true
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
                    option: 'letra',
                    pagination: {
                        total: 'count',
                        next: 'next'
                    },
                    elements: 'results',
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                required: true
            },
            status_unilever: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.status_unilever,
                    kind: 'Generic',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.STATUS_UNILEVER'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion',
                    pagination: {
                        total: 'count',
                        next: 'next'
                    },
                    elements: 'results',
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                required: true
            },
            status_com: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.status_com,
                    kind: 'Generic',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.STATUS_COM'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion',
                    pagination: {
                        total: 'count',
                        next: 'next'
                    },
                    elements: 'results',
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                required: true
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
                    option: 'nombre',
                    pagination: {
                        total: 'count',
                        next: 'next'
                    },
                    elements: 'results',
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                required: true
            }
        };


        function onBrandSelect(element) {
            vm.modelo = null;
            vm.marca = element;
            vm.catalogues.modelo_by_marca.catalog.url = EnvironmentConfig.site.rest.api
                + '/' + URLS.management.base
                + '/' + URLS.management.catalogues.base
                + '/' + URLS.management.catalogues.cabinet_model
                + QUERIES.cabinet.by_brand
                + element;
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

            //variables de los catalogos
            vm.cabinet['modelo_id'] = vm.cabinet['modelo_id'];

            validate = _.contains(_.values(vm.cabinet), undefined);

            if (validate) {
                toastr.error("Llene corectamente todos los campos");
            } else {
                cabinetUC.create(vm.cabinet)
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
