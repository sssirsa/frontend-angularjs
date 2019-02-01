/**
 * Created by franciscojaviercerdamartinez on 2/1/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('showInfoCabinet', {
            templateUrl: 'app/mainApp/service/internal/components/showInfoCabinet/showInfoCabinet.tmpl.html',
            controller: showInfoServiceController,
            bindings: {
                servicio:'<'

            }
        });
    function showInfoServiceController($mdDialog) {
        var vm = this;
        vm.showInfoServiceDialog=showInfoServiceDialog;

        function showInfoServiceDialog(ev) {
            vm.meta=[

            ];
            $mdDialog.show({
                controller: 'showInfotDialogController',
                templateUrl: 'app/mainApp/components/dialogShowInfo/showInfoDialog.tmpl.html',
                controllerAs: 'vm',
                locals: {
                    array: vm.servicio,
                    meta:vm.meta,
                    title:'Información del Cabinet'
                },
                parent: angular.element(document.body),
                targetEvent: ev,
                fullscreen: true,
                focusOnOpen: false,

            }).then(function (answer) {
                //Accepted
                $mdDialog.hide();
            }, function () {
                //Cancelled
                $mdDialog.cancel();
            });
        }


    }
})();
