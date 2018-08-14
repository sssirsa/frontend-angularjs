(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('TemporalAttentionPageController', TemporalAttentionPageController);

    /* @ngInject */
    function TemporalAttentionPageController($log, $state, $stateParams, toastr, Translate, SalePointRequests, Stores,
                                         Persona_Admin, Geolocation, STORE_SEGMENTATION, SCORES, atencionPV, cabinetPV, Helper) {
        var vm = this;


        //codigo para listar cabinets
        vm.todosprev = null;
        vm.todos = [];
        vm.loadingPromise = null;
        vm.limit = 20;
        vm.offset = 0;
        vm.searchText = '';

        vm.listcabinets = listcabinets;
        vm.selectCabinet = selectCabinet;
        vm.toConsole = toConsole;
        vm.filterCabinets = filterCabinets;

        function selectCabinet(cabinet) {
            console.log(cabinet);
        }

        function toConsole() {
            console.log(vm.todos);
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


        listcabinets();

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


        //Variable declaration
        vm.id = 'CAS-201808080706-WAL';
        vm.user = null;
        vm.request = null;
        vm.solicitudDetalles = null;
        vm.store = null;
        vm.servicio = null;
        vm.insumos = null;
        vm.improductivo = 'a';

        //Constants declaration
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.scores = SCORES;

        //Declaración de funciones
        vm.changeProductivo = changeProductivo;
        vm.filesSelected = filesSelected;

        activate();

        function activate() {
            vm.loadingPromise = atencionPV.getByID(vm.id)
                .then(function (requestSuccess) {
                    vm.request = requestSuccess;

                    SalePointRequests.getByID(vm.id)
                        .then(function (requestSuccess2) {
                            $log.debug(requestSuccess2);
                            vm.solicitudDetalles = requestSuccess2;

                            if(vm.request.tipo == 'Medio'){
                                atencionPV.getInsumos(vm.solicitudDetalles.cabinet)
                                    .then(function (respuesta) {
                                        vm.insumos = respuesta;
                                    })
                                    .catch(function (errorRespuesta) {
                                        console.log(errorRespuesta);
                                    });
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
            if(vm.improductivo == null){
                vm.improductivo = 'a';
            }else{
                vm.improductivo = null;
            }
        }

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
    }


})();
