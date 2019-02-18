(function () {
    angular
        .module('app.mainApp.entries_departures.entries')
        .service('MANUAL_ENTRIES', ManualEntriesProvider);

    function ManualEntriesProvider(
        API,
        $q,
        URLS,
        Translate,
        EnvironmentConfig
    ) {
        const entriesUrl = API
            .all(URLS.entries_departures.base)
            .all(URLS.entries_departures.entries.base);
        const inventoryUrl = API
            .all(URLS.management.base)
            .all(URLS.management.inventory.base);
        const managementUrl = API
            .all(URLS.management.base);

        const control = URLS.management.control;
        const entries = URLS.entries_departures.entries;
        const inspection = URLS.entries_departures.inspection;
        const inventory = URLS.management.inventory;

        function createNew(element) {
            return entriesUrl.all(entries.new).customPOST(element);
        }

        function createWarranty(element) {
            return entriesUrl.all(entries.warranty).customPOST(element);
        }

        function createObsolete(element) {
            return entriesUrl.all(entries.obsolete).customPOST(element);
        }

        function createWarehouse(element) {
            return entriesUrl.all(entries.warehouse).customPOST(element);
        }

        function createUnrecognizable(element) {
            return entriesUrl.all(entries.unrecognizable).customPOST(element);
        }

        function addCabinet(id, element) {
            return entriesUrl.all(entries.addCabinet).all(id).customPUT(element);
        }

        function detail(id) {
            return entriesUrl.all(id).customGET();
        }

        function close(id, element) {
            return entriesUrl.all(entries.close).all(id).customPUT(element);
        }

        function getCabinet(id) {
            /*
             * RETURNS
             *   -Cabinet exists in database and can enter (commonly a WARRANTY entry or a JUST Created)
             *       +Cabinet full object and can_enter in true
             *   -Cabinet exist in database and can't enter (Cabinet in any warehouse)
             *       +Cabinet simplified object and can_enter in false
             *   -Cabinet doesn't exists, so it can enter (commonly WARRANTYS entry)
             *       +Cabinet in null and can_enter in true
             *   -Backend error
             *       +Cabinet in null, cant_enter in false, error property added to return the error response
             */

            let deferred = $q.defer();
            let response = {
                can_enter: false,
                cabinet: null
            };
            getCabinetInSubsidiary(id)
                .then(function cabinetsInSubsiadiarySuccessCallback(apiResponse) {
                    //Cabinet can't enter
                    response.can_enter = false;
                    response.cabinet = apiResponse.cabinet;
                    deferred.resolve(response);
                })
                .catch(function cabinetsInSubsiadiaryErrorCallback() {
                    //Cabinet can enter
                    response.can_enter = true;
                    inventoryUrl.all(inventory.cabinet).all(id).customGET()
                        .then(function cabinetSuccessCallback(apiCabinet) {
                            //Cabinet exists
                            response.cabinet = apiCabinet;
                            deferred.resolve(response);
                        })
                        .catch(function cabinetErrorCallback(errorResponse) {
                            if (errorResponse.status === 404) {
                                //Cabinet doesn't exists
                                response.cabinet = null;
                                deferred.resolve(response);
                            }
                            else {
                                //Any other error from backend
                                response.error = errorResponse;
                                deferred.reject(response);
                            }
                        });
                });

            return deferred.promise;
        }

        function createAutomaticInspection(assetID) {
            const preliminaryInspection = {
                cabinet_id: assetID,
                sticker_id: 8,
                rodajas: 0,
                canastillas: 0,
                rejillas_traseras: 0,
                rejillas_delanteras: 0,
                puertas: 0,
                pintura: true,
                lavado: true,
                emplayado: false,
                vacio_mercancia: true
            };
            return entriesUrl
                .all(inspection.base)
                .all(inspection.preliminary_inspection)
                .customPOST(preliminaryInspection);
        }

        //Internal functions
        function getCabinetInSubsidiary(id) {
            return managementUrl
                .all(control.base)
                .all(control.cabinet_in_subsidiary)
                .all(id).customGET();
        }

        function getEntriesByCabinet(id) {

        }

        const warrantyEntry = {
            template: function () {
                return {
                    tipo_entrada: 'Garantias',
                    cabinets_id: [],
                    descripcion: '',
                    nombre_chofer: ''
                }
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            kind: 'Generic',
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,
                            kind: 'Generic',
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,
                            kind: 'Generic',
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.udn,
                            kind: 'Generic',
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.project,
                            kind: 'Generic',
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
            template: function () {
                return {
                    tipo_entrada: 'Nuevos',
                    cabinets_id: [],
                    descripcion: '',
                    nombre_chofer: ''
                }
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            kind: 'Generic',
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,
                            kind: 'Generic',
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,
                            kind: 'Generic',
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.udn,
                            kind: 'Generic',
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.project,
                            kind: 'Generic',
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.pediments,
                            kind: 'Generic',
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
            template: function () {
                return {
                    tipo_entrada: 'No_Capitalizados',
                    no_capitalizados_id: [],
                    descripcion: '',
                    nombre_chofer: ''
                }
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.SUBSIDIARY'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.TRANSPORT_LINE'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.TRANSPORT_KIND'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.udn,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.AGENCY'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.project,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.PROJECT'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.pediments,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.PETITION'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.PETITION'),
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

        const obsoleteEntry = {
            template: function () {
                return {
                    tipo_entrada: 'Obsoletos',
                    cabinets_id: [],
                    descripcion: '',
                    nombre_chofer: ''
                }
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.OBSOLETE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.OBSOLETE.HINTS.SUBSIDIARY'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.OBSOLETE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.OBSOLETE.HINTS.TRANSPORT_LINE'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.OBSOLETE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.OBSOLETE.HINTS.TRANSPORT_KIND'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.udn,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.OBSOLETE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('ENTRIES.OBSOLETE.HINTS.AGENCY'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.project,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.OBSOLETE.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.OBSOLETE.HINTS.PROJECT'),
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

        const warehouseEntry = {
            template: function () {
                return {
                    tipo_entrada: 'Almacen',
                    cabinets_id: [],
                    descripcion: '',
                    nombre_chofer: ''
                }
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.SUBSIDIARY'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.TRANSPORT_LINE'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.TRANSPORT_KIND'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.udn,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.AGENCY'),
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
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.project,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.PROJECT'),
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
            createWarehouse: createWarehouse,
            createUnrecognizable: createUnrecognizable,
            addCabinet: addCabinet,
            detail: detail,
            close: close,
            getCabinet: getCabinet,
            getEntriesByCabinet: getEntriesByCabinet,
            createAutomaticInspection: createAutomaticInspection,
            //Constants
            warrantyEntry: warrantyEntry,
            newEntry: newEntry,
            obsoleteEntry: obsoleteEntry,
            warehouseEntry: warehouseEntry,
            unrecognizableEntry: unrecognizableEntry
        }

    }

})();
