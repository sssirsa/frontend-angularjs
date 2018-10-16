(function () {
    angular
        .module('app.mainApp.entries')
        .service('MANUAL_ENTRIES', ManualEntriesProvider);

    function ManualEntriesProvider(
        WebRestangular,
        $q,
        URLS,
        Translate
    ) {
        const baseUrl = WebRestangular.all(URLS.manualEntries);
        const urls = URLS.entries;

        function createNew(element) {
            return baseUrl.all(urls.new).customPOST(element);
        }

        function createWarranty(element) {
            return baseUrl.all(urls.warranty).customPOST(element);
        }

        function createObsolete(element) {
            return baseUrl.all(urls.obsolete).customPOST(element);
        }

        function createUnrecognizable(element) {
            return baseUrl.all(urls.unrecognizable).customPOST(element);
        }

        function addCabinet(id, element) {
            return baseUrl.all(urls.addCabinet).all(id).customPUT(element);
        }

        function detail(id) {
            return baseUrl.all(urls.close).all(id).customGET();
        }

        function close(id, element) {
            return baseUrl.all(urls.close).all(id).customPUT(element);
        }

        const warrantyEntry = {
            template: function template() {
                var template = {
                    tipo_entrada: 'Garantias',
                    cabinets: []
                }
                return template;
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        catalog: {
                            url: URLS.sucursal,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.SUBSIDIARY'),
                        icon:'fa fa-warehouse',
                        required: true,
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    transport_line: {
                        catalog: {
                            url: URLS.linea_transporte,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.TRANSPORT_LINE'),
                        icon:'fa fa-pallet',
                        required: true,
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    transport_kind: {
                        catalog: {
                            url: URLS.tipo_transporte,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.TRANSPORT_KIND'),
                        icon:'fa fa-truck',
                        required: true,
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    udn: {
                        catalog: {
                            url: URLS.udn,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true,
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    project: {
                        catalog: {
                            url: URLS.proyecto,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.PROJECT'),
                        icon: 'fa fa-book',
                        required: true,
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    }
                };
                return catalogues;
            }
        };

        const newEntry = {
            tipo_entrada: 'Nuevos',
            cabinets: []
        };

        const unrecognizableEntry = {
            tipo_entrada: 'No_Capitalizados',
            cabinets: []
        };

        const obsoleteEntry = {
            tipo_entrada: 'Obsoletos',
            cabinets: []
        };

        return {
            createNew: createNew,
            createWarranty: createWarranty,
            createObsolete: createObsolete,
            createUnrecognizable: createUnrecognizable,
            addCabinet: addCabinet,
            detail: detail,
            close: close,
            //Constants
            warrantyEntry: warrantyEntry,
            newEntry: newEntry,
            obsoleteEntry: obsoleteEntry,
            unrecognizableEntry: unrecognizableEntry
        }

    }

})();
