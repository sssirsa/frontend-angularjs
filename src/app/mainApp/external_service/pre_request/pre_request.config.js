(function () {
    angular
        .module('app.mainApp.external_service.pre_request')
        .config(preRequestConfig);

    function preRequestConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/external_service/pre_request');
        $stateProvider

            .state('triangular.admin-default.pre-request', {
                url: '/servicio_externo/pre-solicitud',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/external_service/pre_request/preRequest.tmpl.html',
                controller: 'preRequestController',
                controllerAs: 'vm'
            })
        ;
        triMenuProvider.addMenu(
            {
                name: 'EXTERNAL_SERVICE.MENU.TITLE',
                icon: 'fa fa-sign-in-alt',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                priority: 4,
                children: [
                    {
                        name: 'EXTERNAL_SERVICE.MENU.PRE_REQUEST',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.pre-request'
                    }
                ]

            }
        );
    }
})();
