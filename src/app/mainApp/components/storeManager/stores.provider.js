(function () {
    angular
        .module('app.mainApp')
        .factory('Stores', Stores);

    function Stores(
        API,
        URLS,
        QUERIES,
        PAGINATION,
        Helper,
        $q,
        EnvironmentConfig,
        Translate
    ) {
        var baseURL = API
            .all(URLS.salepoint.base)
            .all(URLS.salepoint.catalogues.base)
            .all(URLS.salepoint.catalogues.stores);

        function list() {
            return baseURL.getList();
        }

        function getByID(id) {
            return baseURL.all(id).customGET();
        }

        function create(object) {
            return baseURL.customPOST(object);
        }

        function remove(id) {
            return baseURL.customDELETE(id, null, { 'content-type': 'application/json' });
        }

        function update(object, id) {
            if (id) {
                return baseURL.all(id).customPUT(object);
            }
            else {
                return baseURL.all(object.id).customPUT(object);
            }
        }

        function getByEconomic(economic, limit, offset) {
            return querySearch(QUERIES.store.by_economic + economic + '?', limit, offset);
        }

        function querySearch(query, limit, offset) {
            var defer = $q.defer();
            // TODO: falta agregar metodo de paginado
            API
                .all(URLS.salepoint.base)
                .all(URLS.salepoint.catalogues.base)
                .all(URLS.salepoint.catalogues.stores + query + '&limit=' + limit + '&offset=' + offset)
                .customGET()
                .then(function (list) {
                    defer.resolve(list);
                })
                .catch(function (listError) {
                    defer.reject(listError);
                });

            return defer.promise;
        }

        function getPDF(id_establecimiento) {
            return baseURL.all(URLS.credentials).all(id_establecimiento).customGET();
        }

        var catalogues = {
            states: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.salepoint.base
                        + '/' + URLS.salepoint.catalogues.base
                        + '/' + URLS.salepoint.catalogues.states,
                    name: Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.LABELS.STATE'),
                    loadMoreButtonText: 'Cargar mas',
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
                }
            },
            cities: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.salepoint.base
                        + '/' + URLS.salepoint.catalogues.base
                        + '/' + URLS.salepoint.catalogues.cities,
                    name: Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.LABELS.CITY'),
                    loadMoreButtonText: 'Cargar mas',
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
                }
            },
            localities: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.salepoint.base
                        + '/' + URLS.salepoint.catalogues.base
                        + '/' + URLS.salepoint.catalogues.localities,
                    name: Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.LABELS.LOCALITY'),
                    loadMoreButtonText: 'Cargar mas',
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
                }
            },
            segmentations: {
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.salepoint.base
                        + '/' + URLS.salepoint.catalogues.base
                        + '/' + URLS.salepoint.catalogues.segmentation,
                    name: Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.LABELS.SEGMENTATION'),
                    loadMoreButtonText: 'Cargar mas',
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
                }
            }
        };

        var manager = {
            actions: {
                LIST: {
                    elements: 'results',
                    mode: PAGINATION.mode,
                    pagination: {
                        total: PAGINATION.total,
                        limit: PAGINATION.limit,
                        offset: PAGINATION.offset,
                        pageSize: PAGINATION.pageSize
                    },
                    fields: [
                        {
                            type: 'text',
                            model: 'nombre_establecimiento',
                            label: Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.LABELS.NAME')
                        },
                        {
                            type: 'text',
                            model: 'nombre_encargado',
                            label: Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.LABELS.MANAGER')
                        },
                        {
                            type: 'text',
                            model: 'telefono_encargado',
                            label: Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.LABELS.MANAGER_PHONE'),
                            nullOrEmpty: Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.NO_PHONE')
                        }
                    ],
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                }
            },
            loadingMessage: Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.MODALS.SEARCH.SEARCHING'),
            loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
            nextButtonText: Translate.translate('MAIN.BUTTONS.NEXT'),
            previousButtonText: Translate.translate('MAIN.BUTTONS.PREVIOUS'),
            query: '',
            queryValue: '',
            url: null
        };

        return {
            list: list,
            getByID: getByID,
            create: create,
            remove: remove,
            update: update,
            getByEconomic: getByEconomic,
            getPDF: getPDF,
            catalogues: catalogues,
            manager: manager
        };

    }

})();
