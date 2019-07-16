(function () {
    'use strict';

    angular
        .module('app.mainApp.management.users')
        .config(UsersConfig);

    function UsersConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/management/users');
        $stateProvider
            .state('triangular.admin-default.usersManagement', {
                url: '/gestion/usuarios',
                data: {
                    permissions: {
                        only: ['management__manage_system__persona']
                    }
                },
                templateUrl: 'app/mainApp/management/users/manager/usersManager.tmpl.html',
                controller: 'usersManagementController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.MANAGEMENT.USERS.TITLE',
                icon: 'zmdi zmdi-account',
                type: 'dropdown',
                permission: ['management__manage_system__persona'],
                priority: 10,
                children: [
                    {
                        name: 'MAIN.MENU.MANAGEMENT.USERS.MANAGE_USERS',
                        state: 'triangular.admin-default.usersManagement',
                        type: 'link',
                        permission: ['management__manage_system__persona']
                    }
                ]
            }
        );

    }

})();
