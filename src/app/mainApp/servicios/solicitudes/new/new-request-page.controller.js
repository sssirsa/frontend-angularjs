(function() {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('NewRequestPageController', NewRequestPageController);

    /* @ngInject */
    function NewRequestPageController($state, $mdToast) {
        var vm = this;

        //Function mapping
        vm.save=save;

        //Variable declaration
        vm.request={};


        function save(){
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Solicitud de servicio creada correctamente')
                    .position('top right')
                    .hideDelay(3000)
            );
            vm.request={};
            $state.reload();
        }

    }
})();
