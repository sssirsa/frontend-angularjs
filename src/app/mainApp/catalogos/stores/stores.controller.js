(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .controller('storesController', storesController);

    /* @ngInject */
    function storesController(Stores,
                              toastr,
                              Translate,
                              $mdDialog,
                              $log) {
        var vm = this;

    }

})();
