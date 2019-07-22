(function () {
    angular
        .module('app.mainApp.management.users')
        .controller('userDetailController', UserDetailController);
    function UserDetailController(
        $stateParams,
        USERS
    ) {
        var vm = this;

        vm.user;

        function init() {
            //Getting the user 
            vm.userPromise = USERS.getUserDetail($stateParams.personId)
                .then(function (user) {
                    vm.user = user;
                });
        }
        init();
    }
})();
