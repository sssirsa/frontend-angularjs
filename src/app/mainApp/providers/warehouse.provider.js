(function () {
    angular
        .module('app.mainApp')
        .factory('WAREHOUSE', warehouseProvider);

    function warehouseProvider(
        API,
        QUERIES,
        URLS
    ) {
        var urlbase = API.all(URLS.management.base)
            .all(URLS.inventory.catalogues.base)
            .all(URLS.management.inventory.cabinet);

        return {
            listByBrand: listByBrand,
            listByModel: listByModel,
            listByKind: listByKind,
            listByUnileverStatus: listByUnileverStatus
        };

        function listByBrand(filter) {
            if (filter['sucursal']) {
                return urlbase
                    .all(QUERIES.inventory.by_subsidiary)
                    .all(filter['sucursal']
                        + '?' + QUERIES.inventory.by_attribute
                        + '=' + QUERIES.inventory.attributes['brand'])
                        .customGET();
            }
            if (filter['udn']) {
                return urlbase
                    .all(QUERIES.inventory.by_agency)
                    .all(filter['udn']
                        + '?' + QUERIES.inventory.by_attribute
                        + '=' + QUERIES.inventory.attributes['brand'])
                        .customGET();
            }
        }

        function listByModel(filter) {
            if (filter['sucursal']) {
                return urlbase
                    .all(QUERIES.inventory.by_subsidiary)
                    .all(filter['sucursal']
                        + '?' + QUERIES.inventory.by_attribute
                        + '=' + QUERIES.inventory.attributes['model'])
                        .customGET();
            }
            if (filter['udn']) {
                return urlbase
                    .all(QUERIES.inventory.by_agency)
                    .all(filter['udn']
                        + '?' + QUERIES.inventory.by_attribute
                        + '=' + QUERIES.inventory.attributes['model'])
                        .customGET();
            }
        }

        function listByKind(filter) {
            if (filter['sucursal']) {
                return urlbase
                    .all(QUERIES.inventory.by_subsidiary)
                    .all(filter['sucursal']
                        + '?' + QUERIES.inventory.by_attribute
                        + '=' + QUERIES.inventory.attributes['kind'])
                        .customGET();
            }
            if (filter['udn']) {
                return urlbase
                    .all(QUERIES.inventory.by_agency)
                    .all(filter['udn']
                        + '?' + QUERIES.inventory.by_attribute
                        + '=' + QUERIES.inventory.attributes['kind'])
                        .customGET();
            }
        }

        function listByUnileverStatus(filter) {
            if (filter['sucursal']) {
                return urlbase
                    .all(QUERIES.inventory.by_subsidiary)
                    .all(filter['sucursal']
                        + '?' + QUERIES.inventory.by_attribute
                        + '=' + QUERIES.inventory.attributes['unilever_status'])
                        .customGET();
            }
            if (filter['udn']) {
                return urlbase
                    .all(QUERIES.inventory.by_agency)
                    .all(filter['udn']
                        + '?' + QUERIES.inventory.by_attribute
                        + '=' + QUERIES.inventory.attributes['unilever_status'])
                        .customGET();
            }
        }
    }
})();