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

        function createChange(element) {
            return changesUrl.all(changes.change).customPOST(element);
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
                    response['status'] = apiResponse['estatus_cabinet'];
                    response.entrance_kind = apiResponse['tipo_entrada'];

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

        function getChanges(destinationAgencyId, originAgencyId, destinationSubsidiaryId, originSubsidiaryId) {
            var params = {};

            destinationAgencyId ? params[QUERIES.changes.by_destination_agency] = destinationAgencyId : null;
            originAgencyId ? params[QUERIES.changes.by_origin_agency] = originAgencyId : null;
            destinationSubsidiaryId ? params[QUERIES.changes.by_destination_subsidiary] = destinationSubsidiaryId : null;
            originSubsidiaryId ? params[QUERIES.changes.by_origin_subsidiary] = originSubsidiaryId : null;

            return changesUrl.customGET(changes.change, params);
        }

        function changeDetail(id) {
            var params={
                id:id
            };
            return changesUrl.all(changes.change).customGET(null, params);
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
                    cabinets: [],
                    nombre_chofer: '',
                    tipo_transporte: null
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
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

                            name: Translate.translate('CHANGES.CREATE.LABELS.SUBSIDIARY'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.SUBSIDIARY'),
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
                    transport_kind: {
                        binding: 'tipo_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,

                            name: Translate.translate('CHANGES.CREATE.LABELS.TRANSPORT_KIND'),
                            model: '_id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.TRANSPORT_KIND'),
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
                    cabinets: [],
                    nombre_chofer: '',
                    tipo_transporte: null
                };
            },
            catalogues: function catalogues() {
                var catalogues = {
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
                    transport_kind: {
                        binding: 'tipo_transporte',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.entries_departures.base
                                + '/' + URLS.entries_departures.catalogues.base
                                + '/' + URLS.entries_departures.catalogues.transport_type,

                            name: Translate.translate('CHANGES.CREATE.LABELS.TRANSPORT_KIND'),
                            model: '_id',
                            option:'descripcion'
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.TRANSPORT_KIND'),
                        icon: 'fa fa-truck',
                        required: true
                    },
                    destination_udn: {
                        binding: 'udn_destino',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('CHANGES.CREATE.LABELS.DESTINATION_AGENCY'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.DESTINATION_AGENCY'),
                        icon: 'fa fa-building',
                        required: true
                    },
                    origin_udn: {
                        binding: 'udn_origen',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.udn,

                            name: Translate.translate('CHANGES.CREATE.LABELS.AGENCY'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('CHANGES.CREATE.HINTS.AGENCY'),
                        icon: 'fa fa-building',
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

                            name: Translate.translate('CHANGES.LIST.LABELS.AGENCY'),
                            model: '_id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('CHANGES.LIST.HINTS.AGENCY'),
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

                            name: Translate.translate('CHANGES.LIST.LABELS.SUBSIDIARY'),
                            model: '_id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('CHANGES.LIST.HINTS.SUBSIDIARY'),
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
            //Constants
            subsidiaryChange: subsidiaryChange,
            agencyChange: agencyChange,
            listChanges: listChanges
        };
    }
})();
