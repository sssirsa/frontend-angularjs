/**
 * Created by franciscojaviercerdamartinez on 1/30/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('startService', {
            templateUrl: 'app/mainApp/service/internal/components/start_service/startService.tmpl.html',
            controller: startServiceController,
            bindings: {


            }
        });
    function startServiceController($interval) {
        var vm = this;
        vm.contador=0;
        vm.startService=startService;

        function startService() {
            vm.date = new Date();

            $interval(function () {
                vm.contador=vm.contador+1;
                vm.segundos=vm.contador%60;
                vm.minutos=parseInt((vm.contador/60)%60);
                vm.horas=parseInt((vm.contador/3600)%24);

            }, 1000);
        }





    }
})();
