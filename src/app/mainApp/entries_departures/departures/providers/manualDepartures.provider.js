(function () {
    angular
        .module('app.mainApp.entries_departures.departures')
        .factory('MANUAL_DEPARTURES', ManualDeparturesProvider);

    function ManualDeparturesProvider(
        API,
        $q,
        URLS,
        QUERIES,
        Translate,
        EnvironmentConfig,
        PAGINATION,
        User,
        XLSX,
        moment
    ) {
        var departuresUrl = API
            .all(URLS.entries_departures.base)
            .all(URLS.entries_departures.departures.base);
        var warehouseUrl = API
            .all(URLS.warehouse.base);

        var departures = URLS.entries_departures.departures;
        var warehouse = URLS.warehouse;

        function createNew(element) {
            return departuresUrl.all(departures.new).customPOST(element);
        }

        function createObsolete(element) {
            return departuresUrl.all(departures.obsolete).customPOST(element);
        }

        function createSalepoint(element) {
            return departuresUrl.all(departures.salepoint).customPOST(element);
        }

        function createWarranty(element) {
            return departuresUrl.all(departures.warranty).customPOST(element);
        }

        function createWarehouse(element) {
            return departuresUrl.all(departures.warehouse).customPOST(element);
        }

        function addCabinet(id, element) {
            return departuresUrl.all(departures.addCabinet).all(id).customPUT(element);
        }

        function detail(id) {
            return departuresUrl.all(departures.all + '?id=' + id).customGET();
        }

        function close(id, element) {
            return departuresUrl.all(departures.close).all(id).customPUT(element);
        }

        function getCabinet(id) {
            /*
             * RETURNS
             *   -Cabinet exists in database and can leave (Restriction, subsidiary and agency validation)
             *       +Cabinet full object and can_leave in true
             *   -Cabinet exist in database and can't leave (Because of restriction or inproper inventory location)
             *       +Cabinet partial object and can_leave in false, restriction id or object(when applies)
             *       and inventory location (agency or subsidiary)
             *   -Cabinet doesn't exists, so it can't leave (wrong ID)
             *       +Cabinet in partial object {id:id}, can leave in false, all fields in null.
             *   -Backend error
             *       +Just returns the error response.
             */

            var deferred = $q.defer();
            var response = {
                agency: null,
                can_leave: false,
                cabinet: null,
                entrance_kind: null,
                inspection: null,
                restriction: null,
                status: null,
                stage: null,
                subsidiary: null
            };
            warehouseUrl
                .all(warehouse.fridge)
                .customGET(id)
                .then(function (fridge) {
                    response.cabinet = fridge;
                    if (fridge.sucursal || fridge.udn) {
                        //Located in any place
                        response.can_leave = true;
                        response.subsidiary = fridge.sucursal;
                        response.agency = fridge.udn;
                        response.status = fridge.estatus_unilever;
                    }
                    response.can_enter = false;
                    deferred.resolve(response);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        //Valid params are sucursal, udn, fecha_inicio, fecha_fin, tipo_entrada, economico
        //Params must be sent in an object with the param name as key
        //Ex: { param1:param1Value }
        function listDepartures(params) {
            var user = User.getUser();
            var url = departuresUrl.all(departures.all);
            //Subsidiary or Agency query
            if (user.sucursal) {
                params[QUERIES.entries_departures.by_subsidiary] = user['sucursal']._id;
            }
            if (user.udn) {
                params[QUERIES.entries_departures.by_agency] = user['udn']._id;
            }
            return url.customGET(null, params);
        }

        function generateReport(departureId) {
            var defer = $q.defer();
            detail(departureId)
                .then(function (departureDetail) {
                    var departureData = [
                        {
                            A: "Folio",
                            B: departureDetail.id
                        },
                        {
                            A: "Fecha",
                            B: moment(departureDetail.fecha_hora).format("dddd, Do MMMM YYYY, h:mm:ss a")
                        },
                        {
                            A: "Tipo de salida",
                            B: departureDetail.tipo_salida
                        },
                        {
                            A: "Tipo de transporte",
                            B: departureDetail.tipo_transporte ? departureDetail.tipo_transporte.descripcion : 'Sin información'
                        },
                        {
                            A: "Nombre del operador",
                            B: departureDetail.nombre_chofer ? departureDetail.nombre_chofer : departureDetail.operador_transporte ? departureDetail.operador_transporte.nombre : 'Sin información'
                        },
                        {
                            A: ""
                        }
                    ];
                    //Adding transport line
                    if (departureDetail.operador_transporte) {
                        departureData.push({
                            A: "Linea de transporte",
                            B: departureDetail.operador_transporte.linea_transporte.razon_social
                        });
                    }

                    //Adding origin
                    if (departureDetail.udn_origen) {
                        departureData.push({
                            A: "UDN-Agencia origen",
                            B: departureDetail.udn_origen.agencia
                        });
                    }

                    if (departureDetail.sucursal_origen) {
                        departureData.push({
                            A: "Sucursal origen",
                            B: departureDetail.sucursal_origen.nombre
                        });
                    }
                    //Add spacing
                    departureData.push({
                        A: " "
                    });
                    //Adding destination
                    if (departureDetail.sucursal_destino) {
                        departureData.push({
                            A: "Sucursal destino",
                            B: departureDetail.sucursal_destino.nombre
                        });
                    }

                    if (departureDetail.udn_destino) {
                        departureData.push({
                            A: "UDN-Agencia destino",
                            B: departureDetail.udn_destino.razon_social
                        });
                    }

                    if (departureDetail.establecimiento_destino) {
                        departureData.push({
                            A: "Establecimiento destino",
                            B: departureDetail.establecimiento_destino.nombre_establecimiento
                        });
                    }

                    if (departureDetail.proveedor_destino) {
                        departureData.push({
                            A: "Proveedor destino",
                            B: departureDetail.proveedor_destino.nombre
                        });
                    }

                    //Add spacing
                    departureData.push({
                        A: " "
                    });

                    //Add asset count
                    departureData.push({
                        A: "Total de equipos",
                        B: departureDetail.cabinets.length
                    });

                    var ws = XLSX.utils.json_to_sheet(departureData, {
                        header: ["A", "B", "C", "D"],
                        skipHeader: true
                    });
                    //Initialize variable with table headers
                    var assetData = [{
                        A: "Económico",
                        B: "Activo",
                        C: "Serie",
                        D: "Modelo",
                        E: "Modelo",
                        F: "Tipo"
                    }];

                    angular.forEach(departureDetail.cabinets, function (value) {
                        // var assetPromise = getCabinetInfo(value);
                        // assetPromises.push(assetPromise);
                        // assetPromise
                        //     .then(function (cabinetInfo) {
                        assetData.push({
                            A: value.economico,
                            B: value.id_unilever,
                            C: value.no_serie,
                            D: value.modelo.nombre,
                            E: value.year,
                            F: value.modelo.tipo.nombre
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
                    XLSX.utils.book_append_sheet(wb, ws, "Salida");

                    /* write workbook and force a download */
                    XLSX.writeFile(wb, name ? name : "reporte_salida " + moment(departureDetail.fecha_hora).format("YYYY-MM-DD HH:mm:ss") + ".xlsx");
                    defer.resolve();
                    // })
                    // .catch(function (errorResponse) {
                    //     defer.reject(errorResponse);
                    // });
                })
                .catch(function (departureError) {
                    defer.reject(departureError);
                });

            return defer.promise;
        }

        //Internal functions

        function getDeparturesByCabinet(id) {
            //TODO: Add behaviour when the URLs are provided
            return id;
        }

        //Constants

        var newDeparture = {
            template: function () {
                return {
                    tipo_salida: 'Nuevos',
                    cabinets: [],
                    descripcion: '',
                    nombre_chofer: ''
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.NEW.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.SUBSIDIARY'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'descripcion',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.TRANSPORT_KIND'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.TRANSPORT_DRIVER'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        var obsoleteDeparture = {
            template: function () {
                return {
                    tipo_salida: 'Obsoletos',
                    cabinets: [],
                    descripcion: '',
                    nombre_chofer: ''
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    transport_driver: {
                        binding: 'operador_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_driver,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.TRANSPORT_DRIVER'),
                        icon: 'fa fa-id-card',
                        required: true
                    },
                    transport_line: {
                        binding: 'linea_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'descripcion',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    udn: {
                        binding: 'udn_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    supplier: {
                        binding: 'proveedor_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.cabinet_brand,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.SUPPLIER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.SUPPLIER'),
                        icon: 'fas fas-box',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        var salepointDeparture = {
            template: function () {
                return {
                    tipo_salida: 'Punto de venta',
                    cabinets: [],
                    descripcion: '',
                    nombre_chofer: ''
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    transport_driver: {
                        binding: 'operador_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_driver,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.TRANSPORT_DRIVER'),
                        icon: 'fa fa-id-card',
                        required: true
                    },
                    transport_line: {
                        binding: 'linea_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'descripcion',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    udn: {
                        binding: 'udn_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    supplier: {
                        binding: 'proveedor_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.cabinet_brand,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.SUPPLIER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.SUPPLIER'),
                        icon: 'fas fas-box',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        var warrantyDeparture = {
            template: function () {
                return {
                    tipo_salida: 'Garantías',
                    cabinets: [],
                    descripcion: '',
                    nombre_chofer: ''
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    transport_driver: {
                        binding: 'operador_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_driver,
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.TRANSPORT_DRIVER'),
                        icon: 'fa fa-id-card',
                        required: true
                    },
                    transport_line: {
                        binding: 'linea_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'descripcion',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    udn: {
                        binding: 'udn_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    destination_subsidiary: {
                        binding: 'sucursal_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.DESTINATION_SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.DESTINATION_SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    destination_provider: {
                        binding: 'proveedor_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.cabinet_brand,
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.DESTINATION_PROVIDER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.DESTINATION_PROVIDER'),
                        icon: 'fa fa-warehouse',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        var warehouseDeparture = {
            template: function () {
                return {
                    tipo_salida: 'Buen estado',
                    cabinets: [],
                    descripcion: '',
                    nombre_chofer: ''
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    transport_driver: {
                        binding: 'operador_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_driver,
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.TRANSPORT_DRIVER'),
                        icon: 'fa fa-id-card',
                        required: true
                    },
                    transport_line: {
                        binding: 'linea_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'descripcion',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    udn: {
                        binding: 'udn_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    destination_udn: {
                        binding: 'udn_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    store: {
                        binding: 'establecimiento_destino',
                        model: 'no_cliente',
                        option: 'nombre_establecimiento'
                    }
                };
                return catalogues;
            }
        };

        return {
            createNew: createNew,
            createObsolete: createObsolete,
            createSalepoint: createSalepoint,
            createWarehouse: createWarehouse,
            createWarranty: createWarranty,
            addCabinet: addCabinet,
            detail: detail,
            close: close,
            getCabinet: getCabinet,
            getDeparturesByCabinet: getDeparturesByCabinet,
            listDepartures: listDepartures,
            generateReport: generateReport,
            //Constants
            newDeparture: newDeparture,
            obsoleteDeparture: obsoleteDeparture,
            warrantyDeparture: warrantyDeparture,
            warehouseDeparture: warehouseDeparture,
            salepointDeparture: salepointDeparture
        };

    }

})();
