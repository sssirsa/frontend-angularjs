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
        vm.promiseLoader = null;

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
        vm.filesSelected2 = filesSelected2;
        vm.filesSelected3 = filesSelected3;
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
                    vm.km = requestSuccess.km;

                    vm.loadingPromise2 = SalePointRequests.getByID(vm.id)
                        .then(function (requestSuccess2) {
                            $log.debug(requestSuccess2);
                            vm.solicitudDetalles = requestSuccess2;

                            console.log("Solicitud", vm.solicitudDetalles);
                            urlEvidencia();

                            console.log("evidencias Atención", vm.request.evidencia);
                            console.log("evidencias Solicitud", vm.solicitudDetalles.evidencia);

                            if(vm.request.tipo == 'Medio'){
                                insumos();
                            }else{
                                listMarcas();
                                listModelos();
                                listcabinets();
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


        function urlEvidencia() {
            if(vm.solicitudDetalles.evidencia.length >0){
                angular.forEach(vm.solicitudDetalles.evidencia, function (evidence) {
                    vm.evidenciaAux = [];
                    var auxE = {
                        id: evidence.id,
                        foto: evidence.foto,
                        atencion: evidence.atencion,
                        solicitud: evidence.solicitud,
                        pre_solicitud: evidence.pre_solicitud,
                        url: evidence.foto
                    };
                    vm.evidenciaAux.push(auxE);
                });

                vm.solicitudDetalles.evidencia = vm.evidenciaAux;
                vm.evidenciaAux = [];
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

        function insumoSelect(insumo) {
            insumo.check = !insumo.check;
        }

        function insumos() {
            if(vm.request.status === "Atendida"){
                angular.forEach(vm.request.insumos_lote,function (valor) {
                    valor.cantidad = parseInt(valor.cantidad);
                });
            }else {
                atencionPV.getInsumos(vm.solicitudDetalles.cabinet)
                    .then(function (respuesta) {
                        vm.insumos = respuesta;
                        var aux = null;

                        angular.forEach(vm.insumos.results, function (value) {
                            value.check = false;
                            value.usado = 0;
                            value.error = null;


                            if (parseInt(value.cantidad) === 0) {
                                aux = 0;
                            } else if (parseInt(value.tipos_equipo[0].cantidad) > parseInt(value.cantidad) && parseInt(value.cantidad) > 0) {
                                aux = parseInt(value.cantidad);
                            } else if (parseInt(value.tipos_equipo[0].cantidad) < parseInt(value.cantidad) && parseInt(value.cantidad) > 0) {
                                aux = parseInt(value.tipos_equipo[0].cantidad);
                            }

                            value.insumoMax = aux;

                        });
                    })
                    .catch(function (errorRespuesta) {
                        ErrorHandler.errortranslate(errorRespuesta);
                    });
            }
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
            if(validar()){
                vm.insumosUsados = [];

                if (vm.improductivo === true) {
                    var economico = [];

                    if(vm.request.tipo === "Medio"){
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

                        economico.push(vm.solicitudDetalles.cabinet);
                    }else{
                        economico.push(vm.todosSeleccionado[0].economico);
                    }

                    if(vm.request.observaciones_cliente === null){
                        vm.request.observaciones_cliente = "Sin observaciones";
                    }

                    if(vm.request.observaciones_tecnico === null){
                        vm.request.observaciones_tecnico = "Sin observaciones";
                    }

                    if(vm.request.calificacion === null){
                        vm.request.calificacion = 0;
                    }

                    if(vm.request.tipo === "Medio"){
                        vm.objetoAtencion = {
                            cabinets: economico,
                            descripcion_trabajo: vm.request.tipo,
                            observaciones_cliente: vm.request.observaciones_cliente,
                            observaciones_tecnicas: vm.request.observaciones_tecnico,
                            km: vm.km,
                            firma_cliente: vm.firmaC,
                            firma_tecnico: vm.firmaT,
                            insumos: [],
                            insumos_lote: vm.insumosUsados,
                            evidencia: vm.evidenciaNueva,
                            calificacion: vm.request.calificacion,
                            //status: vm.statusNew,
                            cancelacion: false
                        };
                    }else{
                        vm.objetoAtencion = {
                            cabinets: economico,
                            descripcion_trabajo: vm.request.tipo,
                            observaciones_cliente: vm.request.observaciones_cliente,
                            observaciones_tecnicas: vm.request.observaciones_tecnico,
                            km: vm.km,
                            firma_cliente: vm.firmaC,
                            firma_tecnico: vm.firmaT,
                            evidencia: vm.evidenciaNueva,
                            calificacion: vm.request.calificacion,
                            cancelacion: false
                        };
                    }

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
            if(vm.request.tipo === "Alta" || vm.request.tipo === "Baja" || vm.request.tipo === "Cambio"  || vm.request.tipo === 'Retiro'){
                if (vm.todosSeleccionado.length === 0) {
                    toastr.error(Translate.translate('Seleccione un cabinet'));
                    cont++;
                }
            }

            if(vm.evidenciaNueva.length === 0){
                toastr.error(Translate.translate('Se requiere de al menos una evidencia'));
                cont++;
            }

            if(vm.km === null){
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
            console.log("Data: ", data);
            var confirm = $mdDialog.confirm()
                .title(vm.dialogRestoreTitle)
                .textContent(vm.dialogRestoreMessage)
                .ariaLabel('Confirmar')
                .ok(vm.aceptButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function () {
                vm.promiseLoader = atencionPV.putActualiza(vm.request.folio, data)
                    .then(function (result) {
                        toastr.success(Translate.translate('SUCCESS.UPDATE'));
                        $state.go('triangular.admin-default.serviceList', {runListPendientes:true});
                    })
                    .catch(function (resultError) {
                        ErrorHandler.errortranslate(resultError);
                        console.log(resultError);
                    });
            }, function () {

            });
        }

        /*function showStoreLocation() {
            Geolocation.locate(vm.store.latitud, vm.store.longitud);
        }*/

        function filesSelected(files) {
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
        }

        function filesSelected2(files) {
            vm.firmaC = null;
            angular.forEach(files, function (image) {
                var base64Image = null;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(image);
                fileReader.onloadend = function () {
                    base64Image = fileReader.result;
                    vm.firmaC = base64Image.toString();
                };
            });
        }

        function filesSelected3(files) {
            vm.firmaT = null;
            angular.forEach(files, function (image) {
                var base64Image = null;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(image);
                fileReader.onloadend = function () {
                    base64Image = fileReader.result;
                    vm.firmaT = base64Image;
                };
            });
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

        //listMarcas();
        //listModelos();
        //listcabinets();


        function unUsedCabinet() {
            cabinetTemporal = null;
            vm.isUsed = false;
            cleanForm();
        }

        function seleccion() {
            vm.todosSeleccionado = [];
            vm.todosSeleccionado.push(cabinetTemporal);
            vm.isUsed = true;
        }

        function accept() {
            var aux = {
                economico: vm.cabinetSelected.economico,
                modelo_id: vm.cabinetSelected.modelo_id,
                no_serie: vm.cabinetSelected.no_serie.toUpperCase(),
                antiguedad: vm.cabinetSelected.antiguedad.toUpperCase()
            };
            cabinetPV.create(aux)
                .then(function (res) {
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
