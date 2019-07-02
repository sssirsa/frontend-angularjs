/**
 * Created by franciscojaviercerdamartinez on 1/21/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('searchCabinetStep', {
            templateUrl: 'app/mainApp/technical_service/components/searchCabinetStep/searchCabinetStep.tmpl.html',
            controller: searchCabinetStepController,
            bindings: {
                infoGral: '&',
                infoStepToDo: '&'

            }
        });
    function searchCabinetStepController(Translate, searchCabinetStepProvider, ErrorHandler, toastr) {
        var vm = this;
        vm.asset = {};//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('INSPECTION.GENERAL_INFO');
        vm.assets_info = Translate.translate('INSPECTION.BULK_ASSETS');
        vm.title = Translate.translate('SEARCH_INFO_CABINET_COMPONENT.NOT_IN_THIS_SUBSIDIARY_TITLE');
        vm.messsage = Translate.translate('SEARCH_INFO_CABINET_COMPONENT.NOT_IN_THIS_SUBSIDIARY');
        vm.infoStep = {
            makeInspection: undefined,
            makePrecheck: undefined,
            currentStage: undefined,
            control: undefined
        };

        vm.search_asset = search_asset;
        function clear() {
            vm.infoStep = {
                makeInspection: undefined,
                makePrecheck: undefined,
                currentStage: undefined,
                control: undefined
            };
            vm.asset = {};//objeto contenedor del cabinet
        }

        function search_asset() {
            //Limpiamos las variables antes de hacer una nueva búsqueda
            clear();
            //Search in cabinets location.
            vm.promiseCabinetEntrada = searchCabinetStepProvider.getEntrie(vm.asset_id);
            vm.promiseCabinetEntrada.then(function (control) {
                vm.infoStep.control = control;
                if (control.tipo_entrada === "Garantias" || control.tipo_entrada === "Reparacion") {
                    vm.infoStep.makeInspection = false;
                } else {
                    vm.infoStep.makePrecheck = false;
                    vm.infoStep.makeInspection = true;
                    vm.infoStepToDo({element: vm.infoStep});

                }

                var promiseCabinetInfo = searchCabinetStepProvider.getByID(vm.asset_id);
                promiseCabinetInfo.then(function (asset) {
                    vm.asset = asset;
                    //selection subsidiary
                    //console.log(vm.asset);
                    vm.infoGral({element: vm.asset});

                    var promiseGetCurrentStage = searchCabinetStepProvider.getCurrentStage(vm.asset_id);
                    promiseGetCurrentStage.then(function (currentStage) {
                        vm.infoStep.currentStage = currentStage;
                        vm.infoStep.makePrecheck = false;
                        vm.infoStepToDo({element: vm.infoStep});
                    }).catch(function (errormsg) {
                        if (errormsg.status === 404) {
                            if (vm.infoStep.control.tipo_entrada === "Garantias" || vm.infoStep.control.tipo_entrada === "Reparacion") {
                                vm.infoStep.makePrecheck = true;
                                vm.infoStep.makeInspection = false;
                                vm.infoStepToDo({element: vm.infoStep});
                            }


                        }
                        else {
                            ErrorHandler.errorTranslate(errormsg);
                        }
                    });
                }).catch(function (errormsg) {
                    if (angular.isDefined(vm.infoStep.control.sucursal) || vm.infoStep.control.udn) {
                        toastr.error(vm.title, vm.messsage);
                        clear();
                    }
                    else {
                        ErrorHandler.errorTranslate(errormsg);
                        clear();
                    }

                });


            }).catch(function (errormsg) {
                ErrorHandler.errorTranslate(errormsg);
            });


        }


    }


})();
