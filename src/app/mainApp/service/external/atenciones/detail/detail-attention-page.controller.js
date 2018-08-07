(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('DetailAttentionPageController', DetailAttentionPageController);

    /* @ngInject */
    function DetailAttentionPageController($log, $state, $stateParams, toastr, Translate, SalePointRequests, Stores,
                                         Persona_Admin, Geolocation, STORE_SEGMENTATION, SCORES, atencionPV) {
        var vm = this;

        //Variable declaration
        vm.id = $stateParams.id;
        console.log("Entre folio: ", vm.id);

        activate();

        function activate() {
            vm.loadingPromise = atencionPV.getByID(vm.id)
                .then(function (requestSuccess) {
                    $log.debug(requestSuccess);
                    vm.request = requestSuccess;

                    console.log("info request:", vm.request);
                })
                .catch(function (errorRequest) {
                    $log.error(errorRequest);
                    toastr.error(Translate.translate('REQUESTS.DETAIL.TOASTR.ERROR_PV'));
                });
        }
    }
})();
