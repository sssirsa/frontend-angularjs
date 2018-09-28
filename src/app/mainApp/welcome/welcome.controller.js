/**
 * Created by franciscojaviercerdamartinez on 02/06/16.
 */
(function () {
    angular
        .module('app.mainApp.welcome')
        .controller('welcomeController', WelcomeController);

    function WelcomeController(User, RoleStore, Sucursal, $log) {
        var vm = this;

        vm.user = User.getUser();
        vm.roles = _.keys(RoleStore.getStore());
        vm.sucursal = null;

        activate();

        function activate() {
            if (vm.user.sucursal) {
                Sucursal.getByID(vm.user.sucursal)
                    .then(function (sucursal) {
                        vm.sucursal = sucursal;
                    })
                    .catch(function (errorSucursal) {
                        $log.error(errorSucursal);
                    });
            }
        }

    }

})();
