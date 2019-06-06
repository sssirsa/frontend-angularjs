(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint.request')
        .controller('detailRequestController', detailRequestController);

    /* @ngInject */
    function detailRequestController(
        REQUESTS,
        SCORES,
        $log,
        $state,
        $stateParams,
        ErrorHandler,
        Translate,
        Geolocation,
        Stores,
        Person
    ) {
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
            if (vm.id === null) {
                $state.go('triangular.admin-default.list-request');
            }
            else {
                vm.loadingPromise = REQUESTS.getRequestByID(vm.id)
                    .then(function (requestSuccess) {
                        vm.request = requestSuccess;
                        convertImages();
                        vm.storePromise = Stores.getByID(requestSuccess.establecimiento.no_cliente);
                        return vm.storePromise;
                    })
                    .then(function (storeSuccess) {
                        vm.store = storeSuccess;
                        vm.personaPromise = Person.getPerson(vm.request.persona.id);
                        return vm.personaPromise;
                    })
                    .then(function (userSuccess) {
                        vm.user = userSuccess;
                    })
                    .catch(function (errors) {
                        $log.error('@Controller:detailRequestController\n@Function:activate\n@detail: ' + errors);
                        ErrorHandler.errorTranslate(errors);
                    });
            }
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
