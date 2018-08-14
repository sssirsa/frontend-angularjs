(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('DetailAttentionPageController', DetailAttentionPageController);

    /* @ngInject */
    function DetailAttentionPageController($log, $state, $stateParams, toastr, Translate, SalePointRequests, Stores,
                                         Persona_Admin, Geolocation, STORE_SEGMENTATION, SCORES, atencionPV,
                                           cabinetPV, ErrorHandler, Helper, $scope, MarcaCabinet, ModeloCabinet) {
        var vm = this;

        //Function mapping
        //vm.showStoreLocation = showStoreLocation;

        //Variable declaration
        vm.id = $stateParams.id;
        vm.kindAtention = $stateParams.tipo;
        vm.user = null;
        vm.request = null;
        vm.solicitudDetalles = null;
        vm.store = null;
        vm.servicio = null;
        vm.insumos = null;
        vm.improductivo = !null;
        vm.visible = null;

        console.log("tipo atención", vm.kindAtention);

        //Constants declaration
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.scores = SCORES;

        //Declaración de funciones
        vm.changeProductivo = changeProductivo;
        vm.filesSelected = filesSelected;
        vm.insumoSelect = insumoSelect;
        vm.validaMax = validaMax;

        activate();

        function activate() {
            if(vm.kindAtention == 'attended'){
                vm.visible = null;
            }else{
                vm.visible = true;
            }

            vm.loadingPromise = atencionPV.getByID(vm.id)
                .then(function (requestSuccess) {
                    vm.request = requestSuccess;

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
                    vm.store = requestSuccess.establecimiento;
                    vm.personaPromise = Persona_Admin.get(requestSuccess.persona)
                        .then(function (userSuccess) {
                            $log.debug(userSuccess);
                            vm.user = userSuccess;
                        })
                        .catch(function (userError) {
                            $log.error(userError);
                            toastr.error(Translate.translate('REQUESTS.DETAIL.TOASTR.ERROR_USER'));
                        });

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
                    console.log(errorRespuesta);
                });
        }

        function validaMax(insumo){
            if(insumo.usado > insumo.insumoMax){
                insumo.error = true;
            }else{
                insumo.error = false;
            }
        }

        /*function showStoreLocation() {
            Geolocation.locate(vm.store.latitud, vm.store.longitud);
        }*/

        function filesSelected(files) {
            vm.request.evidencia = [];
            angular.forEach(files, function (image) {
                var base64Image = null;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(image);
                fileReader.onloadend = function () {
                    base64Image = fileReader.result;
                    vm.request.evidencia.push({foto: base64Image});
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
                    console.log(res);
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
