(function () {
    angular
        .module('app.mainApp.technical_service')
        .config(TechnicalServiceConfig);
    function TechnicalServiceConfig($translatePartialLoaderProvider,
                                    $stateProvider,
                                    triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/technical_service');
        $stateProvider

            .state('triangular.admin-default.inspection', {
                url: '/Inspeccion',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__next_step', 'technical_services__catalogues__symptom',
                            'technical_services__catalogues__stage', 'technical_services__repair__attend_service',
                            'technical_services__repair__cabinet_service', 'technical_services__repair__checklist',
                            'entries_departures__inspections__pre_checklist',
                            'entries_departures__inspections__preliminary_inspection']
                    }
                },
                templateUrl: 'app/mainApp/technical_service/inspection/inspection.tmpl.html',
                controller: 'InspectionController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.puncture', {
                url: '/Pinchado',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__next_step', 'technical_services__repair__puncture',
                            'technical_services__catalogues__stage', 'technical_services__repair__attend_service',
                            'technical_services__repair__cabinet_service']
                    }
                },
                templateUrl: 'app/mainApp/technical_service/puncture/puncture.tmpl.html',
                controller: 'PunctureController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.pressurize', {
                url: '/Presurizado',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__next_step', 'technical_services__repair__pressurize',
                            'technical_services__catalogues__stage', 'technical_services__repair__attend_service',
                            'technical_services__repair__cabinet_service']
                    }
                },
                templateUrl: 'app/mainApp/technical_service/presurize/presurize.tmpl.html',
                controller: 'PresurizeController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.diagnostic', {
                url: '/Diagnostico',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__diagnose_failure', 'technical_services__catalogues__failure_kind',
                            'technical_services__catalogues__next_step', 'technical_services__repair__diagnose',
                            'technical_services__catalogues__stage', 'technical_services__repair__attend_service',
                            'technical_services__repair__cabinet_service']
                    }
                },
                templateUrl: 'app/mainApp/technical_service/diagnosis/diagnosis.tmpl.html',
                controller: 'DiagnosisController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.general_stage', {
                url: '/etapa_de_servicio',
                data: {

                    permissions: {
                        only: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__next_step', 'technical_services__repair__cabinet_service',
                            'technical_services__catalogues__stage', 'technical_services__repair__attend_service']
                    }

                },
                templateUrl: 'app/mainApp/technical_service/generalStage/generalStage.tmpl.html',
                controller: 'GeneralStageController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.INTERNAL_SERVICE',
                icon: 'fa fa-cogs',
                type: 'dropdown',
                permission: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                    'technical_services__catalogues__next_step', 'technical_services__catalogues__symptom',
                    'technical_services__catalogues__stage', 'technical_services__repair__attend_service',
                    'technical_services__repair__cabinet_service', 'technical_services__repair__checklist',
                    'entries_departures__inspections__pre_checklist', 'technical_services__repair__puncture',
                    'technical_services__repair__pressurize', 'technical_services__repair__diagnose',
                    'technical_services__catalogues__diagnose_failure', 'technical_services__catalogues__failure_kind',
                    'entries_departures__inspections__preliminary_inspection'],
                priority: 6,
                children: [
                    {
                        name: 'INSPECTION.INSPECTION_NAME_MENU',
                        state: 'triangular.admin-default.inspection',
                        permission: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__next_step', 'technical_services__catalogues__symptom',
                            'technical_services__catalogues__stage', 'technical_services__repair__attend_service',
                            'technical_services__repair__cabinet_service', 'technical_services__repair__checklist',
                            'entries_departures__inspections__pre_checklist',
                            'entries_departures__inspections__preliminary_inspection'],
                        type: 'link'
                    },
                    {
                        name: 'PUNCTURE.PUNCTURE_MENU',
                        state: 'triangular.admin-default.puncture',
                        permission: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__next_step', 'technical_services__repair__puncture',
                            'technical_services__catalogues__stage', 'technical_services__repair__attend_service',
                            'technical_services__repair__cabinet_service'],
                        type: 'link'
                    },
                    {
                        name: 'PRESURIZE.PRESURIZE_MENU',
                        state: 'triangular.admin-default.pressurize',
                        permission: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__next_step', 'technical_services__repair__pressurize',
                            'technical_services__catalogues__stage', 'technical_services__repair__attend_service',
                            'technical_services__repair__cabinet_service'],
                        type: 'link'
                    },
                    {
                        name: 'DIAGNOSIS.DIAGNOSIS',
                        state: 'triangular.admin-default.diagnostic',
                        permission: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__diagnose_failure', 'technical_services__catalogues__failure_kind',
                            'technical_services__catalogues__next_step', 'technical_services__repair__diagnose',
                            'technical_services__catalogues__stage', 'technical_services__repair__attend_service',
                            'technical_services__repair__cabinet_service'],
                        type: 'link'
                    },
                    {
                        name: 'GENERAL_STAGE.TITLE',
                        state: 'triangular.admin-default.general_stage',
                        permission: ['technical_services__catalogues__action', 'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__next_step', 'technical_services__repair__cabinet_service',
                            'technical_services__catalogues__stage', 'technical_services__repair__attend_service'],
                        type: 'link'
                    }

                ]
            }
        );

    }
})();
