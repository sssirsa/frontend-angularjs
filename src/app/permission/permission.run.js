(function () {
    'use strict';

    angular
        .module('app.permission')
        .run(permissionRun);

    /* @ngInject */
    function permissionRun(
        AuthService,
        $transitions,
        $state,
        PERMISSION
    ) {

        // default redirect if access is denied
        function accessDenied() {
            $state.go('404');
            AuthService.logout();
        }

        $transitions.onCreate({}, function (transition) {
            if (transition.to().name !== 'splash'
                && transition.to().name !== 'login') {
                //Any other state that requires login
                if (!AuthService.isAuthenticated()) {
                    //User not athenticated
                    if (AuthService.canRefreshSession()) {
                        AuthService
                            .refreshToken()
                            .then(function () {
                                return true;
                            })
                            .catch(function () {
                                return false;
                            })
                    }
                    else {
                        accessDenied();
                    }
                }
                else {
                    //User is authenticated
                    if (!transition.from().name) {
                    //Just define roles if page has been updated
                        PERMISSION.definePermissions();
                    }
                    return true;
                }
            }
        });

        //Transition aborted due to permissions validation
        $transitions.onError({}, function () {
            accessDenied();
        });

    }
})();
