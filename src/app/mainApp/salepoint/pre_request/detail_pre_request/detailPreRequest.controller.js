(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint.pre_request')
        .controller('detailPreRequestController', detailPreRequestController);

    function detailPreRequestController(
        PREREQUESTS,
        $stateParams,
        cabinetUC,
        Translate,
        Helper,
        $state,
        ErrorHandler,
        toastr,
        EnvironmentConfig,
        URLS,
        $mdDialog,
        Geolocation,
        User,
        _,
        $log
    ) {

        var vm = this;
        vm.user = User.getUser();

        //Listado de funciones
        vm.getinfo = getinfo;
        vm.showStoreLocation = showStoreLocation;
        vm.cancelPreRequest = cancelPreRequest;
        vm.createRequest = createRequest;
        vm.back = back;

        //Listado de Variables
        vm.preRequest = {};
        vm.photos = [];
        vm.request = {};
        vm.cabinetExist = true;
        vm.infoCabinet = {};

        vm.catalogSucursal = {
            catalog: {
                url: EnvironmentConfig.site.rest.api
                + '/' + URLS.management.base
                + '/' + URLS.management.catalogues.base
                + '/' + URLS.management.catalogues.subsidiary,
                kind: 'Generic',
                name: Translate.translate('PRE_REQUEST.SUBSIDIARY.SELECT'),
                loadMoreButtonText: Translate.translate('PRE_REQUEST.BUTTONS.LOAD_MORE'),
                model: 'id',
                option: 'nombre'
            },
            elements: 'results'

        };

        vm.createCabinetDialog = {
            fields: [
                {
                    type: 'text',
                    model: 'economico',
                    label: Translate.translate('PRE_REQUEST.CABINET.ECONOMIC'),
                    initial_value: '',
                    lock: true
                },
                {
                    type: 'text',
                    model: 'no_serie',
                    label: Translate.translate('PRE_REQUEST.CABINET.SERIAL_NUMBER'),
                    required: true,
                    hint: 'Número de serie del cabinet',
                    validations: {
                        errors: {
                            required: 'El número de serie es obligatorio'
                        }
                    }
                },
                {
                    type: 'text',
                    model: 'year',
                    label: 'Año',
                    required: true,
                    hint: 'Año de fabricación del cabinet',
                    validations: {
                        regex: '(19|20)[0-9]{2}',
                        errors: {
                            regex: 'Formato inválido de año',
                            required: 'El año es obligatorio'
                        }
                    }
                },
                {
                    type: 'text',
                    model: 'id_unilever',
                    label: 'Activo Unilever',
                    required: true,
                    hint: 'Número de identificación utilizado por Unilever',
                    validations: {
                        regex: '[a-zA-Z0-9]+',
                        errors: {
                            regex: 'Solo caracteres alfanuméricos',
                            required: 'El activo unilever'
                        }
                    }
                },
                {
                    type: 'catalog',
                    model: 'marca',
                    label: 'Marca del cabinet',
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.cabinet_brand,
                        name: 'Marca',
                        model: 'id',
                        option: 'descripcion',
                        loadMoreButtonText: Translate.translate('PRE_REQUEST.BUTTONS.LOAD_MORE'),
                        elements: 'results',
                        pagination: {}
                    },
                    required: true,
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                {
                    type: 'catalog',
                    model: 'modelo_id',
                    label: 'Modelo del cabinet',
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.cabinet_model,
                        query: '?marca__id=',
                        requires: 'marca',
                        name: 'Modelo',
                        model: 'id',
                        option: 'nombre',
                        elements: 'results',
                        pagination: {},
                        loadMoreButtonText: Translate.translate('PRE_REQUEST.BUTTONS.LOAD_MORE')
                    },
                    required: true,
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                {
                    type: 'catalog',
                    model: 'categoria_id',
                    label: 'Categoría',
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.category,
                        name: 'Categoría del cabinet',
                        model: 'id',
                        option: 'nombre',
                        loadMoreButtonText: Translate.translate('PRE_REQUEST.BUTTONS.LOAD_MORE'),
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        elements: 'results'
                    },
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                }
            ],
            dialog: {
                title: 'Información del cabinet',
                okButton: 'Guardar',
                cancelButton: 'Cancelar',
                loading: 'Creando cabinet'
            },
            url: EnvironmentConfig.site.rest.api
            + '/' + URLS.management.base
            + '/' + URLS.management.inventory.base
            + '/' + URLS.management.inventory.cabinet
        };


        getinfo();


        function getinfo() {
            PREREQUESTS.getPreRequestByID($stateParams.id)
                .then(function infoPre(elementPreRequest) {
                    vm.preRequest = elementPreRequest;
                    $log.log(vm.preRequest);
                    convertImages();
                    getinfoCabinet(vm.preRequest.cabinet);
                })
                .catch(function errInfoPre() {
                    toastr.warning(Translate.translate('PREREQUEST_TRANSLATE.MSG.PREREQUESTNOTFOUND'),
                                   Translate.translate('MAIN.MSG.ERROR_TITLE'));
                });

        }

        function getinfoCabinet(id) {
            cabinetUC.getByID(id)
                .then(function infoCabinet(infoCabinet) {
                    vm.infoCabinet = infoCabinet;
                })
                .catch(function errorInfoCabinet(errInfo) {
                    vm.cabinetExist = false;
                    ErrorHandler.errorTranslate(errInfo);
                });
        }

        function convertImages() {
            var evidences = vm.preRequest.fotos;
            angular.forEach(evidences, function (evidence) {
                evidence.url = evidence.foto;
            });
            vm.preRequest.fotos = evidences;
        }


        function showStoreLocation() {
            Geolocation.locate(vm.preRequest.establecimiento.latitud, vm.preRequest.establecimiento.longitud);
        }

        vm.createCabinet = function createCabinet(cabinetID) {
            vm.createCabinetDialog.fields[0].initial_value = cabinetID;
            $mdDialog.show({
                controller: 'CatalogCreateDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/catalogManager/dialogs/createDialog/createDialog.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    dialog: vm.createCabinetDialog.dialog,
                    fields: vm.createCabinetDialog.fields,
                    url: vm.createCabinetDialog.url
                }
            }).then(function successCreateCabinet(successCallback) {
                vm.preRequest.cabinet = successCallback.economico;
                vm.cabinetExist = true;
            }).catch(function errorCreateCabinet(errorCallback) {
                if (errorCallback) {
                    vm.cabinetExist = false;
                    ErrorHandler.errorTranslate(errorCallback);
                }
            });
        };

        function createRequest() {
            vm.request.id = vm.preRequest.id;
            vm.request.cabinet_id = vm.preRequest.cabinet;


            PREREQUESTS.createRequest(vm.request)
                .then(function createRe(requestCreada) {
                    ErrorHandler.successCreation(requestCreada);
                    $state.go('triangular.admin-default.pre-request');
                })
                .catch(function errCreateRe(err) {
                    ErrorHandler.errorTranslate(err);
                });
        }

        function cancelPreRequest() {
            vm.preRequest.cancelacion = true;
            vm.preRequest.establecimiento_id = vm.preRequest.establecimiento.no_cliente;
            var prereqSinFoto = _.omit(vm.preRequest, 'fotos');

            PREREQUESTS.updatePreRequest(prereqSinFoto)
                .then(function cancelPre (requestCancel) {
                    ErrorHandler.successCancel(requestCancel);
                    $state.go('triangular.admin-default.pre-request');
                })
                .catch(function errCancelPre(err) {
                    ErrorHandler.errorTranslate(err);
                });

        }

        function back() {
            $state.go('triangular.admin-default.pre-request');
        }


    }
})();
