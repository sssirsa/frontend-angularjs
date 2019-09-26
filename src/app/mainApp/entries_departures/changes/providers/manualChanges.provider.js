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
        PAGINATION,
        QUERIES
    ) {
        var changesUrl = API
            .all(URLS.entries_departures.base)
            .all(URLS.entries_departures.changes.base);
        var inventoryUrl = API
            .all(URLS.management.base)
            .all(URLS.management.inventory.base);
        var managementUrl = API
            .all(URLS.management.base);

        var changes = URLS.entries_departures.changes;
        var control = URLS.management.control;
        var inventory = URLS.management.inventory;

        function createAgency(element) {
            return changesUrl.all(changes.agency).customPOST(element);
        }

        function createSubsidiary(element) {
            return changesUrl.all(changes.subsidiary).customPOST(element);
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
                subsidiary: null
            };
            getCabinetInLocation(id)
                .then(function cabinetsInLocationSuccessCallback(apiResponse) {
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
                                deferred.resolve(response);
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
                .catch(function cabinetsInLocationErrorCallback(apiResponseError) {
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

        function getAgency(page, destinationAgencyId, originAgencyId) {
            var params = {};
            //Pagination params building
            if (page) {
                params.limit = PAGINATION.pageSize;
                params.offset = PAGINATION.pageSize * (page - 1);
                //Adding ordering parameter
                params[QUERIES.ordering] = '-id';
            }
            destinationAgencyId ? params[QUERIES.changes.by_destination_agency] = destinationAgencyId : null;
            originAgencyId ? params[QUERIES.changes.by_origin_agency] = originAgencyId : null;
            return changesUrl.customGET(changes.agency, params);
        }

        function getSubsidiary(page, destinationSubsidiaryId, originSubsidiaryId) {
            var params = {};
            //Pagination params building
            if (page) {
                params.limit = PAGINATION.pageSize;
                params.offset = PAGINATION.pageSize * (page - 1);
                //Adding ordering parameter
                params[QUERIES.ordering] = '-id';
            }
            destinationSubsidiaryId ? params[QUERIES.changes.by_destination_subsidiary] = destinationSubsidiaryId : null;
            originSubsidiaryId ? params[QUERIES.changes.by_origin_subsidiary] = originSubsidiaryId : null;
            return changesUrl.all(changes.subsidiary).customGET(element);
        }
        //Internal functions

        function getCabinetInLocation(id) {
            return managementUrl
                .all(control.base)
                .all(control.cabinet_in_subsidiary)
                .all(id).customGET();
        }

        //Templates
        var subsidiaryChange = {
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
                    destination_subsidiary: {
                        binding: 'sucursal_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('CHANGES.LABELS.DESTINATION_SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            elements: PAGINATION.elements,
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('CHANGES.HINTS.DESTINATION_SUBSIDIARY'),
                        icon: 'fa fa-warehouse',
                        required: true
                    },
                    origin_subsidiary: {
                        binding: 'sucursal_origen_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,

                            name: Translate.translate('CHANGES.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            elements: PAGINATION.elements,
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        },
                        hint: Translate.translate('CHANGES.HINTS.SUBSIDIARY'),
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

                            name: Translate.translate('CHANGES.LABELS.TRANSPORT_LINE'),
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
                        hint: Translate.translate('CHANGES.HINTS.TRANSPORT_LINE'),
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

                            name: Translate.translate('CHANGES.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
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
                        hint: Translate.translate('CHANGES.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        var agencyChange = {
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
                    transport_line: {
                        binding: 'linea_transporte_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_line,

                            name: Translate.translate('CHANGES.LABELS.TRANSPORT_LINE'),
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
                        hint: Translate.translate('CHANGES.HINTS.TRANSPORT_LINE'),
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

                            name: Translate.translate('CHANGES.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion',
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
                        hint: Translate.translate('CHANGES.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    destination_udn: {
                        binding: 'udn_destino_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('CHANGES.LABELS.DESTINATION_AGENCY'),
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
                        hint: Translate.translate('CHANGES.HINTS.DESTINATION_AGENCY'),
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

                            name: Translate.translate('CHANGES.LABELS.AGENCY'),
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
                        hint: Translate.translate('CHANGES.HINTS.AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    }
                };
                return catalogues;
            }
        };

        return {
            createAgency: createAgency,
            createSubsidiary: createSubsidiary,
            getAgency: getAgency,
            getSubsidiary: getSubsidiary,
            getCabinet: getCabinet,
            //Constants
            subsidiaryChange: subsidiaryChange,
            agencyChange: agencyChange
        };
    }
})();
