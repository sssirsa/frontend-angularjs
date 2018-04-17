/**
 * Created by franciscojaviercerdamartinez on 02/06/16.
 */
(function () {
    'use strict';
    angular
        .module('app.mainApp.bienvenida')
        .config(moduleConfig);

    function moduleConfig($stateProvider,$translatePartialLoaderProvider, triMenuProvider){
        $translatePartialLoaderProvider.addPart('app/mainApp/bienvenida');
        $stateProvider

            .state('triangular.admin-default.bienvenida', {
                url: '/bienvenida',
                data: {
                    roles: ['Administrador','Capturista','Cliente','Tecnico A','Tecnico B','Tecnico C','Tecnico D','Tecnico E', 'Tultitlan']
                },
                templateUrl: 'app/mainApp/bienvenida/index.tmpl.html',
                controller: 'bienvenidaController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.WELCOME',
                icon: 'zmdi zmdi-home',
                type: 'link',
                permission: ['Administrador','Capturista','Cliente','Tecnico A','Tecnico B','Tecnico C','Tecnico D','Tecnico E', 'Tultitlan'],
                priority: 1,
                state: 'triangular.admin-default.bienvenida'
            }
        );

    }

} )();
