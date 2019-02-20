(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('DetailRequestPageController', DetailRequestPageController);

    /* @ngInject */
    function DetailRequestPageController($log, $state, $stateParams, toastr, Translate, SalePointRequests, Stores,
                                         Persona_Admin, Geolocation, SCORES) {
        var vm = this;

        //Function mapping
        vm.showStoreLocation = showStoreLocation;

        //Variable declaration
        vm.id = $stateParams.id;
        vm.user = null;
        vm.request = null;
        vm.store = null;

        //Constants declaration
        vm.storeSegmentation = []; //TODO: update with API callback
        vm.scores = SCORES;

        activate();

        function activate() {
            vm.loadingPromise = SalePointRequests.getByID(vm.id)
                .then(function (requestSuccess) {
                    $log.debug(requestSuccess);
                    vm.request = requestSuccess;
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
