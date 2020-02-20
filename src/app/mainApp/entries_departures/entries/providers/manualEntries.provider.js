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
        User,
        XLSX,
        moment
    ) {

        var entriesUrl = API
            .all(URLS.entries_departures.base)
            .all(URLS.entries_departures.entries.base);
        var managementUrl = API
            .all(URLS.management.base);

        var entries = URLS.entries_departures.entries;
        var inventory = URLS.management.inventory;
        var management = URLS.management;

        function createNew(element) {
            return entriesUrl.all(entries.new).customPOST(element);
        }

        function createRepair(element) {
            return entriesUrl.all(entries.salepoint).customPOST(element);
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
            return entriesUrl.all(entries.all + '?id=' + id).customGET();
        }

        function getAssetStatus(entryId, page, pageSize) {
            var params;
            if (page) {
                params = {
                    limit: (pageSize),
                    offset: (pageSize) * (page - 1)
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
             *      (commonly WARRANTY entry or NEW entry)
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
            managementUrl
                .all(management.catalogues.base)
                .all(inventory.cabinet)
                .customGET(id)
                .then(function (fridge) {
                    response.cabinet = fridge;
                    if (fridge.sucursal || fridge.udn) {
                        //Located in any place
                        response.can_enter = false;
                    }
                    else {
                        response.can_enter = true;
                    }
                    deferred.resolve(response);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        //Entry Kind must be one pf the following
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
                params[QUERIES.ordering] = '-fecha';
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
                        url = url.all(entries.salepoint);
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

        function generateReport(entryId) {
            var defer = $q.defer();

            detail(entryId)
                .then(function (entryDetail) {
                    var entryData = [
                        {
                            A: "Folio",
                            B: entryDetail.id
                        },
                        {
                            A: "Fecha",
                            B: moment(entryDetail.fecha).format("dddd, Do MMMM YYYY, h:mm:ss a")
                        },
                        {
                            A: "Tipo de entrada",
                            B: entryDetail.tipo_entrada
                        },
                        // {
                        //     A: "Linea de transporte",
                        //     B: entryDetail.tipo_transporte ? entryDetail.tipo_transporte.linea_transporte.razon_social
                        //         : operador_transporte ? entryDetail.operador_transporte.linea_transporte.razon_social : 'Sin información'
                        // },
                        {
                            A: "Tipo de transporte",
                            B: entryDetail.tipo_transporte ? entryDetail.tipo_transporte.descripcion : 'Sin información'
                        },
                        {
                            A: "Nombre del operador",
                            B: entryDetail.nombre_chofer ? entryDetail.nombre_chofer : entryDetail.operador_transporte.nombre
                        },
                        {
                            A: ""
                        }
                    ];
                    //Adding transport line
                    if (entryDetail.tipo_transporte) {
                        entryData.push({
                            A: "Linea de transporte",
                            B: entryDetail.tipo_transporte.linea_transporte.razon_social
                        });
                    }
                    if (entryDetail.operador_transporte) {
                        entryData.push({
                            A: "Linea de transporte",
                            B: entryDetail.tipo_transporte.linea_transporte.razon_social
                        });
                    }
                    //Adding origin   
                    if (entryDetail.pedimento) {
                        entryData.push({
                            A: "Pedimento",
                            B: entryDetail.pedimento
                        });
                    }

                    if (entryDetail.establecimiento_origen) {
                        entryData.push({
                            A: "Establecimiento origen",
                            B: entryDetail.establecimiento_origen.nombre_establecimiento
                        });
                    }

                    if (entryDetail.proveedor_origen) {
                        entryData.push({
                            A: "Proveedor origen",
                            B: entryDetail.proveedor_origen.razon_social
                        });
                    }

                    if (entryDetail.udn_origen) {
                        entryData.push({
                            A: "UDN-Agencia origen",
                            B: entryDetail.udn_origen.agencia
                        });
                    }
                    //Add spacing
                    entryData.push({
                        A: " "
                    });
                    //Adding destination
                    if (entryDetail.sucursal_destino) {
                        entryData.push({
                            A: "Sucursal destino",
                            B: entryDetail.sucursal_destino.nombre
                        });
                    }

                    if (entryDetail.udn_destino) {
                        entryData.push({
                            A: "UDN-Agencia Destino",
                            B: entryDetail.udn_destino.razon_social
                        });
                    }

                    //Add spacing
                    entryData.push({
                        A: " "
                    });

                    //Add asset count
                    entryData.push({
                        A: "Total de equipos",
                        B: entryDetail.cabinets.length
                    });

                    var ws = XLSX.utils.json_to_sheet(entryData, {
                        header: ["A", "B", "C", "D"],
                        skipHeader: true
                    });
                    //Initialize variable with table headers
                    var assetData = [{
                        A: "Económico",
                        B: "Activo",
                        C: "Serie",
                        D: "Modelo",
                        E: "Tipo"
                    }];

                    //var assetPromises = [];

                    angular.forEach(entryDetail.cabinets, function (value) {
                        // var assetPromise = getCabinetInfo(value);
                        // assetPromises.push(assetPromise);
                        // assetPromise
                        //     .then(function (cabinetInfo) {
                        assetData.push({
                            A: value.economico,
                            B: value.id_unilever,
                            C: value.no_serie,
                            D: value.modelo.nombre,
                            E: value.modelo.tipo.nombre
                        });
                        // })
                        // .catch(function (getCabinetInfoError) {
                        //     defer.reject(getCabinetInfoError);
                        // });

                    });

                    // $q.all(assetPromises)
                    //     .then(function () {
                    XLSX.utils.sheet_add_json(ws,
                        assetData,
                        { header: ["A", "B", "C", "D", "E"], skipHeader: true, origin: { c: 0, r: 14 } });

                    /* add to workbook */
                    var wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Entrada");

                    /* write workbook and force a download */
                    XLSX.writeFile(wb, name ? name : "reporte_entrada " + moment(entryDetail.fecha).format("YYYY-MM-DD HH:mm") + ".xlsx");
                    defer.resolve();
                    // })
                    // .catch(function (errorResponse) {
                    //     defer.reject(errorResponse);
                    // });
                })
                .catch(function (entryError) {
                    defer.reject(entryError);
                });



            return defer.promise;
        }

        //Internal functions

        function getEntriesByCabinet(id) {
            //TODO:Make real logic
            return id;
        }

        //Constants
        var warrantyEntry = {
            template: function () {
                return {
                    cabinets: [],
                    ife_chofer: null,
                    linea_transporte: null,
                    nombre_chofer: '',
                    tipo_transporte: null
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    transport_line: {
                        binding: 'linea_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,

                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
                        required: true
                    },
                    transport_kind: {
                        binding: 'tipo_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,

                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'descripcion',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('ENTRIES.WARRANTY.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    transport_driver: {
                        binding: 'operador_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_driver,
                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_DRIVER'),
                        icon: 'fa fa-id-card',
                        required: true
                    },
                    udn: {
                        binding: 'udn_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,
                            name: Translate.translate('ENTRIES.WARRANTY.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'agencia'
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
                    cabinets: [],
                    ife_chofer: null,
                    linea_transporte: null,
                    nombre_chofer: '',
                    tipo_transporte: null
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('ENTRIES.REPAIR.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.REPAIR.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    transport_line: {
                        binding: 'linea_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,

                            name: Translate.translate('ENTRIES.REPAIR.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.REPAIR.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
                        required: true
                    },
                    transport_kind: {
                        binding: 'tipo_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,

                            name: Translate.translate('ENTRIES.REPAIR.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('ENTRIES.REPAIR.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    transport_driver: {
                        binding: 'operador_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_driver,
                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_DRIVER'),
                        icon: 'fa fa-id-card',
                        required: true
                    },
                    udn: {
                        binding: 'udn_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('ENTRIES.REPAIR.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
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
                    cabinets: [],
                    linea_transporte: null,
                    nombre_chofer: '',
                    tipo_transporte: null,
                    proveedor_origen: null
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('ENTRIES.NEW.LABELS.SUBSIDIARY'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    supplier: {
                        binding: 'proveedor_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.cabinet_brand,

                            name: Translate.translate('ENTRIES.NEW.LABELS.SUPPLIER'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.SUPPLIER'),
                        icon: 'fas fas-box',
                        required: true
                    },
                    transport_line: {
                        binding: 'linea_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,

                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
                        required: true
                    },
                    transport_kind: {
                        binding: 'tipo_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,

                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_KIND'),
                            model: '_id',
                            option: 'descripcion',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    transport_driver: {
                        binding: 'operador_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_driver,
                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_DRIVER'),
                        icon: 'fa fa-id-card',
                        required: true
                    },
                    udn: {
                        binding: 'udn_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('ENTRIES.NEW.LABELS.AGENCY'),
                            model: '_id',
                            option: 'agencia'
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
                            elements: PAGINATION.elements,
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
                            elements: PAGINATION.elements,
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
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line,
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit, offset: PAGINATION.offset, pageSize: PAGINATION.pageSize
                            },
                            elements: PAGINATION.elements,
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('ENTRIES.UNRECOGNIZABLE.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    transport_driver: {
                        binding: 'operador_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_driver,
                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_DRIVER'),
                        icon: 'fa fa-id-card',
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
                            elements: PAGINATION.elements,
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
                            elements: PAGINATION.elements,
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
                    cabinets: [],
                    ife_chofer: null,
                    linea_transporte: null,
                    nombre_chofer: '',
                    tipo_transporte: null
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    transport_line: {
                        binding: 'linea_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,

                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
                        required: true
                    },
                    transport_kind: {
                        binding: 'tipo_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,

                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'descripcion',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('ENTRIES.WAREHOUSE.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    transport_driver: {
                        binding: 'operador_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_driver,
                            name: Translate.translate('ENTRIES.NEW.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('ENTRIES.NEW.HINTS.TRANSPORT_DRIVER'),
                        icon: 'fa fa-id-card',
                        required: true
                    },
                    udn: {
                        binding: 'udn_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('ENTRIES.WAREHOUSE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'agencia'
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
            generateReport: generateReport,
            //Constants
            warrantyEntry: warrantyEntry,
            repairEntry: repairEntry,
            newEntry: newEntry,
            warehouseEntry: warehouseEntry,
            unrecognizableEntry: unrecognizableEntry
        };

    }

})();
