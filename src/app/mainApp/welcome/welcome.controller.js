/**
 * Created by franciscojaviercerdamartinez on 02/06/16.
 */
(function () {
    angular
        .module('app.mainApp.welcome')
        .controller('WelcomeController', WelcomeController);

    function WelcomeController(
        User,
        $log
    ) {
        var vm = this;

        vm.user = User.getUser();

    }

})();
