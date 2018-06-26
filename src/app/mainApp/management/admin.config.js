/**
 * Created by franciscojaviercerdamartinez on 02/06/16 ffff.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.admin')
        .config(moduleConfig);

    function moduleConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/management');
        $stateProvider
            .state('triangular.admin-default.gestion_user', { //Nombre del state
                url: '/gestion_user', //Nombre que quiero en mi url
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/admin/register_user.tmpl.html', //Dirección del archivo a usar
                controller: 'gestion_userController', //nombre del controlador
                controllerAs: 'vm' //se renombra al scope
            })
            .state('triangular.admin-default.admin_user', {
                // set the url of this page
                url: '/admin_user',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/admin/admin_user.tmpl.html',
                // set the controller to load for this page
                controller: 'admin_userController',
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
                        state: 'triangular.admin-default.gestion_user',
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.ADMIN_USER',
                        state: 'triangular.admin-default.admin_user',
                        type: 'link'
                    }
                ]
            }
        );

    }

})();
