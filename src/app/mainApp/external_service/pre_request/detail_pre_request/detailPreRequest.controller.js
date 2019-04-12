(function () {
    'use strict';

    angular
        .module('app.mainApp.external_service.pre_request')
        .controller('detailPreRequestController', detailPreRequestController);

    function detailPreRequestController(preRequests, $stateParams, cabinetUC, Translate, Helper, $state, ErrorHandler, toastr,
    EnvironmentConfig, URLS, $mdDialog) {

        var vm = this;

        //Listado de Variables
        vm.preRequest = {};
        vm.photos = [];
        vm.images = [];
        vm.errorMessage = '';
        vm.showCabinet = false;
        vm.cabinet = [];
        vm.request = {
            id: "",
            cabinet: ""
        };
        vm.cabinetExist = true;

        //listado de constantes

        vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.cabinetNotFound = Translate.translate('PREREQUEST_TRANSLATE.MSG.CABINET_NOT_FOUND');
        vm.unexpected = Translate.translate('PREREQUEST_TRANSLATE.MSG.UNEXPECTED');
        vm.creationsuccess = Translate.translate('PREREQUEST_TRANSLATE.MSG.CREATION_SUCCESFULL');
        vm.cancelationsuccess = Translate.translate('PREREQUEST_TRANSLATE.MSG.CANCELATION_SUCCESFULL');
        vm.preRequestnotFound = Translate.translate('PREREQUEST_TRANSLATE.MSG.PREREQUESTNOTFOUND');


        //Listado de funciones
        vm.getinfo = getinfo;
        vm.showStoreLocation = showStoreLocation;
        vm.cancelPreRequest = cancelPreRequest;
        vm.createRequest = createRequest;
        vm.back = back;

        vm.createCabinetDialog = {
            fields: [
                {
                    type: 'text',
                    model: 'economico',
                    label: 'Económico',
                    initial_value: '',
                    lock: true
                },
                {
                    type: 'text',
                    model: 'no_serie',
                    label: 'Número de serie',
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
                        loadMoreButtonText: 'Cargar mas...',
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
                        loadMoreButtonText: 'Cargar mas...'
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
                        loadMoreButtonText: 'Cargar mas...',
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
            preRequests.getByID($stateParams.id)
                .then(function infoPre(elementPreRequest) {
                    vm.preRequest = elementPreRequest;

                    conditioninGallery();
                    getinfoCabinet(vm.preRequest.cabinet);
                })
                .catch(function (errCarga) {
                    toastr.warning(vm.preRequestnotFound, vm.errorTitle);
                });

        }

        function getinfoCabinet(id) {
            cabinetUC.getByID(id)
                .then(function InfoCabinet(info) {
                })
                .catch(function errorInfo(errInfo) {
                    vm.cabinetExist = false;
                    ErrorHandler.errorTranslate(errInfo);
                });
        }

        //vm.photos=vm.preRequest.fotos;
        function conditioninGallery() {
            if (vm.preRequest.fotos.length > 0) {
                vm.preRequest.fotos.forEach(function (foto, index) {
                    var fototmp = {
                        id: index + 1,
                        url: foto.foto
                    };
                    vm.photos.push(fototmp);
                });
            }
            //console.log(vm.photos);

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
                var cabinetID = successCallback.economico;
                vm.cabinetExist = true;
                console.log(cabinetID);
            }).catch(function errorCreateCabinet(errorCallback) {
                if (errorCallback) {
                    vm.cabinetExist = false;
                    ErrorHandler.errorTranslate(errorCallback);
                }
            });
        };

        function createRequest() {

            vm.request.id = vm.preRequest.id;
            vm.request.cabinet = vm.preRequest.cabinet;
            var promiseCreateRequest = preRequests.createRequest(vm.request);
            promiseCreateRequest.then(function (requestCreada) {
                //toastr.success(vm.creationsuccess, vm.successTitle);
                ErrorHandler.successCreation();
                //  console.log(requestCreada);
                $state.go('triangular.admin-default.preRequest');

            }).catch(function (err) {
                //toastr.warning(vm.unexpected, vm.errorTitle);
                ErrorHandler.errorTranslate(err);
                console.log(err);
            });


        }

        function cancelPreRequest() {
            vm.preRequest.cancelacion = true;
            vm.preRequest.establecimiento_id = vm.preRequest.establecimiento.no_cliente;
            var prereqSinFoto = _.omit(vm.preRequest, 'fotos');
            var promiseCancelPreRequest = preRequests.update(prereqSinFoto);
            promiseCancelPreRequest.then(function (requestCancel) {
                ErrorHandler.successCancel();
                //toastr.success(vm.cancelationsuccess, vm.successTitle);
                // console.log(requestCancel);
                $state.go('triangular.admin-default.preRequest');

            }).catch(function (err) {
                ErrorHandler.errorTranslate(err);

            });

        }

        function back() {
            $state.go('triangular.admin-default.pre-request');
        }


    }
})();
