(function () {
    'use strict';

    angular
        .module('app.mainApp.management.users')
        .config(UsersConfig);

    function UsersConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/management/users');
        $stateProvider
            .state('triangular.admin-default.usersCreate', {
                url: '/gestion_user',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/management/users/new/usersCreate.html',
                controller: 'usersCreateController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.usersManagement', {
                url: '/admin_user',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/management/users/manage/usersManagement.html',
                controller: 'usersManagementController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.CRUD_USER',
                icon: 'zmdi zmdi-account',
                type: 'dropdown',
                permission: ['ADMINISTRADOR'],
                priority: 2,
                children: [
                    {
                        name: 'MAIN.MENU.NEW_USER',
                        state: 'triangular.admin-default.usersCreate',
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.ADMIN_USER',
                        state: 'triangular.admin-default.usersManagement',
                        type: 'link'
                    }
                ]
            }
        );

    }

})();
