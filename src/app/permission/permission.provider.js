(function () {
    angular
        .module('app.permission')
        .factory('PERMISSION', permissionsProvider);
    function permissionsProvider(
        API,
        PermRoleStore,
        PermPermissionStore,
        $log,
        OAuth
    ) {
        var vm = this;
        
        function definePermissions(rawPermissions) {
            if (OAuth.isValidToken()) {
                PermRoleStore.clearStore();
                //Base role definition
                PermRoleStore.defineRole('AUTHENTICATED', []);

                if (rawPermissions) {
                    if (rawPermissions.length > 0) {
                        angular.forEach(rawPermissions,
                            function rawPermissionsIterator(value) {

                                var projectName = '';
                                var appName = '';
                                var moduleName = '';

                                if (value['module']) {
                                    //Module is defined
                                    if (value.module['name']) {
                                        moduleName = '__' + value.module['name'].toLowerCase();
                                    }
                                    if (value.module['app']) {
                                        //App is defined
                                        if (value.module.app['name']) {
                                            appName = '__' + value.module.app['name'].toLowerCase();
                                        }
                                        if (value.module.app['project']) {
                                            //Project is defined
                                            if (value.module.app.project['name']) {
                                                projectName = value.module.app.project['name'].toLowerCase();
                                            }
                                        }
                                    }
                                }
                                //Building permission string
                                var permissionName = projectName
                                    + appName
                                    + moduleName;
                                //Not an empty string
                                if (permissionName) {
                                    //permissionsObject[permissionName] = [];
                                    PermRoleStore.defineRole(permissionName, []);
                                }

                            });
                    }
                    else {
                        $log.error('@definePermissions function, @permissionProvider function, @PERMISSION provider: User has no permissions');
                    }
                }
                else {
                    $log.error('@definePermissions function, @permissionProvider function, @PERMISSION provider: No permissions array');
                }
            }
            else {
                $log.error('@definePermissions function, @permissionProvider function, @PERMISSION provider: User is not authenticated');
            }
            $log.debug(PermRoleStore.getStore());
        }

        vm.permissions = {};

        return {
            definePermissions: definePermissions,
            permissions: vm.permissions
        };
    }
})();
