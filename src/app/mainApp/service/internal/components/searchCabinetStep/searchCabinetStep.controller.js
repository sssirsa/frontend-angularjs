/**
 * Created by franciscojaviercerdamartinez on 1/21/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('searchCabinetStep', {
            templateUrl: 'app/mainApp/service/internal/components/searchCabinetStep/searchCabinetStep.tmpl.html',
            controller: searchCabinetStepController,
            bindings: {
                infoGral: '&'

            }
        });
    function searchCabinetStepController($scope, Translate, toastr, searchCabinetStepProvider, ErrorHandler) {
        var vm = this;
        vm.asset = {};//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('INSPECTION.GENERAL_INFO');
        vm.assets_info = Translate.translate('INSPECTION.BULK_ASSETS');

        vm.search_asset = search_asset;
        function search_asset() {
            //Search in cabinets location
            var promiseCabinetInfo = searchCabinetStepProvider.getByID(vm.asset_id);
            promiseCabinetInfo.then(function (asset) {
                vm.asset = asset;
                //selection subsidiary
                console.log(vm.asset);
                vm.infoGral({element: vm.asset});
                var promiseCabinetEntrada = searchCabinetStepProvider.getEntrie(vm.asset.economico);
                console.log(promiseCabinetEntrada);
                promiseCabinetEntrada.then(function (control) {
                    console.log(control);
                    if (control.tipo_entrada === "Garantias") {
                        vm.makeInspection = false;
                        var promiseGetCurrentStage = searchCabinetStepProvider.getCurrentStage(vm.asset.economico);
                        promiseGetCurrentStage.then(function (currentStage) {
                            console.log(currentStage);
                        }).catch(function (errormsg) {
                            console.log(errormsg);
                            if(errormsg.status==404){
                                vm.makePrecheck = true;
                                console.log("Hare Precheck");
                            }
                            else {
                                ErrorHandler.errorTranslate(errormsg);
                            }
                        });
                    }

                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                });

            }).catch(function (errormsg) {
                ErrorHandler.errorTranslate(errormsg);
            });

        }


    }


})();
