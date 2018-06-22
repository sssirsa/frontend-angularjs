(function () {
    'use strict';

    angular
        .module('app.permission')
        .run(permissionRun);

    /* @ngInject */
    function permissionRun($rootScope, $state, AuthService, $urlRouter, RoleStore) {

        // default redirect if access is denied
        function accessDenied() {
            $state.go('404');
            $urlRouter.sync();
            AuthService.logout();
        }

        $rootScope.$on('$locationChangeSuccess', function (evt, new_url) {
            //Required for getting roles when page Update
            var roles = JSON.parse(localStorage.getItem('roles'));
            roles ? RoleStore.defineManyRoles(roles) : null;

            evt.preventDefault();
            if (
                !new_url.endsWith("#!") &&
                !new_url.endsWith("/") &&
                !new_url.endsWith("login") &&
                !new_url.endsWith("404") &&
                !new_url.endsWith("main")
            ) {
                if (!AuthService.isAuthenticated()) {
                    AuthService
                        .refreshToken()
                        .then(function () {
                            $urlRouter.sync();
                        })
                        .catch(function (errorCallback) {
                            if (errorCallback) {
                                accessDenied();
                            }
                        });
                }
                else {
                    $urlRouter.sync();
                }
            }
        });

        // redirect all denied permissions to 404
        $rootScope.$on('$stateChangePermissionDenied', accessDenied());

    }
})();
