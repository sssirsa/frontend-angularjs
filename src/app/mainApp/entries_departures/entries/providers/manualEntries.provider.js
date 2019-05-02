(function () {
    angular
        .module('app.mainApp.entries_departures.entries')
        .factory('MANUAL_ENTRIES', ManualEntriesProvider);

    function ManualEntriesProvider(
        API,
        $q,
        URLS,
        Translate,
        EnvironmentConfig
    ) {

        var entriesDeparturesUrl = API
            .all(URLS.entries_departures.base);
        var entriesUrl = API
            .all(URLS.entries_departures.base)
            .all(URLS.entries_departures.entries.base);
        var inventoryUrl = API
            .all(URLS.management.base)
            .all(URLS.management.inventory.base);
        var managementUrl = API
            .all(URLS.management.base);

        var control = URLS.management.control;
        var entries = URLS.entries_departures.entries;
        var inspections = URLS.entries_departures.inspections;
        var inventory = URLS.management.inventory;

        function createNew(element) {
            return entriesUrl.all(entries.new).customPOST(element);
        }

        function createRepair(element) {
            return entriesUrl.all(entries.repair).customPOST(element);
        }

        function createWarranty(element) {
            return entriesUrl.all(entries.warranty).customPOST(element);
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

            var deferred = $q.defer();
            var response = {
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
            var preliminaryInspection = {
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
            return entriesDeparturesUrl
                .all(inspections.base)
                .all(inspections.preliminary_inspection)
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
            return id;
        }

        var warrantyEntry = {
            template: function () {
                return {
                    cabinets_id: [],
                    ife_chofer: null,
                    linea_transporte_id: null,
                    nombre_chofer: '',
                    tipo_transporte_id: null
                };
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
                            option: 'nombre',
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
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
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
                            option: 'razon_social',
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
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
                        required: true
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
                            option: 'descripcion',
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
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
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
                            option: 'agencia',
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
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
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
                            option: 'descripcion',
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
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.PROJECT'),
                        icon: 'fa fa-book',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        var repairEntry = {
            template: function () {
                return {
                    cabinets_id: [],
                    establecimiento_origen_id: null,
                    ife_chofer: null,
                    linea_transporte_id: null,
                    nombre_chofer: '',
                    tipo_transporte_id: null
                };
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
                            name: Translate.translate('ENTRIES.REPAIR.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
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
                        hint: Translate.translate('ENTRIES.NEW.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    transport_line: {
                        binding: 'linea_transporte_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.REPAIR.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
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
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
                        required: true
                    },
                    transport_kind: {
                        binding: 'tipo_transporte_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.REPAIR.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
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
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    udn: {
                        binding: 'udn_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.udn,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.REPAIR.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
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
                        hint: Translate.translate('ENTRIES.NEW.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    project: {
                        binding: 'proyecto_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.project,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.REPAIR.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
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
                        hint: Translate.translate('ENTRIES.NEW.HINTS.PROJECT'),
                        icon: 'fa fa-book',
                        required: true
                    },
                    petition: {
                        binding: 'pedimento_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,
                            kind: 'Generic',
                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
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
                        hint: Translate.translate('ENTRIES.NEW.HINTS.PETITION'),
                        icon: 'fa fa-clipboard-check',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        var unrecognizableEntry = {
            template: function () {
                return {
                    ife_chofer: null,
                    linea_transporte_id: null,
                    nombre_chofer: '',
                    no_capitalizados_id: [],
                    tipo_transporte_id: null
                };
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
                            option: 'nombre',
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
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
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
                            option: 'razon_social',
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
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
                        required: true
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
                            option: 'descripcion',
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
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
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
                            option: 'agencia',
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
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
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
                            option: 'descripcion',
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
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.PROJECT'),
                        icon: 'fa fa-book',
                        required: true
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
                            option: 'descripcion',
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
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.PETITION'),
                        icon: 'fa fa-clipboard-check',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        var warehouseEntry = {
            template: function () {
                return {
                    cabinets_id: [],
                    ife_chofer: null,
                    linea_transporte_id: null,
                    nombre_chofer: '',
                    tipo_transporte_id: null
                };
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
                            option: 'nombre',
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
                        hint: Translate.translate('ENTRIES.OBSOLETE.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
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
                            option: 'razon_social',
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
                        hint: Translate.translate('ENTRIES.OBSOLETE.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
                        required: true
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
                            option: 'descripcion',
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
                        hint: Translate.translate('ENTRIES.OBSOLETE.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
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
                            option: 'agencia',
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
                        hint: Translate.translate('ENTRIES.OBSOLETE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
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
                            option: 'descripcion',
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
                        hint: Translate.translate('ENTRIES.OBSOLETE.HINTS.PROJECT'),
                        icon: 'fa fa-book',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        return {
            createNew: createNew,
            createWarranty: createWarranty,
            createRepair: createRepair,
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
            repairEntry: repairEntry,
            newEntry: newEntry,
            warehouseEntry: warehouseEntry,
            unrecognizableEntry: unrecognizableEntry
        };

    }

})();
