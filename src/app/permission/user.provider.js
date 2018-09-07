(function () {
    angular
        .module('app')
        .factory('User', ['$cookies', UserController]);

    function UserController($cookies) {
        var vm = this;

        vm.user = null;

        return {
            getUser: getUser,
            setUser: setUser
        }

        function getUser() {
            if(!vm.user){
                vm.user=$cookies.getObject('user');
            }
            return vm.user;
        }

        function setUser(user) {
            $cookies.putObject('user', user);
            vm.user = user;
        }

    }

})();
