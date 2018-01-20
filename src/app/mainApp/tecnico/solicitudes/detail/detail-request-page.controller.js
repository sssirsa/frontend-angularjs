(function () {
    'use strict';

    angular
        .module('requests')
        .controller('DetailRequestPageController', DetailRequestPageController);

    /* @ngInject */
    function DetailRequestPageController($window, $state, $stateParams) {
        var vm = this;

        //Function mapping
        vm.showLocation=showLocation;
        vm.assign=assign;

        //Variable declaration
        vm.folio=$stateParams.id;
        vm.assignedPerson=null;
        vm.users=[
            {
                username:'jrodriguezh',
                nombre:'Julián',
                apellido_paterno:'Rodriguez',
                apellido_materno:'de la Huerta'
            },
            {
                username:'emartinezj',
                nombre:'Ernesto',
                apellido_paterno:'Martinez',
                apellido_materno:'Julios'
            }
        ];

        vm.request={
            work:'Reja metálica de almacén',
            estimated:'13/Dic/2018',
            partida:'Herrería',
            specification:'HER-02',
            description:'Colocación de reja metálica en área de almacén comisariato',
            location:{
                name:'Hangar XC-2',
                latitude:19.435009,
                longitude:-99.0856897
            },
            responsible:{
                name:'Supervisor de área',
                phone:'55-5555-5555',
                email:'supervisor@interjet.com'
            },
            persona:null
        };

        function showLocation() {
            var url = 'https://www.google.com/maps/search/?api=1&query=' + vm.request.location.latitude + ',' + vm.request.location.longitude;
            var target = '_blank';

            $window.open(url, target);
        }

        function assign(){
            $state.go('triangular.listRequest');
        }

    }
})();
