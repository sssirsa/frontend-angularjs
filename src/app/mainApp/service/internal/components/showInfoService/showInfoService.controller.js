/**
 * Created by franciscojaviercerdamartinez on 2/1/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('showInfoServicio', {
            templateUrl: 'app/mainApp/service/internal/components/showInfoCabinet/showInfoCabinet.tmpl.html',
            controller: showInfoServiceController,
            bindings: {
                infoSteptoDo:'<'

            }
        });
    function showInfoServiceController($mdDialog) {
        var vm = this;




    }
})();
