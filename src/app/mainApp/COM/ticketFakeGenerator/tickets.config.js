/**
 * Created by Alejandro Noriega on 29/01/19.
 */
(function () {
    angular
        .module('app.mainApp.com.ticketFakerGenerator')
        .config(ticketsConfig);
    function ticketsConfig($stateProvider, triMenuProvider) {

        $stateProvider

            .state('triangular.admin-default.create-tickets', {
                url: '/crear/tickets',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/COM/ticketFakeGenerator/ticketFakeGenerator.tmpl.html',
                controller: 'ticketFakerController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.COM.FAKE_TICKET',
                icon: 'fas fa-ticket-alt',
                type: 'link',
                state: 'triangular.admin-default.create-tickets',
                permission: ['ADMINISTRADOR', 'TULTITLAN']
            }
        );
    }
})();
