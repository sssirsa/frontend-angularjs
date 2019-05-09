/**
 * Created by Emmanuel on 16/10/2016.
 */
(function () {
    angular
        .module("app.mainApp.reports")
        .config(moduleConfig);

    function moduleConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart("app/mainApp/reports");
        $stateProvider
            .state("triangular.admin-default.reports", {
                url: "/reports",
                data: {
                    permissions: {
                        only: ["ADMINISTRADOR"]
                    }
                },
                params: {
                    id: null
                },
                templateUrl: "app/mainApp/reports/manager/reportesCRUD.tmpl.html",
                controller: "ReportesCrudController",
                controllerAs: "vm"
            })
            .state("triangular.admin-default.reportModify", {
                url: "/reportsCrear/:id/",
                data: {
                    permissions: {
                        only: ["ADMINISTRADOR"]
                    }
                },
                params: {
                    id: null
                },
                templateUrl: "app/mainApp/reports/edicion/reportEdicion.tmpl.html",
                controller: "reportEditionController",
                controllerAs: "vm"
            })
            .state("triangular.admin-default.list", {
                url: "/list",
                data: {
                    permissions: {
                        only: ["ADMINISTRADOR"]
                    }
                },
                params: {
                    id: null
                },
                templateUrl: "app/mainApp/reports/list/listReports.tmpl.html",
                controller: "ListReportsController",
                controllerAs: "vm"
            })
            .state("triangular.admin-default.reporteProduccion", {
                url: "/reporte",
                data: {
                    permissions: {
                        only: ["ADMINISTRADOR"]
                    }
                },
                params: {
                    id: null
                },
                templateUrl: "app/mainApp/reports/custom/reporteInsumos/reporteProduccion.tmpl.html",
                controller: "reporteProduccionController",
                controllerAs: "vm"
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.REPORTS.TITLE',
                icon: 'fa fa-chart-line',
                type: 'dropdown',
                permission_old: ["ADMINISTRADOR"],
                priority: 9,
                children: [
                    {
                        name: 'MAIN.MENU.REPORTS.ADMIN',
                        state: 'triangular.admin-default.reports',
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.REPORTS.LIST',
                        state: 'triangular.admin-default.list',
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.REPORTS.CUSTOM.TITLE',
                        type: 'dropdown',
                        children: [
                            {
                                name: 'MAIN.MENU.REPORTS.CUSTOM.PRODUCTION',
                                state: 'triangular.admin-default.reporteProduccion',
                                type: 'link'
                            }
                        ]
                    }
                ]
            }
        );

    }
})();
