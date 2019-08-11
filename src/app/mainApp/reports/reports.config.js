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
        /* Available reports list */
            .state('triangular.admin-default.reports-list', {
                url: '/reportes/listado',
                data: {
                    permissions: {
                        only: ['report_manager__report__reports']
                    }
                },
                templateUrl: 'app/mainApp/reports/list/reportList.tmpl.html',
                controller: 'reportsListController',
                controllerAs: 'vm'
            })
            /* Historical reports generated*/
            .state('triangular.admin-default.historical-report', {
                url: '/reportes/historico',
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
                        state: 'triangular.admin-default.reports-list',
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
