/**
 * Created by franciscojaviercerdamartinez on 2/1/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('showInfoServicio', {
            templateUrl: 'app/mainApp/technical_service/components/showInfoService/showInfoService.tmpl.html',
            controller: showInfoServiceController,
            bindings: {
                info:'<'

            }
        });
    function showInfoServiceController($mdDialog) {
        var vm = this;
        init();
        function init() {
            console.log(vm.info);
        }





    }
})();
