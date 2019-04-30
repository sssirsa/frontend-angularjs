/**
 * Created by franciscojaviercerdamartinez on 1/28/19.
 */
(function () {
    angular
        .module('app.mainApp.com.incidences')
        .config(incidencesConfig);
    function incidencesConfig($stateProvider, triMenuProvider) {

        $stateProvider

            .state('triangular.admin-default.incidences_tickets', {
                url: '/incidencias_y_tickets',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/COM/incidences/incidence.tmpl.html',
                controller: 'IncidencesController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.COM.TICKETS_INCIDENCES',
                icon: 'fas fa-ticket-alt',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                priority:10,
                children: [
                    {
                        name: 'MAIN.MENU.COM.MANAGEMENT_NOTIFICATION',
                        state: 'triangular.admin-default.incidences_tickets',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        type: 'link'
                    }
                ]
            }
        );
    }
})();
