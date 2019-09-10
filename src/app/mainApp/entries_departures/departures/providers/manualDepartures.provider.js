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
        User
    ) {
        var departuresUrl = API
            .all(URLS.entries_departures.base)
            .all(URLS.entries_departures.departures.base);
        var inventoryUrl = API
            .all(URLS.management.base)
            .all(URLS.management.inventory.base);
        var managementUrl = API
            .all(URLS.management.base);
        var technicalUrl = API
            .all(URLS.technical_service.base);

        var control = URLS.management.control;
        var departures = URLS.entries_departures.departures;
        var inventory = URLS.management.inventory;
        var service = URLS.technical_service.services;

        function createNew(element) {
            return departuresUrl.all(departures.new).customPOST(element);
        }

        function createObsolete(element) {
            return departuresUrl.all(departures.obsolete).customPOST(element);
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
            return departuresUrl.all(id).customGET();
        }

        function close(id, element) {
            return departuresUrl.all(departures.close).all(id).customPUT(element);
        }

        function getCabinet(id, subsidiary, agency) {
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
            getCabinetInSubsidiary(id)
                .then(function cabinetsInSubsiadiarySuccessCallback(apiResponse) {
                    //Cabinet exists in subsidiary
                    var cabinetCanLeave = true;
                    //Response filling
                    response['subsidiary'] = apiResponse['sucursal'];
                    response['agency'] = apiResponse['udn'];
                    response['inspection'] = apiResponse['inspeccionado'];
                    response['status'] = apiResponse['estatus_cabinet'];
                    response.entrance_kind = apiResponse['tipo_entrada'];
                    response['status'] = apiResponse['estatus_cabinet'];

                    //If subsidiary or agency are sent, then further validations are done to the cabinet
                    //Validating subsidiary of the cabinet
                    if (subsidiary) {
                        if (apiResponse['sucursal'] ? apiResponse['sucursal'].id !== subsidiary : false) {
                            cabinetCanLeave = false;
                        }
                    }
                    //Validating agency of the cabinet
                    if (agency) {
                        if (apiResponse['udn'] ? apiResponse['udn'].id !== agency : null) {
                            cabinetCanLeave = false;
                        }
                    }

                    //Validating cabinet restriction
                    if (apiResponse['impedimento']) {
                        cabinetCanLeave = false;
                        response['restricion'] = apiResponse['impedimento'];
                    }

                    if (cabinetCanLeave) {
                        //Getting cabinet full information
                        inventoryUrl.all(inventory.cabinet).all(id).customGET()
                            .then(function cabinetSuccessCallback(apiCabinet) {
                                //Full cabinet information
                                response.cabinet = apiCabinet;

                                //Cabinet can leave
                                if (cabinetCanLeave) {
                                    response.can_leave = true;
                                }

                                //Cabinet can't leave
                                else {
                                    response.can_leave = false;
                                }

                                //Getting cabinet stage
                                getCabinetStage(id)
                                    .then(function stageSuccessCallback(stageResponse) {
                                        if (stageResponse[PAGINATION.elements].length > 0) {
                                            //There is a result, we just care abput the first one
                                            //bacause there should only be one
                                            var results = stageResponse[PAGINATION.elements];
                                            var service = results[0];
                                            response['stage'] = service.etapa_actual.etapa;
                                        }
                                    })
                                    .catch(function stageErrorCallback() {
                                        //Error getting the stage
                                        response['stage'] = null;
                                    })
                                    .finally(function cabinetStageResolver() {
                                        //Resolve the promise whether or not a current stage was found
                                        deferred.resolve(response);
                                    });

                            })
                            .catch(function cabinetErrorCallback(errorResponse) {
                                //Cabinet in ohter subsidiary or agency, so it can't leave
                                if (errorResponse.status === 404) {
                                    //Cabinet doesn't exists
                                    response.cabinet = { economico: id };
                                    deferred.resolve(response);
                                }
                                else {
                                    //Any other error from backend
                                    deferred.reject(errorResponse);
                                }
                                deferred.reject(errorResponse);
                            });
                    }
                    else {
                        response.can_leave = false;
                        response['cabinet'] = { economico: id };
                        deferred.resolve(response);
                    }
                })
                .catch(function cabinetsInSubsiadiaryErrorCallback(apiResponseError) {
                    //Cabinet doesn't exists in any subsidiary or agency, so it can't leave
                    if (apiResponseError.status === 404) {
                        //Cabinet doesn't exists
                        response.cabinet = { economico: id };
                        deferred.resolve(response);
                    }
                    else {
                        //Any other error from backend
                        deferred.reject(response);
                    }
                    deferred.reject(apiResponseError);
                });

            return deferred.promise;
        }

        //Departure Kind must be one pf the following
        //new, warehouse, obsolete, unrecognizable, warranty
        //Otherwise, all departures are returned
        //Page parameter is used for pagination,
        //without it just first page is provided
        function listDepartures(departureKind, page) {
            var user = User.getUser();
            var url = departuresUrl;
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
            if (departureKind) {
                //An departure kind has been provided
                switch (departureKind) {
                    case 'new':
                        url = url.all(departures.new);
                        break;
                    case 'warehouse':
                        url = url.all(departures.warehouse);
                        break;
                    case 'obsolete':
                        url = url.all(departures.obsolete);
                        break;
                    case 'unrecognizable':
                        url = url.all(departures.unrecognizable);
                        break;
                    case 'warranty':
                        url = url.all(departures.warranty);
                        break;
                    default:
                        url = url.all(departures.all);
                }
            }
            else {
                //Entry kind not provided, so return all
                url = url.all(departures.all);
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

        function getDeparturesByCabinet(id) {
            //TODO: Add behaviour when the URLs are provided
            return id;
        }

        function getCabinetStage(id) {
            var query = service.service
                + '?' + QUERIES.service.by_cabinet
                + '=' + id;
            return technicalUrl
                .all(service.base)
                .all(query)
                .customGET();
        }

        //Constants

        var newDeparture = {
            template: function () {
                return {
                    tipo_salida: 'Nuevos',
                    cabinets_id: [],
                    descripcion: '',
                    nombre_chofer: ''
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_origen_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.NEW.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.SUBSIDIARY'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.TRANSPORT_KIND'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
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
                    cabinets_id: [],
                    descripcion: '',
                    nombre_chofer: ''
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_origen_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.SUBSIDIARY'),
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
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.TRANSPORT_KIND'),
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
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    supplier: {
                        binding: 'proveedor_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.supplier,
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.SUPPLIER'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
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
                    tipo_salida: 'Garantias',
                    cabinets_id: [],
                    descripcion: '',
                    nombre_chofer: ''
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_origen_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.SUBSIDIARY'),
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
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.TRANSPORT_KIND'),
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
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    destination_subsidiary: {
                        binding: 'sucursal_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.DESTINATION_SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.DESTINATION_SUBSIDIARY'),
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
                    tipo_salida: 'Almacen',
                    cabinets_id: [],
                    descripcion: '',
                    nombre_chofer: ''
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
                    subsidiary: {
                        binding: 'sucursal_origen_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.SUBSIDIARY'),
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
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.TRANSPORT_KIND'),
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
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    destination_udn: {
                        binding: 'udn_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia',
                            elements: 'results',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            },
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            }
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    store: {
                        binding: 'establecimiento_destino_id',
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
            createWarehouse: createWarehouse,
            createWarranty: createWarranty,
            addCabinet: addCabinet,
            detail: detail,
            close: close,
            getCabinet: getCabinet,
            getDeparturesByCabinet: getDeparturesByCabinet,
            listDepartures: listDepartures,
            //Constants
            newDeparture: newDeparture,
            obsoleteDeparture: obsoleteDeparture,
            warrantyDeparture: warrantyDeparture,
            warehouseDeparture: warehouseDeparture
        };

    }

})();
