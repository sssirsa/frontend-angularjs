(function () {
    angular
        .module('app')
        .factory('User', UserController);
    function UserController($cookies) {
        var vm = this;

        vm.user = null;

        return {
            getUser: getUser,
            setUser: setUser
        };

        function getUser() {
            if (!vm.user) {
                vm.user = $cookies.getObject('user');
            }
            return vm.user;
        }

        function setUser(user) {
            vm.user = angular.fromJson(angular.toJson(user));
            delete user['permissions'];
            $cookies.putObject('user', user);
        }

    }

})();
