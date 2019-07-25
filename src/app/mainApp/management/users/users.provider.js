(function () {
    angular
        .module('app.mainApp.management.users')
        .factory('USERS', UsersProvider);
    function UsersProvider(
        API,
        EnvironmentConfig,
        URLS,
        Translate,
        PAGINATION
    ) {

        var personUrl = API.all(URLS.management.base
            + '/' + URLS.management.administration.base
            + '/' + URLS.management.administration.person);

        var getUserDetail = function getUserDetail(id) {
            return personUrl.customGET(id);
        };

        var modifyPerson = function modifyPerson(id, element) {
            return personUrl.all(id).customPUT(element);
        };

        var createPerson = function createPerson(element) {
            return personUrl.customPOST(element);
        };
        
        var catalogues = {
            subsidiary: {
                binding: 'sucursal_id',
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.subsidiary,
                    
                    name: Translate.translate('USERS.CREATE.LABELS.SUBSIDIARY'),
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
                hint: Translate.translate('USERS.CREATE.HINTS.SUBSIDIARY'),
                icon: 'fa fa-warehouse',
                required: true
            },
            udn: {
                binding: 'udn_id',
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.udn,
                    
                    name: Translate.translate('USERS.CREATE.LABELS.AGENCY'),
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
                hint: Translate.translate('USERS.CREATE.HINTS.AGENCY'),
                icon: 'fa fa-building',
                required: true
            }
        };

        return {
            getUserDetail: getUserDetail,
            modifyPerson: modifyPerson,
            createPerson: createPerson,
            catalogues: catalogues
        };

    }
})();
