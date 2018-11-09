//Create by Alex 26/04/2018

(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('cabinetPVController',cabinetPVController);

    function cabinetPVController(cabinetUC, $mdDialog, data, $scope, toastr, Translate, URLS, ErrorHandler)
    {
        var vm = this;

        //variables
        vm.cabinet = {};
        vm.economico = data.economico;
        vm.no_serie = data.no_serie;
        vm.year = data.year;
        vm.id_unilever = data.id_unilever;
        vm.marcaP = data.marca;
        vm.modeloP = data.modelo;
        vm.marca = null;
        vm.modelos = [];
        vm.urlQR = data.qr_code;

        //variable con consideraciones especiales
        if(data.estatus_unilever){
            vm.estatus_unilever = data.estatus_unilever.descripcion;
        }else{
            vm.estatus_unilever = "Sin asignar";
        }

        if(data.estatus_com){
            vm.estatus_com = data.estatus_com.descripcion;
        }else{
            vm.estatus_com = "Sin asignar";
        }

        if(data.condicion){
            vm.condicion = data.condicion.letra;
        }else{
            vm.condicion = "Sin asignar";
        }

        if(data.condicion){
            vm.categoria = data.categoria.nombre;
        }else{
            vm.categoria = "Sin asignar";
        }


        vm.loadingPromise = null;
        var validate = true;
        vm.confirmation = "";
        vm.changeModel = null;
        vm.sw1 = false;

        //funciones
        vm.onBrandSelect = onBrandSelect;
        vm.onElementSelect = onElementSelect;
        vm.cerrar = cerrar;
        vm.accept = accept;
        vm.remove = remove;
        vm.acceptConfirm = acceptConfirm;
        vm.cancelConfirm = cancelConfirm;
        vm.changeTrademark = changeTrademark;

        //Translates
        vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
        vm.successDeleteMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_DELETE');
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_MESSAGE');

        //Blank variables templates
        vm.catalogues = {
            marca: {
                catalog: {
                    url: URLS.marca,
                    kind: 'Web',
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.NEW_TRADEMARK'),
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
                    name: Translate.translate('MAIN.COMPONENTS.CABINET.NEW_MODEL'),
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
            }/*,
            condicion: {
                catalog: {
                    url: MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.condicion,
                    kind: 'Management',
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
                    url: MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.estatus_unilever,
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
                    url: MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.estatus_com,
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
            }*/
        };

        function changeTrademark() {
            if(vm.sw1 === true){
                vm.changeModel = "1";
            }else{
                vm.changeModel = "";
            }
        }

        function onBrandSelect(element) {
            vm.modelo = null;
            vm.marca = element;
            vm.catalogues.modelo_by_marca.catalog.url = URLS.marca + '/models/' + element;
        }

        function onElementSelect(element, field) {
            vm.cabinet[field] = element;
        }

        function accept() {
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
            //vm.cabinet['insumo_id'] = 25;
            //vm.cabinet['pedimento_id'] = 1;
            //vm.cabinet['posicionamiento_id'] = 1;
            //vm.cabinet['sucursal_id'] = 1;
            //vm.cabinet['categoria_id'] = 1;

            validate = _.contains(_.values(vm.cabinet), undefined);

            if(validate){
                toastr.error("Llene corectamente todos los campos");
            }else{

                cabinetUC.update(vm.economico, vm.cabinet)
                    .then(function (res) {
                        $mdDialog.hide(res);
                    })
                    .catch(function (err) {
                        ErrorHandler.errorTranslate(err);
                        $mdDialog.hide(err);
                    });
            }
        }

        function cerrar() {
            $mdDialog.cancel(null);
        }

        function remove() {
            vm.confirmation = "confirma";
        }

        function acceptConfirm() {
            cabinetUC.dlete(vm.economico)
                .then(function (res) {
                    toastr.success(vm.successDeleteMessage, vm.successTitle);
                    $mdDialog.hide(res);
                })
                .catch(function (err) {
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                    $mdDialog.hide(err);
                });
        }

        function cancelConfirm() {
            $mdDialog.cancel(null);
        }


    }

})();
