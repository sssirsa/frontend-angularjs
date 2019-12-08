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
                                var permissionActions = value.permission;
                                PermRoleStore.defineRole(permissionName, []);
                                //Base permission assignment
                                vm.permissions.push(permissionName);
                                //Specific permission assignment
                                if (permissionActions['POST']) {
                                    vm.permissions.push(permissionName + '__post');
                                }
                                if (permissionActions['GET']) {
                                    vm.permissions.push(permissionName + '__get');
                                }
                                if (permissionActions['PUT']) {
                                    vm.permissions.push(permissionName + '__put');
                                }
                                if (permissionActions['PATCH']) {
                                    vm.permissions.push(permissionName + '__patch');
                                }
                                if (permissionActions['DELETE']) {
                                    vm.permissions.push(permissionName + '__delete');
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
                localStorage['permissions'] = angular.toJson(vm.permissions);
            }
            else {
                $log.error('@definePermissions function, @permissionProvider function, @PERMISSION provider: User is not authenticated');
            }
        }

        //Used for getting frontend optimized permissions (string array)
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

        //Used for validating if a user has an specific permission
        function hasPermission(permissionName) {
            if (PermRoleStore.getRoleDefinition(permissionName)) {
                return true;
            }
            else {
                return false;
            }
        }

        //Used for setting frontend optimized permissions (string array)
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
            hasPermission: hasPermission,
            setPermissions: setPermissions
        };
    }
})();
