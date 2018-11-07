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
        const cabinetUrl = WebRestangular.all(URLS.cabinet);
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

        function getCabinet(id) {
            return cabinetUrl.all(id).customGET();
        }

        function getEntriesByCabinet(id) {

        }

        const warrantyEntry = {
            template: {
                tipo_entrada: 'Garantias',
                cabinet_id: []
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding:'sucursal_id',
                        catalog: {
                            url: URLS.sucursal,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
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
                        binding:'linea_transporte_id',
                        catalog: {
                            url: URLS.linea_transporte,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
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
                        binding:'tipo_transporte_id',
                        catalog: {
                            url: URLS.tipo_transporte,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
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
                        binding:'udn_id',
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
                        binding: 'proyecto_id',
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
            template: {
                tipo_entrada: 'Nuevos',
                cabinet_id: []
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_id',
                        catalog: {
                            url: URLS.sucursal,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.NEW.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
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
                        binding: 'linea_transporte_id',
                        catalog: {
                            url: URLS.linea_transporte,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
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
                        binding: 'tipo_transporte_id',
                        catalog: {
                            url: URLS.tipo_transporte,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
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
                        binding: 'udn_id',
                        catalog: {
                            url: URLS.udn,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.NEW.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.AGENCY'),
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
                        binding: 'proyecto_id',
                        catalog: {
                            url: URLS.proyecto,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.NEW.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.PROJECT'),
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
                    },
                    petition: {
                        binding: 'pedimento_id',
                        catalog: {
                            url: URLS.pedimento,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.NEW.LABELS.PETITION'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.PETITION'),
                        icon: 'fa fa-clipboard-check',
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

        const unrecognizableEntry = {
            tipo_entrada: 'No_Capitalizados',
            no_capitalizados_id: []
        };

        const obsoleteEntry = {
            template: {
                tipo_entrada: 'Obsoletos',
                cabinet_id: []
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_id',
                        catalog: {
                            url: URLS.sucursal,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
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
                        binding: 'linea_transporte_id',
                        catalog: {
                            url: URLS.linea_transporte,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
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
                        binding: 'tipo_transporte_id',
                        catalog: {
                            url: URLS.tipo_transporte,
                            kind: 'Web',
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
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
                        binding: 'udn_id',
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
                        binding: 'proyecto_id',
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

        return {
            createNew: createNew,
            createWarranty: createWarranty,
            createObsolete: createObsolete,
            createUnrecognizable: createUnrecognizable,
            addCabinet: addCabinet,
            detail: detail,
            close: close,
            getCabinet: getCabinet,
            getEntriesByCabinet: getEntriesByCabinet,
            //Constants
            warrantyEntry: warrantyEntry,
            newEntry: newEntry,
            obsoleteEntry: obsoleteEntry,
            unrecognizableEntry: unrecognizableEntry
        }

    }

})();
