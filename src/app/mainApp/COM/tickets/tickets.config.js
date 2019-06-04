/**
 * Created by Alejandro Noriega on 29/01/19.
 */
(function () {
    angular
        .module('app.mainApp.com.tickets')
        .config(ticketsConfig);
    function ticketsConfig($stateProvider, triMenuProvider) {

        $stateProvider

            .state('triangular.admin-default.list-tickets', {
                url: '/tickets',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/COM/tickets/tickets.tmpl.html',
                controller: 'TicketsController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.COM.MANAGEMENT_TICKETS',
                icon: 'fas fa-ticket-alt',
                type: 'link',
                state: 'triangular.admin-default.list-tickets',
                permission_old: ['ADMINISTRADOR', 'TULTITLAN']
            }
        );
    }
})();
