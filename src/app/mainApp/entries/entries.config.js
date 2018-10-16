(function () {
    angular
        .module('app.mainApp.entries')
        .config(entriesConfig);

    function entriesConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/entries');
        $stateProvider
            /* New asset entries */
            .state('triangular.admin-default.entry-new-manual', {
                url: '/entrada/nuevos/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries/new/manual/newManualEntry.tmpl.html',
                controller: 'newManualEntryController',
                controllerAs: 'vm'
            })
            //.state('triangular.admin-default.entry-new-massive', {
            //    url: '/entrada/nuevos/masiva',
            //    data: {
            //        permissions: {
            //            only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
            //        }
            //    },
            //    templateUrl: 'app/mainApp/entries/new/massive/newMassiveEntry.tmpl.html',
            //    controller: 'newMassiveEntryController',
            //    controllerAs: 'vm'
            //})
            /* Warranty asset entries */
            .state('triangular.admin-default.entry-warranty-manual', {
                url: '/entrada/garantias/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries/warranty/manual/warrantyManualEntry.tmpl.html',
                controller: 'warrantyManualEntryController',
                controllerAs: 'vm'
            })
            //.state('triangular.admin-default.entry-warranty-massive', {
            //    url: '/entrada/garantias/masiva',
            //    data: {
            //        permissions: {
            //            only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
            //        }
            //    },
            //    templateUrl: 'app/mainApp/entries/warranty/massive/warrantyMassiveEntry.tmpl.html',
            //    controller: 'warrantyMassiveEntryController',
            //    controllerAs: 'vm'
            //})
            /* Unrecognizable asset entries */
            .state('triangular.admin-default.entry-unrecognizable-manual', {
                url: '/entrada/no_capitalizados/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries/unrecognizable/manual/unrecognizableManualEntry.tmpl.html',
                controller: 'unrecognizableManualEntryController',
                controllerAs: 'vm'
            })
            //.state('triangular.admin-default.entry-unrecognizable-massive', {
            //    url: '/entrada/no_capitalizados/masiva',
            //    data: {
            //        permissions: {
            //            only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
            //        }
            //    },
            //    templateUrl: 'app/mainApp/entries/unrecognizable/massive/unrecognizableMassiveEntry.tmpl.html',
            //    controller: 'unrecognizableMassiveEntryController',
            //    controllerAs: 'vm'
            //})
            /* Obsolete asset entries */
            .state('triangular.admin-default.entry-obsolete-manual', {
                url: '/entrada/obsoletos/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries/obsolete/manual/obsoleteManualEntry.tmpl.html',
                controller: 'obsoleteManualEntryController',
                controllerAs: 'vm'
            })
            //.state('triangular.admin-default.entry-obsolete-massive', {
            //    url: '/entrada/obsoletos/masiva',
            //    data: {
            //        permissions: {
            //            only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
            //        }
            //    },
            //    templateUrl: 'app/mainApp/entries/obsolete/massive/obsoleteMassiveEntry.tmpl.html',
            //    controller: 'obsoleteMassiveEntryController',
            //    controllerAs: 'vm'
            //})
            ;
        triMenuProvider.addMenu(
            {
                name: 'ENTRIES.MENU.TITLE',
                icon: 'fa fa-sign-in-alt',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                priority: 4,
                children: [
                    {
                        name: 'ENTRIES.MENU.NEW',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.entry-new-manual'
                    },
                    {
                        name: 'ENTRIES.MENU.WARRANTIES',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.entry-warranty-manual'
                    },
                    {
                        name: 'ENTRIES.MENU.UNRECOGNIZABLE',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.entry-unrecognizable-manual'
                    },
                    {
                        name: 'ENTRIES.MENU.OBSOLETE',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.entry-obsolete-manual'
                    }
                ]

            }
        );
    }
})();
