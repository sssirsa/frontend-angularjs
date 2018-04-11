(function () {

    angular
        .module('app.mainApp')
        .component('storeManager', {
            templateUrl: 'app/mainApp/components/storeManager/storeManager.tmpl.html',
            controller: storeManagerController,
            bindings: {
                canCreate: '<',
                canModify: '<',
                canDelete: '<',
                canSearch: '<',
                store: '<',
                storeSelected: '&'
            }
        });

    /* @ngInject */
    function storeManagerController(Translate, toastr, $log, STORE_SEGMENTATION, Geolocation, $mdDialog) {
        var vm = this;

        //Variable declaration
        vm.storeSegmentation = STORE_SEGMENTATION;

        //Function Parsing
        vm.searchStore = searchStore;
        vm.createStore = createStore;
        vm.modifyStore = modifyStore;
        vm.deleteStore = deleteStore;


        function searchStore(){

        }

        function createStore(){

        }

        function modifyStore(){

        }

        function deleteStore(){

        }

    }

})();
