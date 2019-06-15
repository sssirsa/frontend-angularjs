/**
 * Created by franciscojaviercerdamartinez on 2/25/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('nextStep', {
            templateUrl: 'app/mainApp/technical_service/components/nextStep/nextStep.tmpl.html',
            controller: nextStepController,
            bindings: {
                nextStep: '&',
                failures: '<',
                actualStep: '<'

            }
        });
    function nextStepController(Translate, URLS, ErrorHandler, EnvironmentConfig, nextStageProvider, $log) {
        var vm = this;
        vm.nextStepSelected = undefined;
        vm.steps = undefined;
        vm.step = undefined;
        vm.endService = true;
        vm.selectStep = selectStep;
        vm.activate = activate;
        vm.closeService=closeService;
        activate();
        function activate() {

            if (vm.actualStep && !vm.failures) {
                getStagesByActualStage();

            }
            if (vm.failures) {

                getStagesByFailures();
            }
        }

        function closeService() {
            vm.endService=!vm.endService;
            if(!vm.endService){
                vm.nextStep({element: undefined});
            }
        }
//Función que obtiene las etapas siguientes a partir de la etapa actual
        function getStagesByActualStage() {
            var promiseGetStage = nextStageProvider.getStage(vm.actualStep.id);
            promiseGetStage.then(function (currentStage) {
                vm.steps = currentStage.etapas_siguientes;
                //condición que obtiene la etapa defecto en caso de que exista una etapa defecto
                //a partir de la etapa actual
                if (currentStage.etapa_defecto) {
                    vm.step = currentStage.etapa_defecto;
                    if (vm.endService) {
                        vm.nextStep({element: vm.step});
                    }
                } else {
                    vm.edit_next_step = true;
                    vm.step.nombre = "Es necesario se Seleccione Etapa";
                }
            }).catch(function (errormsg) {
                ErrorHandler.errorTranslate(errormsg);
            });
        }

//Función que obtiene las etapas siguientes posibles a partir del caralogo de fallas
        function getStagesByFailures() {
            vm.steps = [];
            if (vm.failures.length > 0) {
                //condición que obtiene la etapa defecto en caso de que exista una etapa defecto
                //a partir del sintoma

                if (vm.failures.length === 1 && vm.failures[0].etapa_defecto) {
                    vm.step = vm.failures[0].etapa_defecto;
                    if (vm.endService) {
                        vm.nextStep({element: vm.step});
                    }
                }
                if (vm.failures.length > 1 && !vm.step) {
                    vm.edit_next_step = true;

                }
                vm.failures.forEach(function (failure) {
                    $log.debug(failure.etapas_posibles);
                    if (failure.etapas_posibles.length > 0) {
                        failure.etapas_posibles.forEach(function (stage) {
                            getDuplicity(stage);
                            vm.steps.push(stage);

                        });

                    }
                });

                if (vm.steps.length === 0) {
                    getStagesByActualStage();
                }
            }

        }

        function getDuplicity(stage) {
            var index;
            for (index = 0; index < vm.steps.length; ++index) {
                if (vm.steps[index].id === stage.id) {
                    vm.steps.splice(index, 1);
                }
            }
        }

        function selectStep() {
            if (vm.endService) {
                if (vm.nextStepSelected) {
                    vm.nextStep({element: vm.nextStepSelected});
                }
                else {
                    vm.nextStep({element: vm.step});
                }
            }
            vm.step = vm.nextStepSelected;

        }


    }
})();
