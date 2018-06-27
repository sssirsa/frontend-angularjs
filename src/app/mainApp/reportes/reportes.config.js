/**
 * Created by Emmanuel on 16/10/2016.
 */
(function () {
    angular
        .module("app.mainApp.reportes")
        .config(moduleConfig);

    function moduleConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart("app/mainApp/reportes");
        $stateProvider
            .state("triangular.admin-default.reportes", {
                url: "/reportes",
                data: {
                    permissions: {
                        only: ["ADMINISTRADOR"]
                    }
                },
                params: {
                    id: null
                },
                templateUrl: "app/mainApp/reportes/manager/reportesCRUD.tmpl.html",
                controller: "ReportesCrudController",
                controllerAs: "vm"
            })
            .state("triangular.admin-default.reportModify", {
                url: "/reportesCrear/:id/",
                data: {
                    permissions: {
                        only: ["ADMINISTRADOR"]
                    }
                },
                params: {
                    id: null
                },
                templateUrl: "app/mainApp/reportes/edicion/reportEdicion.tmpl.html",
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
                templateUrl: "app/mainApp/reportes/list/listReports.tmpl.html",
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
                templateUrl: "app/mainApp/reportes/custom/reporteInsumos/reporteProduccion.tmpl.html",
                controller: "reporteProduccionController",
                controllerAs: "vm"
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.REPORTS.TITLE',
                icon: 'fa fa-line-chart',
                type: 'dropdown',
                permission: ["ADMINISTRADOR"],
                priority: 9,
                children: [
                    {
                        name: 'MAIN.MENU.REPORTS.ADMIN',
                        state: 'triangular.admin-default.reportes',
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
