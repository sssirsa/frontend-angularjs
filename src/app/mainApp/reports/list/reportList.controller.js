(function () {
    'use strict';
    angular
        .module('app.mainApp.reports')
        .controller('reportsListController', ReportsListController);
    function ReportsListController(
        URLS,
        Translate,
        EnvironmentConfig,
        PAGINATION
    ) {
        var vm = this;

        vm.url = EnvironmentConfig.site.rest.api
            + '/' + URLS.reports.base
            + '/' + URLS.reports.report.base
            + '/' + URLS.reports.report.new.base;
        vm.name = Translate.translate('REPORT_META.NEW.TITLE');
        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('REPORT_META.NEW.LABELS.SEARCH');
        vm.nextButtonText = Translate.translate('REPORT_META.NEW.LABELS.NEXT');
        vm.previousButtonText = Translate.translate('REPORT_META.NEW.LABELS.PREVIOUS');
        vm.loadMoreButtonText = Translate.translate('REPORT_META.NEW.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = Translate.translate('REPORT_META.NEW.LABELS.REMOVE_FILTER');

        //Messages
        vm.loadingMessage = Translate.translate('REPORT_META.NEW.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            LIST: {
                elements: PAGINATION.elements,
                mode: PAGINATION.mode,
                pagination: {
                    total: PAGINATION.total,
                    limit: PAGINATION.limit,
                    offset: PAGINATION.offset,
                    pageSize: PAGINATION.pageSize
                },
                fields: [
                    {
                        type: 'text',
                        model: 'name',
                        label: 'Nombre'
                    },
                    {
                        type: 'text',
                        model: 'description',
                        label: 'Descripción',
                        nullOrEmpty: 'sin descripción disponible'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Reportes',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando reportes...'
                },
                filters: [
                    {
                        type: 'contains',
                        model: 'name',
                        header: 'por Nombre',
                        label: 'Nombre del reporte',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'contains',
                        model: 'description',
                        header: 'por Descripción',
                        label: 'Descripción del reporte',
                        field: {
                            type: 'text'
                        }
                    }
                ]
            }
        };

        function onElementSelect() {
            //Here goes the handling for element selection, such as detail page navigation
        }
    }


})();
