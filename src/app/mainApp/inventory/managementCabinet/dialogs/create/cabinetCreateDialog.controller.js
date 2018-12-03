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
        cabinetID,
        Helper,
        Translate,
        toastr,
        cabinetUC,
        MANAGEMENT,
        ErrorHandler,
        EnvironmentConfig
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
        vm.create = create;
        vm.cancel = cancelClick;

        //Translates
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_CATALOG');

        activate();

        function activate() {
            vm.economico = cabinetID;
        }

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
                    url: EnvironmentConfig.site.rest.api + MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.condicion,
                    kind: 'Management',
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
            status_unilever: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api + MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.estatus_unilever,
                    kind: 'Management',
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
                    url: EnvironmentConfig.site.rest.api + MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.estatus_com,
                    kind: 'Management',
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
            },
            categoria:{
                catalog: {
                    url: EnvironmentConfig.site.rest.api + MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.categoria,
                    kind: 'Management',
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
            vm.catalogues.modelo_by_marca.catalog.url = URLS.marca + '/models/' + element;
        }

        function onElementSelect(element, field) {
            vm.cabinet[field] = element;
        }

        function cancelClick() {
            $mdDialog.cancel(null);
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

        function create() {
            vm.cabinet['economico'] = vm.economico;
            vm.cabinet['no_serie'] = vm.no_serie;
            vm.cabinet['year'] = vm.year;
            vm.cabinet['id_unilever'] = vm.id_unilever;

            //variables de los catalogos
            vm.cabinet['modelo_id'] = vm.cabinet['modelo_id'];
            //vm.cabinet['condicion_id'] = vm.cabinet['condicion_id'];
            //vm.cabinet['estatus_unilever_id'] = vm.cabinet['estatus_unilever_id'];
            //vm.cabinet['estatus_com_id'] = vm.cabinet['estatus_com_id'];

            //variables en null (se eliminaran al corregir back)
            vm.cabinet['insumo_id'] = 25;
            vm.cabinet['pedimento_id'] = 1;
            vm.cabinet['posicionamiento_id'] = 1;
            vm.cabinet['sucursal_id'] = 1;
            //vm.cabinet['categoria_id'] = 1;

            validate = _.contains(_.values(vm.cabinet), undefined);

            if(validate){
                toastr.error("Llene corectamente todos los campos");
            }else{
                vm.clear = "";
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
