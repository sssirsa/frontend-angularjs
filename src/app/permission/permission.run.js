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

        //Redirect if access is denied
        function accessDenied() {
            $state.go('401');
            AuthService.logout();
        }

        $transitions.onCreate({}, function (transition) {
            if(transition.from()===transition.to()){
                //Abort transitions to the same state, to avoid errors
                transition.abort();
            }
            if (transition.to().name !== 'splash'
                && transition.to().name !== '401'
                && transition.to().name !== '404'
                && transition.to().name !== '500'
                && transition.to().name !== 'main'
                && transition.to().name !== 'login') {
                //Any other state that requires login
                if (!AuthService.isAuthenticated()) {
                    //User not athenticated
                    if (AuthService.canRefreshSession()) {
                        //Permission redefining is managed in AuthService.refreshToken function
                        AuthService
                            .refreshToken()
                            .then(function () {
                                return true;
                            })
                            .catch(function () {
                                return false;
                            });
                    }
                    else {
                        accessDenied();
                    }
                }
                else {
                    //User is authenticated
                    if (!transition.from().name) {
                        //Just define role and permissions if page has been updated
                        PERMISSION.setPermissions(PERMISSION.getPermissions());
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
