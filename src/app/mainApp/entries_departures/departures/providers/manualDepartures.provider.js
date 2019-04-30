(function () {
    angular
        .module('app.mainApp.entries_departures.departures')
        .factory('MANUAL_DEPARTURES', ManualDeparturesProvider);

    function ManualDeparturesProvider(
        API,
        $q,
        URLS,
        Translate,
        EnvironmentConfig
    ) {        
        var departuresUrl = API
            .all(URLS.entries_departures.base)
            .all(URLS.entries_departures.departures.base);
        var inventoryUrl = API
            .all(URLS.management.base)
            .all(URLS.management.inventory.base);
        var managementUrl = API
            .all(URLS.management.base);

        var control = URLS.management.control;
        var departures = URLS.entries_departures.departures;
        var inventory = URLS.management.inventory;

        function createNew(element) {
            return departuresUrl.all(departures.new).customPOST(element);
        }

        function createWarranty(element) {
            return departuresUrl.all(departures.warranty).customPOST(element);
        }

        function createObsolete(element) {
            return departuresUrl.all(departures.obsolete).customPOST(element);
        }
         
        function createWarehouse(element) {
            return departuresUrl.all(departures.warehouse).customPOST(element);
        }

        function createUnrecognizable(element) {
            return departuresUrl.all(departures.unrecognizable).customPOST(element);
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

        function getCabinet(id) {
            /*
             * RETURNS
             *   -Cabinet exists in database and can leave (Restriction validation)
             *       +Cabinet full object and can_leave in true
             *   -Cabinet exist in database and can't leave (Because of restriction)
             *       +Cabinet full object and can_leave in false, restriction id (when applies)
             *   -Cabinet doesn't exists, so it can't leave (wrong ID)
             *       +Cabinet in partial object, can leave in false, subsidiary in null.
             *   -Backend error
             *       +Just returns the error response.
             */

            var deferred = $q.defer();
            var response = {
                can_leave: false,
                cabinet: null,
                entrance_kind: null,
                restriction: null,
                subsidiary: null
            };
            getCabinetInSubsidiary(id)
                .then(function cabinetsInSubsiadiarySuccessCallback(apiResponse) {
                    //Cabinet exists in subsidiary
                    var canLeave = true;
                    //TODO: Validate that the cabinet doesn't have internal restrictions to leave, such as pending service or not ready to market
                    var cabinetCanLeave = null;
                    if (canLeave) {
                        cabinetCanLeave = true;
                    }
                    else {
                        cabinetCanLeave = false;
                    }
                   
                    //Getting cabinet full information
                    inventoryUrl.all(inventory.cabinet).all(id).customGET()
                        .then(function cabinetSuccessCallback(apiCabinet) {
                            response.cabinet = apiCabinet;
                            response.entrance_kind = apiResponse['tipo_entrada'];
                            response.subsidiary = apiResponse['sucursal'].id;

                            //Cabinet can leave
                            if (cabinetCanLeave) {
                                response.can_leave = true;
                                deferred.resolve(response);
                            }

                            //Cabinet can't leave
                            else {
                                response.restriction = apiResponse.impedimento;
                                response.can_leave = false;
                                deferred.resolve(response);
                            }
                        })
                        .catch(function cabinetErrorCallback(errorResponse) {
                            deferred.reject(errorResponse);
                        });
                })
                .catch(function cabinetsInSubsiadiaryErrorCallback(apiResponseError) {
                    //Cabinet doesn't exists in any subsidiary, so it can't leave
                    if (apiResponseError.status === 404) {
                        //Cabinet doesn't exists
                        response.cabinet = {economico:id};
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

        function getUnrecognizableCabinet(id) {
            /*
             * RETURNS
             *   -Cabinet exists in database and can leave (Restriction validation)
             *       +Cabinet full object and can_leave in true
             *   -Cabinet exist in database and can't leave (Because of restriction)
             *       +Cabinet full object and can_leave in false, restriction id (when applies)
             *   -Cabinet doesn't exists, so it can't leave (wrong ID)
             *       +Cabinet in partial object, can leave in false, subsidiary in null.
             *   -Backend error
             *       +Just returns the error response.
             */

            var deferred = $q.defer();
            var response = {
                can_leave: false,
                no_capitalizado: null,
                entrance_kind: null,
                restriction: null,
                subsidiary: null
            };
            getUnrecognizableCabinetInSubsidiary(id)
                .then(function unrecognizableCabinetsInSubsiadiarySuccessCallback(apiResponse) {
                    //Cabinet exists in subsidiary

                    //TODO: Validate that the cabinet doesn't have internal restrictions to leave, such as pending service or not ready to market
                    var cabinetCanLeave = null;
                    if (cabinetCanLeave) {
                        response.can_leave = true;
                    }
                    else {
                        response.can_leave = false;
                    }
                    response.no_capitalizado = apiResponse;

                    //Getting unrecoognizable cabinet full information
                    //TODO:replace with the given URL's when known

                    //inventoryUrl.all(inventory.cabinet).all(id).customGET()
                    //    .then(function cabinetSuccessCallback(apiCabinet) {
                    //        response.no_capitalizado = apiCabinet;
                    //        response.entrance_kind = apiResponse['tipo_entrada'];
                    //        response.subsidiary = apiResponse['sucursal'].id;

                    //        //Cabinet can leave
                    //        if (cabinetCanLeave) {
                    //            response.can_leave = true;
                    //            deferred.resolve(response);
                    //        }

                    //        //Cabinet can't leave
                    //        else {
                    //            response.restriction = apiResponse.impedimento;
                    //            response.can_leave = false;
                    //            deferred.resolve(response);
                    //        }
                    //    })
                    //    .catch(function unrecognizableCabinetErrorCallback(errorResponse) {
                    //        deferred.reject(errorRresponse);
                    //    });
                })

                .catch(function cabinetsInSubsiadiaryErrorCallback(apiResponseError) {
                    //Cabinet doesn't exists in any subsidiary, so it can't leave
                    if (apiResponseError.status === 404) {
                        //Cabinet doesn't exists
                        response.no_capitalizado = { economico: id };
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

        //Internal functions
        function getCabinetInSubsidiary(id) {
            return managementUrl
                .all(control.base)
                .all(control.cabinet_in_subsidiary)
                .all(id).customGET();
        }

        function getUnrecognizableCabinetInSubsidiary(id) {
            //TODO: Add behaviour when the URLs are provided
            return id;
        }

        function getDeparturesByCabinet(id) {
            return id;
        }

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
                        binding: 'sucursal_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            kind: 'Generic',
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.SUBSIDIARY'),
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
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.TRANSPORT_KIND'),
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
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.AGENCY'),
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
                            name: Translate.translate('DEPARTURES.WARRANTY.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.WARRANTY.HINTS.PROJECT'),
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
                        binding: 'sucursal_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            kind: 'Generic',
                            name: Translate.translate('DEPARTURES.NEW.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.SUBSIDIARY'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.TRANSPORT_KIND'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.AGENCY'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.PROJECT'),
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
                            name: Translate.translate('DEPARTURES.NEW.LABELS.PETITION'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.NEW.HINTS.PETITION'),
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

        var unrecognizableDeparture = {
            template: function () {
                return {
                    tipo_salida: 'No_Capitalizados',
                    no_capitalizados_id: [],
                    descripcion: '',
                    nombre_chofer: ''
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
                            name: Translate.translate('DEPARTURES.UNRECOGNIZABLE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.UNRECOGNIZABLE.HINTS.SUBSIDIARY'),
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
                            name: Translate.translate('DEPARTURES.UNRECOGNIZABLE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('DEPARTURES.UNRECOGNIZABLE.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.UNRECOGNIZABLE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.UNRECOGNIZABLE.HINTS.TRANSPORT_KIND'),
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
                            name: Translate.translate('DEPARTURES.UNRECOGNIZABLE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.UNRECOGNIZABLE.HINTS.AGENCY'),
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
                            name: Translate.translate('DEPARTURES.UNRECOGNIZABLE.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.UNRECOGNIZABLE.HINTS.PROJECT'),
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
                            name: Translate.translate('DEPARTURES.UNRECOGNIZABLE.LABELS.PETITION'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.UNRECOGNIZABLE.HINTS.PETITION'),
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
                        binding: 'sucursal_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            kind: 'Generic',
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.SUBSIDIARY'),
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
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.TRANSPORT_KIND'),
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
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.AGENCY'),
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
                            name: Translate.translate('DEPARTURES.OBSOLETE.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.OBSOLETE.HINTS.PROJECT'),
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
                        binding: 'sucursal_id',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            kind: 'Generic',
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.SUBSIDIARY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'nombre'
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.SUBSIDIARY'),
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
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.TRANSPORT_LINE'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'razon_social'
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.TRANSPORT_LINE'),
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
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.TRANSPORT_KIND'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.TRANSPORT_KIND'),
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
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.AGENCY'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'agencia'
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.AGENCY'),
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
                            name: Translate.translate('DEPARTURES.WAREHOUSE.LABELS.PROJECT'),
                            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                            model: 'id',
                            option: 'descripcion'
                        },
                        hint: Translate.translate('DEPARTURES.WAREHOUSE.HINTS.PROJECT'),
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
            getDeparturesByCabinet: getDeparturesByCabinet,
            getUnrecognizableCabinet: getUnrecognizableCabinet,
            //Constants
            warrantyDeparture: warrantyDeparture,
            newDeparture: newDeparture,
            obsoleteDeparture: obsoleteDeparture,
            warehouseDeparture: warehouseDeparture,
            unrecognizableDeparture: unrecognizableDeparture
        };

    }

})();
