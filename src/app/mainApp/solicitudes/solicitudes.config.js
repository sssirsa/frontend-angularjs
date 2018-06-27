/**
 * Created by lockonDaniel on 6/2/16.
 */
(function () {
    angular
        .module('app.mainApp.solicitudes_old')
        .config(moduleConfig);

    function moduleConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/solicitudes');
        $stateProvider
            .state('triangular.admin-default.realizarSolicitud', {
                url: '/realizarSolicitudes',
                data: {
                    roles: ['ADMINISTRADOR','CAPTURISTA','CLIENTE', 'TULTITLAN']
                },
                templateUrl: 'app/mainApp/solicitudes/solicitud/crear/realizarSolicitud.tmpl.html',
                controller: 'realizarSolicitudController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.buscarSolicitud', {
                url: '/buscarSolicitud',
                data: {
                    roles: ['ADMINISTRADOR','CAPTURISTA','CLIENTE', 'TULTITLAN']
                },
                templateUrl: 'app/mainApp/solicitudes/solicitud/buscar/buscarSolicitud.html',
                controller: 'buscarSolicitudController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.calendar', {
                url: '/calendar',
                data: {
                    roles: ['ADMINISTRADOR']
                },
                templateUrl: 'app/mainApp/solicitudes/calendario/calendar.tmpl.html',
                controller: 'CalendarController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.SOLICITUD',
                icon: 'zmdi zmdi-bookmark',
                type: 'dropdown',
                permission: ['ADMINISTRADOR','CAPTURISTA','CLIENTE', 'TULTITLAN'],
                priority: 99,
                children: [
                    {
                        name: 'MAIN.MENU.SEARCH_SOLICITUD',
                        state: 'triangular.admin-default.buscarSolicitud',
                        permission: ['ADMINISTRADOR','CAPTURISTA','CLIENTE', 'TULTITLAN'],
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.CREATES_SOLICITUD',
                        state: 'triangular.admin-default.realizarSolicitud',
                        permission: ['ADMINISTRADOR','CAPTURISTA','CLIENTE', 'TULTITLAN'],
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.CALENDAR',
                        state: 'triangular.admin-default.calendar',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        type: 'link'

                    }
                ]
            }
        );

    }


})();
