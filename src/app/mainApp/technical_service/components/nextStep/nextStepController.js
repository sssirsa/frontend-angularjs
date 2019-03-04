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
                failures:'<',
                actualStep:'<'

            }
        });
    function nextStepController(Translate, URLS, ErrorHandler, EnvironmentConfig,stageProvider) {
        var vm = this;
        vm.nextStepSelected=undefined;
        vm.steps=undefined;
        vm.selectStep=selectStep;
        activate();
        function activate(){
            console.log(vm.actualStep);
            var promiseGetStage=stageProvider.getStage(vm.actualStep.id);
            promiseGetStage.then(function(currentStage){
                vm.steps=currentStage.etapas_siguientes;
                console.log(vm.steps);
            }).catch(function (errormsg){
                ErrorHandler.errorTranslate(errormsg);
            });
            if(vm.failures.lenght>0){
                vm.failures.forEach(function (failure){
                    console.log(failure);
                });
            }
        }

        function selectStep(){
            vm.nextStep({element:vm.nextStepSelected});
            vm.step=vm.nextStepSelected;
        }





    }
})();
