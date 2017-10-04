(function(){
    'use strict';

    angular
        .module('app.mainApp.tecnico')
        .controller('asignacionServicioController', asignacionServicioController);

    function asignacionServicioController (ServiceAssign, SalePointRequests){
        var vm=this;
        console.log(ServiceAssign.listUnasignedServices());
    }

})();
