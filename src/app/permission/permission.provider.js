(function () {
    angular
        .module('app.permission')
        .factory('PERMISSION', permissionsProvider);
    function permissionsProvider(
        API,
        PermRoleStore,
        PermPermissionStore,
        User,
        $log,
        OAuth
    ) {
        return {
            definePermissions: definePermissions
        };

        function definePermissions() {
            if (OAuth.isValidToken()) {
                //Defining base role
                PermRoleStore.defineRole('AUTHENTICATED', []);

                var user = User.getUser();
                var rawPermissions = user['permissions'];

                if (rawPermissions) {
                    if (rawPermissions.length > 0) {
                    //New permissions var initializing
                        var permissionsArray = [];
                    }
                    else {
                        $log.error('@definePermissions function, @permissionProvider function, @PERMISSION provider: User has no permissions');
                    }
                }
                else {
                    $log.error('@definePermissions function, @permissionProvider function, @PERMISSION provider: User has no permissions array');
                }
            }
            else {
                $log.error('@definePermissions function, @permissionProvider function, @PERMISSION provider: User is not authenticated');
            }
        }

    }
})();
