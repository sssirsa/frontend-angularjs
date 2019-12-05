(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint')
        .controller('changeAttentionController', changeAttentionController);

    /* @ngInject */
    function changeAttentionController(
        User,
        REQUESTS,
        ATTENTIONS,
        toastr,
        $log,
        $state,
        $stateParams,
        Translate,
        Stores,
        Persona_Admin,
        Geolocation,
        SCORES,
        cabinetUC,
        ErrorHandler,
        Helper,
        $scope,
        $mdDialog,
        EnvironmentConfig,
        URLS,
        PAGINATION) {

        var vm = this;

        //Variable declaration
        vm.user = User.getUser();
        vm.id = $stateParams.id;

        vm.statusNew = 'Atendida';
        vm.user = null;
        vm.request = null;
        vm.solicitudDetalles = null;
        vm.store = null;
        vm.km = null;
        vm.insumos = null;
        vm.improductivo = !null;
        vm.visible = !null;
        vm.insumosUsados = [];
        vm.evidenciaNueva = [];
        vm.firmaC = [];
        vm.firmaT = [];
        vm.fileValidations = {
            size: {
                max: '5MB',
                min: '10B'
            }
        };

        vm.todosprev = vm.todosprev2;
        vm.todos = vm.todosex;
        vm.loadingPromise = null;
        vm.toModel = null;
        vm.searchText = '';
        vm.searchBool = false;

        vm.promiseLoader = null;

        //Constants declaration
        vm.storeSegmentation = []; //TODO: Update with API callback
        vm.scores = SCORES;
        vm.aceptButton = Translate.translate('MAIN.BUTTONS.ACCEPT');
        vm.cancelButton = Translate.translate('MAIN.BUTTONS.CANCEL');
        vm.dialogRestoreTitle = Translate.translate('MAIN.DIALOG.ATTENTION_TITLE');
        vm.dialogRestoreMessage = Translate.translate('MAIN.DIALOG.ATTENTION_MESSAGE');

        //Declaración de funciones
        vm.changeProductivo = changeProductivo;
        vm.filesSelected = filesSelected;
        vm.enviar = enviar;
        vm.searchCabinet = searchCabinet;
        vm.removeFilter = removeFilter;
        vm.createCabinet = createCabinet;

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
                    validations: {
                        errors: {
                            required: 'El campo es requerido.'
                        }
                    },
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + URLS.management.base
                            + '/' + URLS.management.catalogues.base
                            + '/' + URLS.management.catalogues.cabinet_brand,
                        name: 'Marca',
                        model: 'id',
                        option: 'nombre',
                        loadMoreButtonText: 'Cargar mas...',
                        elements: 'results',
                        pagination: {
                            total: PAGINATION.total,
                            limit: PAGINATION.limit,
                            offset: PAGINATION.offset,
                            pageSize: PAGINATION.pageSize
                        },
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    required: true
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
                        query: 'marca__id',
                        requires: 'marca',
                        name: 'Modelo',
                        model: 'id',
                        option: 'nombre',
                        elements: 'results',
                        pagination: {
                            total: PAGINATION.total,
                            limit: PAGINATION.limit,
                            offset: PAGINATION.offset,
                            pageSize: PAGINATION.pageSize
                        },
                        loadMoreButtonText: 'Cargar mas...',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    required: true
                },
                {
                    type: 'catalog',
                    model: 'condicion_id',
                    label: 'Condición del cabinet',
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + URLS.management.base
                            + '/' + URLS.management.catalogues.base
                            + '/' + URLS.management.catalogues.condition,
                        name: 'Condición',
                        model: 'id',
                        option: 'letra',
                        loadMoreButtonText: 'Cargar mas...',
                        pagination: {
                            total: PAGINATION.total,
                            limit: PAGINATION.limit,
                            offset: PAGINATION.offset,
                            pageSize: PAGINATION.pageSize
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
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
                            total: PAGINATION.total,
                            limit: PAGINATION.limit,
                            offset: PAGINATION.offset,
                            pageSize: PAGINATION.pageSize
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
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

        function onBrandSelect(element) {
            vm.modelo = null;
            vm.marca = element;
            vm.catalogues.modelo_by_marca.catalog.query = element;
        }

        activate();

        function activate() {
            vm.visible = false;

            vm.loadingPromise = ATTENTIONS.getAttention(vm.id)
                .then(function (requestSuccess) {
                    vm.request = requestSuccess;
                    vm.user = vm.request.solicitud.persona;
                    vm.store = vm.request.solicitud.establecimiento;
                    vm.km = vm.request.km;
                    vm.solicitudDetalles = vm.request.solicitud;

                    switch (vm.request.status) {
                        case 'Abierta':
                            vm.visible = true;
                            break;

                        case 'En_proceso':
                            vm.visible = true;
                            break;

                        case 'Asignada':
                            vm.visible = true;
                            break;

                        default:
                            vm.visible = false;
                            break;
                    }
                    
                    if(vm.visible &&!vm.user.sucursal && !vm.user.udn){
                        toastr.warning(Translate.translate('ATTENTION.DETAIL.ERRORS.ADMIN_USER'));
                    }
                    urlEvidencia();
                    convertImages();
                    convertFirm();

                })
                .catch(function (errorRequest) {
                    $log.error(errorRequest);
                    ErrorHandler.errorTranslate(errorRequest);
                });
        }


        function urlEvidencia() {
            if(vm.solicitudDetalles.evidencia){
                angular.forEach(vm.solicitudDetalles.evidencia, function (evidence) {
                    evidence.url = evidence.foto;
                });
            }
        }

        function convertFirm() {
            if(vm.request.firma_cliente){
                var firmClient = [{url: vm.request.firma_cliente, foto: vm.request.firma_cliente}];
                vm.request.firma_cliente = firmClient;
            }

            if(vm.request.firma_tecnico){
                var firmTec = [{url: vm.request.firma_tecnico, foto: vm.request.firma_tecnico}];
                vm.request.firma_tecnico = firmTec;
            }
        }


        function convertImages() {
            var evidences = vm.request.evidencia;
            angular.forEach(evidences, function (evidence) {
                evidence.url = evidence.foto;
            });
            vm.request.evidencia = evidences;
        }

        function changeProductivo() {
            vm.improductivo = !vm.improductivo;

            if(vm.insumos){
                angular.forEach(vm.insumos.results, function (value) {
                    value.check = false;
                    value.usado = 0;
                });
            }
        }

        function enviar(){
            if(!vm.user.sucursal && !vm.user.udn){
                toastr.error(Translate.translate('ATTENTION.DETAIL.ERRORS.ADMIN_USER'));
            }
            if(validar()){
                vm.insumosUsados = [];

                if (vm.improductivo === true) {
                    var economico = [];

                    if(!vm.request.observaciones_cliente){
                        vm.request.observaciones_cliente = "Sin observaciones";
                    }

                    if(!vm.request.observaciones_tecnico){
                        vm.request.observaciones_tecnico = "Sin observaciones";
                    }

                    if(!vm.request.calificacion){
                        vm.request.calificacion = 0;
                    }

                    vm.objetoAtencion = {
                        cabinets: economico,
                        descripcion_trabajo: vm.request.tipo,
                        observaciones_cliente: vm.request.observaciones_cliente,
                        observaciones_tecnico: vm.request.observaciones_tecnico,
                        km: vm.km,
                        firma_cliente: vm.firmaC,
                        firma_tecnico: vm.firmaT,
                        evidencia: vm.evidenciaNueva,
                        calificacion: vm.request.calificacion,
                        cancelacion: false,
                        status:'Atendida
                    };

                    confirmacion(vm.objetoAtencion);
                }else{
                    vm.objetoAtencion = {
                        cancelacion: true,
                        km: vm.km
                    };

                    confirmacion(vm.objetoAtencion);
                }
            }
        }

        function validar(){
            var cont = 0;

            if(vm.evidenciaNueva.length === 0){
                toastr.error(Translate.translate('Se requiere de al menos una evidencia'));
                cont++;
            }

            if(!vm.km){
                toastr.error(Translate.translate('El campo de km es requerido'));
                cont++;
            }

            if(cont === 0){
                return true;
            }else{
                return false;
            }
        }

        function confirmacion(data) {
            var confirm = $mdDialog.confirm()
                .title(vm.dialogRestoreTitle)
                .textContent(vm.dialogRestoreMessage)
                .ariaLabel('Confirmar')
                .ok(vm.aceptButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function () {
                vm.promiseLoader = ATTENTIONS.performChangeAttention(vm.request.folio, data)
                    .then(function (result) {
                        $log.debug(result);
                        toastr.success(Translate.translate('SUCCESS.UPDATE'));
                        $state.go('triangular.admin-default.serviceList', {runListPendientes:true});
                    })
                    .catch(function (resultError) {
                        ErrorHandler.errorTranslate(resultError);
                    });
            }, function () {

            });
        }

        function filesSelected(files, num) {
            if(num === 1){
                vm.evidenciaNueva = [];
            }

            angular.forEach(files, function (image) {
                var base64Image = null;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(image);
                fileReader.onloadend = function () {
                    base64Image = fileReader.result;

                    switch (num){
                        case 1:
                            vm.evidenciaNueva.push({foto: base64Image});
                            break;

                        case 2:
                            vm.firmaC = null;
                            vm.firmaC = base64Image.toString();
                            break;

                        case 3:
                            vm.firmaT = null;
                            vm.firmaT = base64Image;
                            break;
                    }
                };
            });
        }

        function showinList(data) {
            vm.todos = [];
            vm.todos.push(data);
        }

        function prepareData(data) {
            data.marca = data.modelo.marca.nombre;
            data.id_modelo = data.modelo.id;
            data.modelo = data.modelo.nombre;

            if (data.deleted === false) {
                data.estado = 'Activo';
            } else {
                data.estado = 'Inactivo';
            }

            showinList(data);
        }

        function searchCabinet() {
            cabinetUC.getByID(vm.searchText)
                .then(function (cabinet) {
                    prepareData(cabinet);
                    vm.searchBool = true;
                })
                .catch(function (error) {
                    ErrorHandler.errorTranslate(error);
                    vm.searchBool = true;
                    vm.todos = [];
                });
        }

        function removeFilter() {
            vm.searchBool = false;
            vm.todosprev = null;
            vm.todos = [];
            vm.searchText = null;
        }

        function createCabinet(economico) {
            console.log("Creado and Reload");
            vm.createCabinetDialog.fields[0].initial_value = economico;
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
                vm.searchText = successCallback.economico;
                searchCabinet();
            }).catch(function errorCreateCabinet(errorCallback) {
                if (errorCallback) {
                    ErrorHandler.errorTranslate(errorCallback);
                }
            });
        }
    }
})();
