/**
 * Created by franciscojaviercerdamartinez on 2/5/19.
 */

(function () {

    angular
        .module('app.mainApp')
        .component('symptomManager', {
            templateUrl: 'app/mainApp/service/internal/components/symptom/symptom.tmpl.html',
            controller: symptomController,
            bindings: {
                symptoms: '&'

            }
        });
    function symptomController($interval) {
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
            vm.onStart({element:vm.date});
        }





    }
})();
