(function () {

    angular
        .module('app.mainApp')
        .component('storeManager', {
            templateUrl: 'app/mainApp/components/storeManager/storeManager.tmpl.html',
            controller: storeManagerController,
            bindings: {
                preRequest: '<',
                preRequestOpen: '&'
            }
        });

    /* @ngInject */
    function storeManagerController(
    ) {
        var vm = this;



    }

})();
