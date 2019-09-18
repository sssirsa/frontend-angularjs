(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .config(changesConfig);
    function changesConfig(
        triMenuProvider,
        $stateProvider,
        $translatePartialLoaderProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/entries_departures/changes');
        $stateProvider
            .state('triangular.admin-default.changes', {
                url: '/cambios',
                data: {
                    permissions: {
                        only: [
                            'entries_departures__changes__subsidiary'
                        ]
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/changes/manual/manualChanges.tmpl.html',
                controller: 'manualChangesController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'CHANGES.MENU.TITLE',
                icon: 'fas fa-exchange-alt',
                type: 'link',
                permission: [
                    'entries_departures__changes__subsidiary'
                ],
                priority: 6,
                state: 'triangular.admin-default.changes'
            }
        );

    }
    
})();