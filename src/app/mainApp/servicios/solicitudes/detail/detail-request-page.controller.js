(function () {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('DetailRequestPageController', DetailRequestPageController);

    /* @ngInject */
    function DetailRequestPageController($log, $state, $stateParams, toastr, Translate, SalePointRequests, Stores,
                                         Persona_Admin) {
        var vm = this;

        //Function mapping

        //Variable declaration
        vm.id=$stateParams.id;
        vm.user=null;
        vm.request=null;
        vm.store=null;

        activate();

        function activate(){
            vm.loadingPromise = SalePointRequests.getByID(vm.id)
                .then(function(requestSuccess){
                    $log.debug(requestSuccess);
                    vm.request = requestSuccess;
                    Stores.getByID(requestSuccess.establecimiento)
                        .then(function(storeSuccess){
                            vm.store=storeSuccess;
                        })
                        .catch(function(storeError){
                            $log.error(storeError);
                            toastr.error(Translate.translate('REQUESTS.DETAIL.TOASTR.ERROR_STORE'));
                        });
                    Persona_Admin.get(requestSuccess.persona)
                        .then(function(userSuccess){
                            vm.user=userSuccess;
                        })
                        .catch(function(userError){
                            $log.error(userError);
                            toastr.error(Translate.translate('REQUESTS.DETAIL.TOASTR.ERROR_USER'));
                        });
                })
                .catch(function(errorRequest){
                    $log.error(errorRequest);
                    toastr.error(Translate.translate('REQUESTS.DETAIL.TOASTR.ERROR_PV'));
                });
        }

    }
})();
