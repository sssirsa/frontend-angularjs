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
    function showInfoCabinetController($mdDialog) {
        var vm = this;
        vm.showInfoCabinetDialog=showInfoCabinetDialog;

        function showInfoCabinetDialog(ev) {
            $mdDialog.show({
                controller: 'showInfoCabinetDialogController',
                templateUrl: 'app/mainApp/service/internal/components/showInfoCabinet/infoCabinetDialog.tmpl.html',
                controllerAs: 'vm',
                locals: {
                    cabinet: vm.asset
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
