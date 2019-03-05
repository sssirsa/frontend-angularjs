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
    function nextStepController(Translate, URLS, ErrorHandler, EnvironmentConfig, stageProvider) {
        var vm = this;
        vm.nextStepSelected = undefined;
        vm.steps = undefined;
        vm.step = undefined;
        vm.selectStep = selectStep;
        activate();
        function activate() {

            if (vm.actualStep && !vm.failures) {
                console.log(vm.actualStep);
                getStagesByActualStage();

            }
            if (vm.failures) {
                getStagesByFailures();
            }
        }
//Función que obtiene las etapas siguientes a partir de la etapa actual
        function getStagesByActualStage() {
            var promiseGetStage = stageProvider.getStage(vm.actualStep.id);
            promiseGetStage.then(function (currentStage) {
                vm.steps = currentStage.etapas_siguientes;
                console.log(vm.steps);
                //condición que obtiene la etapa defecto en caso de que exista una etapa defecto
                //a partir de la etapa actual
                if(currentStage.etapa_defecto){
                    vm.step=currentStage.etapa_defecto;
                }else{
                    vm.edit_next_step=true;
                    vm.step.nombre="Es necesario se Seleccione Etapa";
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
                if(vm.failures.length===1 && vm.failures[0].etapa_defecto){
                    vm.step=vm.failures[0].etapa_defecto;
                }
                if (vm.failures.length>1 && !vm.step){
                    vm.edit_next_step=true;
                    vm.step.nombre="Es necesario se Seleccione Etapa";
                }
                vm.failures.forEach(function (failure) {
                    console.log(failure.etapas_posibles);
                    if (failure.etapas_posibles.length > 0) {
                        failure.etapas_posibles.forEach(function (stage) {
                            getDuplicity(stage);
                            vm.steps.push(stage);
                            console.log(stage);
                        });

                    }
                });
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
            vm.nextStep({element: vm.nextStepSelected});
            vm.step = vm.nextStepSelected;
        }


    }
})();
