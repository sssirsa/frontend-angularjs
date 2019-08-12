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

        vm.permissions = [];
        //Used for backend returned permissions
        function definePermissions(rawPermissions) {
            if (OAuth.isValidToken()) {
                PermRoleStore.clearStore();
                vm.permissions = [];
                //Base role definition
                PermRoleStore.defineRole('AUTHENTICATED', []);

                if (rawPermissions) {
                    if (rawPermissions.length > 0) {
                        angular.forEach(rawPermissions,
                            function rawPermissionsIterator(value) {
                                var permissionName = value.module;
                                PermRoleStore.defineRole(permissionName, []);
                                vm.permissions.push(permissionName);
                                //var projectName = '';
                                //var appName = '';
                                //var moduleName = '';

                                //if (value['module']) {
                                //    //Module is defined
                                //    if (value.module['name']) {
                                //        moduleName = '__' + value.module['name'].toLowerCase();
                                //    }
                                //    if (value.module['app']) {
                                //        //App is defined
                                //        if (value.module.app['name']) {
                                //            appName = '__' + value.module.app['name'].toLowerCase();
                                //        }
                                //        if (value.module.app['project']) {
                                //            //Project is defined
                                //            if (value.module.app.project['name']) {
                                //                projectName = value.module.app.project['name'].toLowerCase();
                                //            }
                                //        }
                                //    }
                                //}
                                ////Building permission string
                                //var permissionName = projectName
                                //    + appName
                                //    + moduleName;
                                ////Not an empty string
                                //if (permissionName) {
                                //    //permissionsObject[permissionName] = [];
                                //    PermRoleStore.defineRole(permissionName, []);
                                //    vm.permissions.push(permissionName);
                                //}

                            });
                    }
                    else {
                        $log.error('@definePermissions function, @permissionProvider function, @PERMISSION provider: User has no permissions');
                    }
                }
                else {
                    $log.error('@definePermissions function, @permissionProvider function, @PERMISSION provider: No permissions array');
                }
                localStorage['permissions'] = angular.toJson(vm.permissions);
            }
            else {
                $log.error('@definePermissions function, @permissionProvider function, @PERMISSION provider: User is not authenticated');
            }
        }

        //Used for getting frontend optimized permissions
        function getPermissions() {
            if (OAuth.isValidToken()) {
                if (vm.permissions.length === 0) {
                    vm.permissions = angular.fromJson(localStorage['permissions']);
                    //Base role
                    vm.permissions.push('AUTHENTICATED');
                }
            }
            return vm.permissions;
        }

        //Used for setting frontend optimized permissions
        function setPermissions(permissions) {
            if (permissions.length > 0) {
                angular.forEach(permissions, function permissionIterator(permissionName) {
                    PermRoleStore.defineRole(permissionName, []);
                });
            }
            else {
                $log.error('@setPermissions function, @permissionProvider function, @PERMISSION provider: Empty permissions array');
            }
        }

        return {
            definePermissions: definePermissions,
            getPermissions: getPermissions,
            setPermissions: setPermissions
        };
    }
})();
