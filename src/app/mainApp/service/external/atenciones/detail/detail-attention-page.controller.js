(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('DetailAttentionPageController', DetailAttentionPageController);

    /* @ngInject */
    function DetailAttentionPageController($log, $state, $stateParams, toastr, Translate, SalePointRequests, Stores,
                                         Persona_Admin, Geolocation, STORE_SEGMENTATION, SCORES, atencionPV) {
        var vm = this;

        //Function mapping
        //vm.showStoreLocation = showStoreLocation;

        //Variable declaration
        vm.id = $stateParams.id;
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
    }
})();
