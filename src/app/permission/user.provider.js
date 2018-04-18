(function () {
    angular
        .module('app')
        .factory('User', UserController);

    function UserController() {
        var vm = this;

        vm.user = null;

        return {
            getUser: getUser,
            setUser: setUser
        }

        function getUser() {
            return vm.user;
        }

        function setUser(user) {
            vm.user = user;
        }

    }

})();
