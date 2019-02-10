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
                infoGral: '&',
                infoSteptoDo: '&'

            }
        });
    function searchCabinetStepController($scope, Translate, toastr, searchCabinetStepProvider, ErrorHandler) {
        var vm = this;
        vm.asset = {};//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('INSPECTION.GENERAL_INFO');
        vm.assets_info = Translate.translate('INSPECTION.BULK_ASSETS');
        vm.infoStep = {
            makeInspection:undefined,
            makePrecheck:undefined,
            currentStage:undefined
        };

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
                promiseCabinetEntrada.then(function (control) {
                    console.log(control);
                    if (control.tipo_entrada === "Garantias") {
                        vm.infoStep.makeInspection = false;
                        var promiseGetCurrentStage = searchCabinetStepProvider.getCurrentStage(vm.asset.economico);
                        promiseGetCurrentStage.then(function (currentStage) {
                            vm.infoStep.currentStage = currentStage;
                            vm.infoStep.makePrecheck = false;
                        }).catch(function (errormsg) {
                            console.log(errormsg);
                            if (errormsg.status == 404) {
                                vm.infoStep.makePrecheck = true;
                                vm.infoStep.makeInspection  = false;
                                console.log("Hare Precheck");
                            }
                            else {
                                ErrorHandler.errorTranslate(errormsg);
                            }
                        });
                    } else {
                        vm.infoStep.makeInspection  = true;
                    }

                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                });
                console.log(vm.infoStep);
                vm.infoSteptoDo({element: vm.infoStep});

            }).catch(function (errormsg) {
                ErrorHandler.errorTranslate(errormsg);
            });

        }


    }


})();
