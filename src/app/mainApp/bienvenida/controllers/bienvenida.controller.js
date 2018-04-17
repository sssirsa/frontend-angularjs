/**
 * Created by franciscojaviercerdamartinez on 02/06/16.
 */
(function () {
    angular
        .module('app.mainApp')
        .controller('bienvenidaController',bienvenidaController);

    function bienvenidaController($scope,$rootScope){
        var vm = this;

        vm.capturista=false;
        vm.tecnico=false;
        vm.cliente=false;
        vm.Admin=false;

        function showButtons(){
            if (vm.role==="Administrador"){
                vm.capturista=true;
                vm.tecnico=true;
                vm.cliente=true;
                vm.admin=true;
            }
            else{
                if(vm.role==="Capturista"){
                    vm.capturista=true;
                    vm.cliente=true;
                }
                else{
                    if(vm.role==="Cliente"){
                    vm.cliente=true;
                }
                    else
                        vm.tecnico=true;
                }
            }
        }
    }

})();
