(function () {
    'use strict';

    angular
        .module('app.permission')
        .factory('UserService', UserService);

    /* @ngInject */
    function UserService(RoleStore, PermissionStore, Account, AuthService, $rootScope, Users) {
        var permissions = [];
        var roles = {};
        var permissionList = null;
        var service = {
            definePermissions: definePermissions
        };

        function definePermissions() {
            PermissionStore.clearStore();
            RoleStore.clearStore();
            if (AuthService.isAuthenticated()) {

                Account.permissions()
                    .then(function (permissionsSuccess) {

                        Users.profile()
                            .then(function (profileSuccess) {

                                roles['AUTHENTICATED'] = [];
                                if (profileSuccess.ipn) {
                                    roles['IPN'] = [];
                                }
                                else {
                                    roles['EXTERNAL'] = [];
                                }

                                permissionList = permissionsSuccess;

                                angular.forEach(permissionList, function (accountPermission) {
                                    var capability = accountPermission.capacidad;
                                    var unit = accountPermission.unidad_politecnica;
                                    var section = accountPermission.seccion_politecnica;
                                    var module = accountPermission.modulo;

                                    //Iterating trough every permission returned by the backend
                                    angular.forEach(_.keys(accountPermission.permisos), function (permissionAction) {
                                        //Iterating trough the keys (actions) of every permission
                                        if (accountPermission.permisos[permissionAction]) {
                                            //If it has the permission it would be put as a role and as a base permission
                                            permissions.push(permissionAction.toLowerCase() + '|' + accountPermission.capacidad);

                                            if (!roles[permissionAction.toUpperCase()]) {
                                                roles[permissionAction.toUpperCase()] = [];
                                            }

                                            //Adding all the capabilities from the permission into the role
                                            if (!roles[permissionAction.toUpperCase()][capability]) {
                                                roles[permissionAction.toUpperCase()][capability] = {units: []};
                                            }

                                            //Adding all the units from the permission into the capability
                                            if (!roles[permissionAction.toUpperCase()][capability].units[unit]) {
                                                roles[permissionAction.toUpperCase()][capability].units[unit] = {sections: []};
                                            }

                                            //Adding the sections into the Unit object at the permission
                                            if (!roles[permissionAction.toUpperCase()][capability].units[unit].sections[section]) {
                                                roles[permissionAction.toUpperCase()][capability].units[unit].sections[section] = {modules: []};
                                            }

                                            roles[permissionAction.toUpperCase()][capability].units[unit].sections[section].modules.push(module);
                                        }
                                    });
                                });

                                RoleStore.defineManyRoles(roles);
                                PermissionStore.defineManyPermissions(permissions, function (permission) {
                                    return permission;
                                });

                                $rootScope.$emit('finishedPermissionLoad');
                            })
                            .catch(function (profileError) {
                                console.log(profileError);
                            });

                    })
                    .catch();
            }
            else {
                //Not authenticated
            }

        }

        return service;

    }
})();
