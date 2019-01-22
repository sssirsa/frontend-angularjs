/**
 * Created by franciscojaviercerdamartinez on 1/22/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('showInfoCabinet', {
            templateUrl: 'app/mainApp/service/internal/components/showInfoCabinet/showInfoCabinet.tmpl.html',
            controller: showInfoCabinetController,
            bindings: {
                asset:'<'

            }
        });
    function showInfoCabinetController() {
        var vm = this;

    }


})();
