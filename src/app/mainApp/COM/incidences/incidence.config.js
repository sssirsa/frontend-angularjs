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
                controller: 'incidencesController',
                controllerAs: 'vm'
            });

    }
})();
