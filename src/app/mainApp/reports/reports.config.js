/**
 * Created by Adan on 14/07/2019
 */
(function () {
    angular
        .module("app.mainApp.reports")
        .config(moduleConfig);

    function moduleConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart("app/mainApp/reports");
        $stateProvider
        /* List of report */
            .state('triangular.admin-default.report', {
                url: '/reports/new',
                data: {
                    permissions: {
                        only: ['report_manager__report__reports']
                    }
                },
                templateUrl: 'app/mainApp/reports/report/report.tmpl.html',
                controller: 'reportGenerateController',
                controllerAs: 'vm'
            })
            /* Historical reports generated*/
            .state('triangular.admin-default.historical-report', {
                url: '/reports/historical',
                data: {
                    permissions: {
                        only: ['report_manager__report__history']
                    }
                },
                templateUrl: 'app/mainApp/reports/historical/historical.tmpl.html',
                controller: 'historicalReportController',
                controllerAs: 'vm'
            });
        triMenuProvider.addMenu(
            {
                name: 'REPORT_META.REPORT.TITLE',
                icon: 'fa fa-chart-line',
                type: 'dropdown',
                permission: [
                    "report_manager__report__reports",
                    "report_manager__report__history"
                ],
                priority: 9,
                children: [
                    {
                        name: 'REPORT_META.NEW.TITLE',
                        state: 'triangular.admin-default.report',
                        permission: ['report_manager__report__reports'],
                        type: 'link'
                    },
                    {
                        name: 'REPORT_META.HISTORICAL.TITLE',
                        state: 'triangular.admin-default.historical-report',
                        permission: ['report_manager__report__history'],
                        type: 'link'
                    }
                ]
            }
        );

    }
})();
