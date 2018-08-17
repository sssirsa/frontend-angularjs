(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('DetailAttentionPageController', DetailAttentionPageController);

    /* @ngInject */
    function DetailAttentionPageController($log, $state, $stateParams, toastr, Translate, SalePointRequests, Stores,
                                         Persona_Admin, Geolocation, STORE_SEGMENTATION, SCORES, atencionPV,
                                           cabinetPV, ErrorHandler, Helper, $scope, MarcaCabinet, ModeloCabinet,$mdDialog) {
        var vm = this;

        //Variable declaration
        vm.id = $stateParams.id;
        vm.kindAtention = $stateParams.tipo;

        vm.statusNew = "Atendida";
        vm.cancelacion = false;
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

        vm.objetoAtencion = [{
            cabinets: [],
            descripcion_trabajo: "",
            observaciones_cliente: "",
            observaciones_tecnicas: "",
            km: "",
            firma_cliente: [],
            firma_prospectador: [],
            insumos: [],
            insumos_lote: [],
            calificacion: 0
        }];

        //Constants declaration
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.scores = SCORES;
        vm.aceptButton = Translate.translate('MAIN.BUTTONS.ACCEPT');
        vm.cancelButton = Translate.translate('MAIN.BUTTONS.CANCEL');
        vm.dialogRestoreTitle = Translate.translate('MAIN.DIALOG.ATTENTION_TITLE');
        vm.dialogRestoreMessage = Translate.translate('MAIN.DIALOG.ATTENTION_MESSAGE');

        //Declaración de funciones
        vm.changeProductivo = changeProductivo;
        vm.filesSelected = filesSelected;
        vm.insumoSelect = insumoSelect;
        vm.validaMax = validaMax;
        vm.enviar = enviar;

        activate();

        function activate() {
            if(vm.kindAtention == 'all'){
                vm.visible = false;
            }else{
                vm.visible = true;
            }

            vm.loadingPromise = atencionPV.getByID(vm.id)
                .then(function (requestSuccess) {
                    vm.request = requestSuccess;
                    vm.user = requestSuccess.tecnico;
                    vm.store = requestSuccess.establecimiento;

                    SalePointRequests.getByID(vm.id)
                        .then(function (requestSuccess2) {
                            $log.debug(requestSuccess2);
                            vm.solicitudDetalles = requestSuccess2;

                            if(vm.request.tipo == 'Medio'){
                                insumos();
                            }

                        })
                        .catch(function (errorRequest2) {
                            $log.error(errorRequest2);
                            toastr.error(Translate.translate('REQUESTS.DETAIL.TOASTR.ERROR_PV'));
                        });

                    convertImages();

                })
                .catch(function (errorRequest) {
                    $log.error(errorRequest);
                    toastr.error(Translate.translate('REQUESTS.DETAIL.TOASTR.ERROR_PV'));
                });
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

        function insumoSelect(insumo) {
            insumo.check = !insumo.check;
        }

        function insumos() {
            atencionPV.getInsumos(vm.solicitudDetalles.cabinet)
                .then(function (respuesta) {
                    vm.insumos = respuesta;
                    var aux = null;

                    angular.forEach(vm.insumos.results, function (value) {
                        value.check = false;
                        value.usado = 0;
                        value.error = null;


                        if(parseInt(value.cantidad) === 0){
                            aux = 0;
                        }else if(parseInt(value.tipos_equipo[0].cantidad) > parseInt(value.cantidad) && parseInt(value.cantidad) > 0){
                            aux = parseInt(value.cantidad);
                        }else if(parseInt(value.tipos_equipo[0].cantidad) < parseInt(value.cantidad) && parseInt(value.cantidad) > 0){
                            aux = parseInt(value.tipos_equipo[0].cantidad);
                        }

                        value.insumoMax = aux;

                    });
                })
                .catch(function (errorRespuesta) {
                    ErrorHandler.errortranslate(errorRespuesta);
                });
        }

        function validaMax(insumo){
            if(insumo.usado > insumo.insumoMax){
                insumo.error = true;
                insumo.usado = insumo.insumoMax;
            }else{
                insumo.error = false;
            }
        }

        function enviar(){

            if(vm.evidenciaNueva.length === 0 || vm.km === null){

                if(vm.evidenciaNueva.length === 0){
                    toastr.error(Translate.translate('Se requiere de al menos una evidencia'));
                }

                if(vm.km === null){
                    toastr.error(Translate.translate('El campo de km es requerido'));
                }

            }else {
                vm.insumosUsados = [];

                if (vm.improductivo === true) {
                    angular.forEach(vm.insumos.results, function (valor) {
                        if (valor.check === true) {
                            if (valor.usado > valor.insumoMax) {
                                valor.usado = valor.insumoMax;
                            }

                            var aux = {
                                catalogo_insumos: valor.id,
                                cantidad: valor.usado
                            };

                            vm.insumosUsados.push(aux);
                        }
                    });
                }else{
                    vm.statusNew = "Improductiva";
                    vm.cancelacion = true;

                    vm.objetoAtencion = {
                        cancelacion: true,
                        km: vm.km
                    };
                }

                var economico = [];
                if (vm.todosSeleccionado.length === 0) {
                    economico.push(vm.solicitudDetalles.cabinet);
                } else {
                    economico.push(vm.todosSeleccionado[0].economico);
                }

                vm.objetoAtencion = {
                    cabinets: economico,
                    descripcion_trabajo: vm.request.tipo,
                    observaciones_cliente: vm.request.observaciones_cliente,
                    observaciones_tecnicas: vm.request.observaciones_tecnico,
                    km: vm.km,
                    firma_cliente: vm.firmaC,
                    firma_prospectador: vm.firmaT,
                    insumos: [],
                    insumos_lote: vm.insumosUsados,
                    evidencia: vm.evidenciaNueva,
                    calificacion: vm.request.calificacion,
                    //status: vm.statusNew,
                    cancelacion: vm.cancelacion
                };

                confirmacion();

            }

        }

        function confirmacion() {
            var confirm = $mdDialog.confirm()
                .title(vm.dialogRestoreTitle)
                .textContent(vm.dialogRestoreMessage)
                .ariaLabel('Confirmar')
                .ok(vm.aceptButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function () {
                console.log("Objeto final", vm.objetoAtencion);
                atencionPV.putActualiza(vm.request.folio, vm.objetoAtencion)
                    .then(function (result) {
                        toastr.success(result);
                    })
                    .catch(function (resultError) {
                        ErrorHandler.errortranslate(resultError);
                    });
            }, function () {

            });
        }

        /*function showStoreLocation() {
            Geolocation.locate(vm.store.latitud, vm.store.longitud);
        }*/

        function filesSelected(files, num) {
            console.log(files, num);
            if(num === 1) {
                vm.evidenciaNueva = [];
                angular.forEach(files, function (image) {
                    var base64Image = null;
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(image);
                    fileReader.onloadend = function () {
                        base64Image = fileReader.result;
                        vm.evidenciaNueva.push({foto: base64Image});
                    };
                });
            }else if(num === 2){
                vm.firmaC = [];
                angular.forEach(files, function (image) {
                    var base64Image = null;
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(image);
                    fileReader.onloadend = function () {
                        base64Image = fileReader.result;
                        vm.firmaC.push({foto: base64Image});
                    };
                });

            }else if(num === 3){
                vm.firmaT = [];
                angular.forEach(files, function (image) {
                    var base64Image = null;
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(image);
                    fileReader.onloadend = function () {
                        base64Image = fileReader.result;
                        vm.firmaT.push({foto: base64Image});
                    };
                });
            }
        }


        //codigo para listar cabinets
        vm.todosprev = null;
        vm.todos = [];
        vm.todosSeleccionado = [];
        vm.loadingPromise = null;
        vm.limit = 20;
        vm.offset = 0;
        vm.searchText = '';
        vm.cabinetSelected = {
            economico: null,
            no_serie: null,
            marca: null,
            modelo_id: null,
            antiguedad: null
        };
        vm.marca = null;
        vm.isSelected = false;
        vm.isUsed = false;
        vm.cabinetUsed = null;
        var cabinetTemporal = null;

        var models = null;

        vm.listcabinets = listcabinets;
        vm.selectCabinet = selectCabinet;
        vm.filterCabinets = filterCabinets;
        vm.cleanForm = cleanForm;
        vm.listMarcas = listMarcas;
        vm.listModelos = listModelos;
        vm.changeTrademark = changeTrademark;
        vm.seleccion = seleccion;
        vm.accept = accept;
        vm.unUsedCabinet = unUsedCabinet;

        listMarcas();
        listModelos();
        listcabinets();


        function unUsedCabinet() {
            cabinetTemporal = null;
            vm.isUsed = false;
            cleanForm();
        }

        function seleccion() {
            vm.todosSeleccionado = [];
            console.log('cabinet a usar: ', cabinetTemporal);
            vm.todosSeleccionado.push(cabinetTemporal);
            vm.isUsed = true;
        }

        function accept() {
            console.log('CREACION DE CABINET');
            var aux = {
                economico: vm.cabinetSelected.economico,
                modelo_id: vm.cabinetSelected.modelo_id,
                no_serie: vm.cabinetSelected.no_serie.toUpperCase(),
                antiguedad: vm.cabinetSelected.antiguedad.toUpperCase()
            };
            cabinetPV.create(aux)
                .then(function (res) {
                    console.log(res);
                    cabinetTemporal = res;
                    ErrorHandler.succcesCreation();
                })
                .catch(function (err) {

                    ErrorHandler.errortranslate(err);
                });
        }

        function listMarcas(){
            vm.loadingPromise = MarcaCabinet.listPromise(1000,0)
                .then(function (res) {
                    res = res.results;
                    vm.marcas = Helper.filterDeleted(res, true);
                })
                .catch(function (err) {

                });
        }

        function listModelos() {
            vm.loadingPromise = ModeloCabinet.listWitout(1000,0)
                .then(function (res) {
                    res = res.results;
                    models = Helper.filterDeleted(res, true);
                })
                .catch(function(err){

                });
        }

        function changeTrademark() {
            if (!vm.isSelected) {
                vm.marca = vm.cabinetSelected.marca;
            }
            vm.modelos = null;
            vm.modelos = _.where(models, {marca: parseInt(vm.marca)});
        }


        function selectCabinet(cabinet) {
            console.log(cabinet);
            vm.isSelected = true;
            vm.marca = cabinet.modelo.marca;
            cabinetTemporal = cabinet;
            changeTrademark();
            vm.cabinetSelected = {
                economico: cabinet.economico,
                no_serie: cabinet.no_serie,
                marca: cabinet.modelo.marca,
                modelo_id: cabinet.modelo_id,
                antiguedad: cabinet.antiguedad
            };
        }

        function cleanForm() {
            vm.modelos = null;
            vm.cabinetSelected = {
                economico: null,
                no_serie: null,
                marca: null,
                modelo_id: null,
                antiguedad: null
            };
            vm.isSelected = false;
            $scope.newcabinetFrom.$setPristine();
            $scope.newcabinetFrom.$setUntouched();
        }

        function filterCabinets() {
            vm.todos = [];
            vm.todos = _.filter(vm.todosprev, function (cabinet) {
                if (!angular.isString(vm.searchText) || vm.searchText === ''){
                    return true;
                }
                return cabinet.economico.toLowerCase().indexOf(vm.searchText.toLowerCase()) >= 0;
            });
        }

        function listcabinets(){
            var ux = "Activo";

            vm.loadingPromise = cabinetPV.list(1000, 0)
                .then(function (res) {
                    res = res.results;
                    vm.todosprev = Helper.filterDeleted(res, true);

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
                })
                .catch(function (err) {

                });
        }
        //codigo para listar cabinets

    }
})();
