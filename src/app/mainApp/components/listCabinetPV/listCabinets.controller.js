//Create by Alex 26/04/2018

(function () {

    angular
        .module('app.mainApp')
        .component('listCabinet', {
            templateUrl: 'app/mainApp/components/listCabinetPV/listCabinets.tmpl.html',
            controller: listCabinetController
        })
        .filter('cabinetPVFilter', custom);

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
                    vm.todos = null;
                    listcabinets();
                })
                .catch(function(){

                });
        }



        vm.searchText = '';
        vm.search_items = [];


        vm.lookup = lookup;
        vm.selectedItemChange = selectedItemChange;
        vm.querySearch = querySearch;

        function querySearch(query) {
            var results = query ? lookup(query) : vm.lineas;
            return results;

        }

        function lookup(search_text) {
            vm.search_items = _.filter(vm.todos, function (item) {
                return item.economico.indexOf(search_text) >= 0;
            });
            return vm.search_items;
        }

        function selectedItemChange(item)
        {
            info(item);
        }

    }

    function custom() {
        return function (input, text) {
            if (!angular.isString(text) || text === '') {
                return input;
            }

            return _.filter(input, function (item) {
                return item.economico.indexOf(text) >= 0;
            });

        };
    }

})();
