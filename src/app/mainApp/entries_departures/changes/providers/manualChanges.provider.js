(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .factory('MANUAL_CHANGES', ManualChangesProvider);
    function ManualChangesProvider(
        API,
        $q,
        URLS,
        Translate,
        EnvironmentConfig,
        XLSX,
        moment,
        QUERIES
    ) {
        var changesUrl = API
            .all(URLS.entries_departures.base)
            .all(URLS.entries_departures.changes.base);
        var warehouseUrl = API
            .all(URLS.warehouse.base);

        var changes = URLS.entries_departures.changes;
        var warehouse = URLS.warehouse;

        function createChange(element) {
            return changesUrl.all(changes.change).customPOST(element);
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
                can_leave: false,
                cabinet: null,
                subsidiary: null,
                agency: null
            };

            warehouseUrl
                .all(warehouse.fridge)
                .customGET(id)
                .then(function (fridge) {
                    response.cabinet = fridge;
                    if (fridge.sucursal || fridge.udn) {
                        //Located in any place
                        response.can_leave = true;
                        if (fridge.sucursal) {
                            response['subsidiary'] = fridge.sucursal;
                        }
                        if (fridge.udn) {
                            response['agency'] = fridge.udn;
                        }
                    }
                    else {
                        response.can_leave = false;
                    }
                    deferred.resolve(response);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getChanges(params) {
            return changesUrl.customGET(changes.change, params);
        }

        function changeDetail(id) {
            var params = {
                id: id
            };
            return changesUrl.all(changes.change).customGET(null, params);
        }

        function generateReport(changeId) {
            var defer = $q.defer();

            changeDetail(changeId)
                .then(function (changeDetail) {
                    var changeData = [
                        {
                            A: "Folio",
                            B: changeDetail._id
                        },
                        {
                            A: " "
                        },
                        {
                            A: "Nombre del operador",
                            B: changeDetail.nombre_chofer ? changeDetail.nombre_chofer : changeDetail.operador_transporte ? changeDetail.operador_transporte.nombre : 'Sin información'
                        },
                        {
                            A: "Tipo de transporte",
                            B: changeDetail.tipo_transporte ? changeDetail.tipo_transporte.descripcion : 'Sin información'
                        }
                    ];
                    //Adding transport line
                    if (changeDetail.operador_transporte) {
                        changeData.push({
                            A: "Linea de transporte",
                            B: changeDetail.operador_transporte.linea_transporte.razon_social
                        });
                    }

                    changeData.push({
                        A: " "
                    });

                    //Adding origin

                    if (changeDetail.sucursal_origen) {
                        changeData.push({
                            A: "Sucursal origen",
                            B: changeDetail.sucursal_origen.nombre
                        });
                    }

                    if (changeDetail.udn_origen) {
                        changeData.push({
                            A: "UDN-Agencia origen",
                            B: changeDetail.udn_origen.agencia
                        });
                    }
                    //Add spacing
                    changeData.push({
                        A: " "
                    });
                    //Adding destination
                    if (changeDetail.sucursal_destino) {
                        changeData.push({
                            A: "Sucursal destino",
                            B: changeDetail.sucursal_destino.nombre
                        });
                    }

                    if (changeDetail.udn_destino) {
                        changeData.push({
                            A: "UDN-Agencia Destino",
                            B: changeDetail.udn_destino.agencia
                        });
                    }

                    //Dates
                    if (changeDetail.fecha_hora_salida) {
                        changeData.push({
                            A: "Fecha de envío",
                            B: moment(changeDetail.fecha_hora_salida).format("dddd, Do MMMM YYYY, h:mm:ss a")
                        });
                    }

                    if (changeDetail.fecha_hora_entrada) {
                        changeData.push({
                            A: "Fecha de recepción",
                            B: moment(changeDetail.fecha_hora_entrada).format("dddd, Do MMMM YYYY, h:mm:ss a")
                        });
                    }

                    //Add spacing
                    changeData.push({
                        A: " "
                    });

                    //Add asset count
                    changeData.push({
                        A: "Total de equipos",
                        B: changeDetail.cabinets.length
                    });

                    var ws = XLSX.utils.json_to_sheet(changeData, {
                        header: ["A", "B", "C", "D"],
                        skipHeader: true
                    });
                    //Initialize variable with table headers
                    var assetData = [{
                        A: "Económico",
                        B: "Activo",
                        C: "Serie",
                        D: "Modelo",
                        E: "Año",
                        F: "Tipo"
                    }];

                    //var assetPromises = [];

                    angular.forEach(changeDetail.cabinets, function (value) {
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
                    XLSX.utils.book_append_sheet(wb, ws, "Cambio");

                    /* write workbook and force a download */
                    XLSX.writeFile(wb, name ? name : "reporte_cambio " + moment(changeDetail.fecha_hora).format("YYYY-MM-DD HH:mm:ss") + ".xlsx");
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

        //Templates
        var internalChange = {
            template: function () {
                return {
                    cabinets: [],
                    nombre_chofer: '',
                    tipo_transporte: null
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    destination_agency: {
                        binding: 'sucursal_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.agency,

                            name: Translate.translate('CHANGES.CREATE.LABELS.DESTINATION_AGENCY'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.DESTINATION_AGENCY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    origin_agency: {
                        binding: 'sucursal_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.baseinternal
                                + '/' + URLS.management.catalogues.agency,

                            name: Translate.translate('CHANGES.CREATE.LABELS.ORIGIN_AGENCY'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.ORIGIN_AGENCY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    destination_subsidiary: {
                        binding: 'sucursal_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('CHANGES.CREATE.LABELS.DESTINATION_SUBSIDIARY'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.DESTINATION_SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    origin_subsidiary: {
                        binding: 'sucursal_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('CHANGES.CREATE.LABELS.ORIGIN_SUBSIDIARY'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.ORIGIN_SUBSIDIARY'),
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

                            name: Translate.translate('CHANGES.CREATE.LABELS.TRANSPORT_LINE'),
                            model: '_id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.TRANSPORT_LINE'),
                        icon: 'fa fa-pallet',
                        required: true
                    },
                    transport_driver: {
                        binding: 'operador_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_driver,
                            name: Translate.translate('CHANGES.CREATE.LABELS.TRANSPORT_DRIVER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'nombre',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.TRANSPORT_DRIVER'),
                        icon: 'fa fa-id-card',
                        required: true
                    },
                    transport_kind: {
                        binding: 'tipo_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,
                            name: Translate.translate('CHANGES.CREATE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: '_id',
                            option: 'descripcion',
                            lazy: true,
                            query: QUERIES.entries_departures.by_transport_line
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        var listChanges = {
            catalogues: function catalogues() {
                var catalogues = {
                    destination_udn: {
                        binding: 'udn_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('CHANGES.LIST.LABELS.DESTINATION_AGENCY'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('CHANGES.LIST.HINTS.DESTINATION_AGENCY'),
                        required: true
                    },
                    origin_udn: {
                        binding: 'udn_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('CHANGES.LIST.LABELS.ORIGIN_AGENCY'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('CHANGES.LIST.HINTS.ORIGIN_AGENCY'),
                        required: true
                    },
                    destination_subsidiary: {
                        binding: 'sucursal_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('CHANGES.LIST.LABELS.DESTINATION_SUBSIDIARY'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('CHANGES.LIST.HINTS.DESTINATION_SUBSIDIARY'),
                        required: true
                    },
                    origin_subsidiary: {
                        binding: 'sucursal_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('CHANGES.LIST.LABELS.ORIGIN_SUBSIDIARY'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('CHANGES.LIST.HINTS.ORIGIN_SUBSIDIARY'),
                        required: true
                    }
                };
                return catalogues;
            }
        };

        return {
            createChange: createChange,
            getChanges: getChanges,
            getCabinet: getCabinet,
            changeDetail: changeDetail,
            generateReport: generateReport,
            //Constants
            internalChange: internalChange,
            listChanges: listChanges
        };
    }
})();
