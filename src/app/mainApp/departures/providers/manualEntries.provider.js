(function () {
    angular
        .module('app.mainApp.departures')
        .service('MANUAL_DEPARTURES', ManualDeparturesProvider);

    function ManualDeparturesProvider(
        API,
        $q,
        URLS,
        Translate
    ) {
        const departuresUrl = API
            .all(URLS.departures_departures.base)
            .all(URLS.departures_departures.departures.base);
        const inventoryUrl = API
            .all(URLS.management.base)
            .all(URLS.management.inventory.base);

        const departures = URLS.entries_departures.departures;
        const inventory = URLS.management.inventory;

        function createNew(element) {
            return departuresUrl.all(departures.new).customPOST(element);
        }

        function createWarranty(element) {
            return departuresUrl.all(departures.warranty).customPOST(element);
        }

        function createObsolete(element) {
            return departuresUrl.all(departures.obsolete).customPOST(element);
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
             *   -Cabinet exists in database and can leave (Impediment and stage validation)
             *       +Cabinet full object and can_leave in true
             *   -Cabinet exist in database and can't enter (Cabinet in any warehouse)
             *       +Cabinet simplified object and can_enter in false
             *   -Cabinet doesn't exists, so it can't leave (wrong ID)
             *       +Cabinet in null and can_enter in true
             *   -Backend error
             *       +Cabinet in null, can_leave in false, error property added to return the error response
             */

            let deferred = $q.defer();
            let response = {
                can_leave: false,
                cabinet: null
            };
            getCabinetInSubsidiary(id)
                .then(function cabinetsInSubsiadiarySuccessCallback(apiResponse) {
                    //Cabinet exists in subsidiary
                    let cabinetCanLeave = true; //TODO: Write proper validation when provided by backend
                    //Cabinet can leave
                    if (cabinetCanLeave) {
                        response.can_leave = true;
                        response.cabinet = apiResponse.cabinet;
                        deferred.resolve(response);
                    }
                    //Cabinet can't leave
                    else {
                        response.cabinet = apiResponse.cabinet;
                        deferred.resolve(response);
                    }
                })
                .catch(function cabinetsInSubsiadiaryErrorCallback(apiResponseError) {
                    //Cabinet doesn't exists, so it can't lleave
                    if (apiResponseError.status === 404) {
                        //Cabinet doesn't exists
                        deferred.resolve(response);
                    }
                    else {
                        //Any other error from backend
                        response.error = errorResponse;
                        deferred.reject(response);
                    }
                });

            return deferred.promise;
        }

        //Internal functions
        function getCabinetInSubsidiary(id) {
            return departuresUrl.all(departures.control.base).all(departures.control.cabinet_in_subsidiary).all(id).customGET();
        }

        function getDeparturesByCabinet(id) {

        }

        const warrantyDeparture = {
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
                            url: URLS.sucursal,
                            kind: 'Web',
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
                            url: URLS.linea_transporte,
                            kind: 'Web',
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
                            url: URLS.tipo_transporte,
                            kind: 'Web',
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
                            url: URLS.udn,
                            kind: 'Web',
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
                            url: URLS.proyecto,
                            kind: 'Web',
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

        const newDeparture = {
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
                            url: URLS.sucursal,
                            kind: 'Web',
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
                            url: URLS.linea_transporte,
                            kind: 'Web',
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
                            url: URLS.tipo_transporte,
                            kind: 'Web',
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
                            url: URLS.udn,
                            kind: 'Web',
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
                            url: URLS.proyecto,
                            kind: 'Web',
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
                            url: URLS.pedimento,
                            kind: 'Web',
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

        const unrecognizableDeparture = {
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
                            url: URLS.sucursal,
                            kind: 'Web',
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
                            url: URLS.linea_transporte,
                            kind: 'Web',
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
                            url: URLS.tipo_transporte,
                            kind: 'Web',
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
                            url: URLS.udn,
                            kind: 'Web',
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
                            url: URLS.proyecto,
                            kind: 'Web',
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
                            url: URLS.pedimento,
                            kind: 'Web',
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

        const obsoleteDeparture = {
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
                            url: URLS.sucursal,
                            kind: 'Web',
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
                            url: URLS.linea_transporte,
                            kind: 'Web',
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
                            url: URLS.tipo_transporte,
                            kind: 'Web',
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
                            url: URLS.udn,
                            kind: 'Web',
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
                            url: URLS.proyecto,
                            kind: 'Web',
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

        return {
            createNew: createNew,
            createWarranty: createWarranty,
            createObsolete: createObsolete,
            createUnrecognizable: createUnrecognizable,
            addCabinet: addCabinet,
            detail: detail,
            close: close,
            getCabinet: getCabinet,
            getDeparturesByCabinet: getDeparturesByCabinet,
            //Constants
            warrantyDeparture: warrantyDeparture,
            newDeparture: newDeparture,
            obsoleteDeparture: obsoleteDeparture,
            unrecognizableDeparture: unrecognizableDeparture
        }

    }

})();
