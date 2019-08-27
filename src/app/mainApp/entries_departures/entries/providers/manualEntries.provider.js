(function () {
    angular
        .module('app.mainApp.entries_departures.entries')
        .factory('MANUAL_ENTRIES', ManualEntriesProvider);

    function ManualEntriesProvider(
        $q,
        API,
        EnvironmentConfig,
        PAGINATION,
        QUERIES,
        Translate,
        URLS,
        User
    ) {

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
            return entriesUrl.all(entries.all).all(id).customGET();
        }

        function getAssetStatus(entryId, page) {
            var params;
            if (page) {
                params = {
                    limit: PAGINATION.pageSize,
                    offset: PAGINATION.pageSize * (page - 1)
                };
            }
            return entriesUrl.all(entries.close).all(entryId).customGET(null, params);
        }

        function close(id, element) {
            return entriesUrl.all(entries.close).all(id).customPUT(element);
        }

        function getCabinet(id) {
            /*
             * RETURNS
             *   -Cabinet exists in database and can enter
             *      (a WARRANTY entry, a REPAIR
             *      or a JUST Created a.k.a: NEW)
             *       +Cabinet full object and can_enter in true
             *   -Cabinet exist in database and can't enter
             *   (Cabinet in any warehouse)
             *       +Cabinet simplified object and can_enter in false
             *   -Cabinet doesn't exists, so it can enter
             *      (commonly WARRANTYS entry or NEW entry)
             *       +Cabinet in null and can_enter in true
             *   -Backend error
             *       +Cabinet in null, cant_enter in false,
             *       error property added to return the error response
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

        //Entry Kind must be onoe pf the following
        //new, warehouse, repair, unrecognizable, warranty
        //Otherwise, all entries are returned
        //Page parameter is used for pagination,
        //without it just first page is provided
        function listEntries(entryKind, page) {
            var user = User.getUser();
            var url = entriesUrl;
            var params;
            //Pagination params building
            if (page) {
                params = {
                    limit: PAGINATION.pageSize,
                    offset: PAGINATION.pageSize * (page - 1)
                };
                //Adding ordering parameter
                params[QUERIES.ordering] = '-id';
            }
            //Subsidiary or Agency query
            if (user.sucursal) {
                params[QUERIES.entries_departures.by_subsidiary] = user['sucursal'].id;
            }
            if (user.udn) {
                params[QUERIES.entries_departures.by_agency] = user['udn'].id;
            }
            if (entryKind) {
                //An entry kind has been provided
                switch (entryKind) {
                    case 'new':
                        url = url.all(entries.new);
                        break;
                    case 'warehouse':
                        url = url.all(entries.warehouse);
                        break;
                    case 'repair':
                        url = url.all(entries.repair);
                        break;
                    case 'unrecognizable':
                        url = url.all(entries.unrecognizable);
                        break;
                    case 'warranty':
                        url = url.all(entries.warranty);
                        break;
                    default:
                        url = url.all(entries.all);
                }
            }
            else {
                //Entry kind not provided, so return all
                url = url.all(entries.all);
            }
            return url.customGET(null, params);
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
                        binding: 'sucursal_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
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

                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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

                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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
                        binding: 'udn_origen_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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
                        binding: 'sucursal_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('ENTRIES.REPAIR.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.REPAIR.HINTS.SUBSIDIARY'),
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

                            name: Translate.translate('ENTRIES.REPAIR.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.REPAIR.HINTS.TRANSPORT_LINE'),
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

                            name: Translate.translate('ENTRIES.REPAIR.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.REPAIR.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    udn: {
                        binding: 'udn_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('ENTRIES.REPAIR.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.REPAIR.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    store: {
                        binding: 'establecimiento_origen_id',
                        model: 'no_cliente',
                        option: 'nombre_establecimiento'
                    }
                };
                return catalogues;
            }
        };

        var newEntry = {
            template: function () {
                return {
                    cabinets_id: [],
                    ife_chofer: null,
                    linea_transporte_id: null,
                    nombre_chofer: '',
                    tipo_transporte_id: null,
                    proveedor_origen_id: null
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('ENTRIES.NEW.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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
                    supplier: {
                        binding: 'proveedor_origen_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.supplier,

                            name: Translate.translate('ENTRIES.NEW.LABELS.SUPPLIER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.SUPPLIER'),
                        icon: 'fas fas-box',
                        required: true
                    },
                    transport_line: {
                        binding: 'linea_transporte_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,

                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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

                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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
                        binding: 'udn_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('ENTRIES.NEW.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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
                        binding: 'sucursal_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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

                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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

                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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
                        binding: 'udn_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
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
                    origin_udn: {
                        binding: 'udn_origen_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('ENTRIES.UNRECOGNIZABLE.LABELS.ORIGIN_AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.ORIGIN_AGENCY'),
                        icon: 'fa fa-building',
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
                        binding: 'sucursal_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.SUBSIDIARY'),
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

                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.TRANSPORT_LINE'),
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

                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    udn: {
                        binding: 'udn_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
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
            getAssetStatus: getAssetStatus,
            close: close,
            getCabinet: getCabinet,
            getEntriesByCabinet: getEntriesByCabinet,
            listEntries: listEntries,
            //Constants
            warrantyEntry: warrantyEntry,
            repairEntry: repairEntry,
            newEntry: newEntry,
            warehouseEntry: warehouseEntry,
            unrecognizableEntry: unrecognizableEntry
        };

    }

})();
