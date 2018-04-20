(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .controller('storesController', storesController);

    /* @ngInject */
    function storesController(URLS) {
        var vm = this;

        vm.templateUrl = URLS.establecimiento_template;

    }

})();
