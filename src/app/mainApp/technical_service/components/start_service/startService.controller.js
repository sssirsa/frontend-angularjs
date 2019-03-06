/**
 * Created by franciscojaviercerdamartinez on 1/30/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('startService', {
            templateUrl: 'app/mainApp/technical_service/components/start_service/startService.tmpl.html',
            controller: startServiceController,
            bindings: {
                onStart: '&',
                diagnosis: '<',
                puncture: '<',
                presurize: '<',
                stage: '<'
            }
        });
    function startServiceController($interval, startServiceProvider, ErrorHandler) {
        var vm = this;
        vm.contador = 0;
        vm.startService = startService;

        function startService() {
            vm.date = new Date();

            var promiseStartStage = undefined;
            if (vm.diagnosis) {
                promiseStartStage = startServiceProvider.startDiagnosis(vm.diagnosis);
            }
            if (vm.puncture) {
                promiseStartStage = startServiceProvider.startPuncture(vm.diagnosis);
            }
            if (vm.presurize) {
                promiseStartStage = startServiceProvider.startPresurize(vm.diagnosis);
            }
            if (vm.stage) {
                promiseStartStage = startServiceProvider.startStage(vm.diagnosis);
            }
            if (promiseStartStage) {
                promiseStartStage.then(function (response) {
                    console.log(response)
                    $interval(function () {
                        vm.contador = vm.contador + 1;
                        vm.segundos = vm.contador % 60;
                        vm.minutos = parseInt((vm.contador / 60) % 60);
                        vm.horas = parseInt((vm.contador / 3600) % 24);

                    }, 1000);
                    vm.onStart({element: vm.date});
                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                });
            }


        }


    }
})();
