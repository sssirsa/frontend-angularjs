/**
 * Created by franciscojaviercerdamartinez on 02/06/16.
 */
(function () {
    'use strict';
    angular
        .module('app.mainApp.welcome')
        .config(WelcomeModuleConfig);

    function WelcomeModuleConfig($stateProvider,$translatePartialLoaderProvider, triMenuProvider){
        $translatePartialLoaderProvider.addPart('app/mainApp/welcome');
        $stateProvider

            .state('triangular.admin-default.welcome', {
                url: '/bienvenida',
                data: {
                    permissions: {
                        only: ['AUTHENTICATED']
                    }
                },
                templateUrl: 'app/mainApp/welcome/welcome.tmpl.html',
                controller: 'WelcomeController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.WELCOME',
                icon: 'zmdi zmdi-home',
                type: 'link',
                priority: 1,
                permission:['AUTHENTICATED'],
                state: 'triangular.admin-default.welcome'
            }
        );

    }

} )();
