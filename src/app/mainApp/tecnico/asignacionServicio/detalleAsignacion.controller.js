(function(){
    angular
        .module('app.mainApp.tecnico')
        .controller('detalleAsignacionController', detalleAsignacionController);

    function detalleAsignacionController(SalePointRequests, SalePoint, $stateParams, toastr, Translate){
        var vm = this;

        vm.salePoint=null;
        vm.request=null;

        activate();

        function activate(){
            SalePoint.getByID($stateParams.id)
                .then(function(salePointSuccess){
                    vm.salePoint = salePointSuccess;
                    SAlePointRequests.getBiID(vm.salepoint.solicitud)
                        .then(function(requestSuccess){
                            vm.request=requestSuccess;
                        })
                        .catch(function(requestError){
                            console.log(requestError);
                            vm.request=null;
                            toastr.error(
                                Translate.translate('MAIN.MSG.SUCCESS_TITLE'),
                                Translate.translate('MAIN.MSG.ERROR_MESSAGE')
                            );
                        });
                })
                .catch(function(salePointError){
                    console.log(salePointError);
                    vm.salePoint=null;
                    toastr.error(
                        Translate.translate('MAIN.MSG.SUCCESS_TITLE'),
                        Translate.translate('MAIN.MSG.ERROR_MESSAGE')
                    );
                });
        }

    }

})();
