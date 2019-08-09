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
                stage: '<',
                sucursal:'<'
            }
        });
    function startServiceController($interval, startServiceProvider, ErrorHandler, $log) {
        var vm = this;
        vm.contador = 0;
        vm.startService = startService;
        var promiseStartStage;

        function startService() {
            vm.date = new Date();
            vm.body={
                sucursal_id:vm.sucursal
            };
            if (vm.diagnosis) {
                promiseStartStage = startServiceProvider.startDiagnosis(vm.diagnosis,vm.body);
            }
            if (vm.puncture) {
                promiseStartStage = startServiceProvider.startPuncture(vm.puncture,vm.body);
            }
            if (vm.presurize) {
                promiseStartStage = startServiceProvider.startPresurize(vm.presurize,vm.body);
            }
            if (vm.stage) {
                promiseStartStage = startServiceProvider.startStage(vm.stage,vm.body);
            }
            if (promiseStartStage) {
                promiseStartStage.then(function () {

                    $interval(function () {
                        vm.contador = vm.contador + 1;
                        vm.segundos = vm.contador % 60;
                        vm.minutos = parseInt((vm.contador / 60) % 60);
                        vm.horas = parseInt((vm.contador / 3600) % 24);

                    }, 1000);
                    vm.onStart({element: vm.date});
                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                    $log.error(errormsg);
                });
            }


        }


    }
})();
