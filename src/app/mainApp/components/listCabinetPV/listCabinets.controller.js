//Create by Alex 26/04/2018

(function () {

    angular
        .module('app.mainApp')
        .component('listCabinet', {
            templateUrl: 'app/mainApp/components/listCabinetPV/listCabinets.tmpl.html',
            controller: listCabinetController
        });

    /* @ngInject */
    function listCabinetController (cabinetPV, Helper, Translate, toastr, $log, $mdDialog) {
        var vm = this;

        vm.todos = null;
        vm.loadingPromise = null;


        //functions
        vm.listcabinets = listcabinets;
        vm.info = info;

        listcabinets();

        function listcabinets(){
            vm.loadingPromise = cabinetPV.list()
                .then(function (res) {
                    vm.todos = Helper.filterDeleted(res, true);
                })
                .catch(function (err) {

                });
        }

        function info(item) {
            $mdDialog.show({
                controller: 'cabinetPVController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/listCabinetPV/modal/modalCabinetPV.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals:{
                    data: item
                }
            })
                .then(function () {

                })
                .catch(function(){

                });
        }

    }

})();
