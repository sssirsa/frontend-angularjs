/**
 * Created by franciscojaviercerdamartinez on 02/06/16.
 */
(function () {
    angular
        .module('app.mainApp')
        .controller('bienvenidaController',bienvenidaController);

    function bienvenidaController(User, RoleStore){
        var vm = this;

        vm.user = User.getUser();
        vm.roles = _.keys(RoleStore.getStore());

    }

})();
