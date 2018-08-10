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
        vm.showStoreLocation = showStoreLocation;

        //Variable declaration
        vm.id = $stateParams.id;
        vm.user = null;
        vm.request = null;
        vm.store = null;

        //Constants declaration
        vm.storeSegmentation = STORE_SEGMENTATION;
        vm.scores = SCORES;

        activate();

        function activate() {
            vm.loadingPromise = atencionPV.getByID(vm.id)
                .then(function (requestSuccess) {
                    convertImages();
                    vm.storePromise = Stores.getByID(requestSuccess.establecimiento)
                        .then(function (storeSuccess) {
                            $log.debug(storeSuccess);
                            vm.store = storeSuccess;
                        })
                        .catch(function (storeError) {
                            $log.error(storeError);
                            toastr.error(Translate.translate('REQUESTS.DETAIL.TOASTR.ERROR_STORE'));
                        });
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

        function showStoreLocation() {
            Geolocation.locate(vm.store.latitud, vm.store.longitud);
        }
    }
})();
