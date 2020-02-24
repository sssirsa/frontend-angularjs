(function () {
    angular
        .module('app.mainApp.warehouse')
        .factory('WAREHOUSEProvider', warehouseProvider);

    function warehouseProvider(
        API,
        QUERIES,
        URLS
    ) {
        var urlbase = API.all(URLS.warehouse.base)
            .all(URLS.warehouse.fridge);

        return {
            listByBrand: listByBrand,
            listByModel: listByModel,
            listByKind: listByKind,
            listByUnileverStatus: listByUnileverStatus
        };

        function listByBrand(filter) {
            if (filter['sucursal']) {
                if (filter['sucursal']._id) {
                    return urlbase
                        .all(QUERIES.inventory.by_subsidiary)
                        .all(filter['sucursal']._id
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['brand'])
                        .customGET();
                }
                else {
                    return urlbase
                        .all(QUERIES.inventory.by_subsidiary
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['brand'])
                        .customGET();
                }
            }
            if (filter['udn']) {
                if (filter['udn']._id) {
                    return urlbase
                        .all(QUERIES.inventory.by_agency)
                        .all(filter['udn']._id
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['brand'])
                        .customGET();
                }
                else {
                    return urlbase
                        .all(QUERIES.inventory.by_agency
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['brand'])
                        .customGET();
                }
            }
        }

        function listByModel(filter) {
            if (filter['sucursal']) {
                if (filter['sucursal']._id) {
                    return urlbase
                        .all(QUERIES.inventory.by_subsidiary)
                        .all(filter['sucursal']._id
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['model'])
                        .customGET();
                }
                else {
                    return urlbase
                        .all(QUERIES.inventory.by_subsidiary
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['model'])
                        .customGET();
                }
            }
            if (filter['udn']) {
                if (filter['udn']._id) {
                    return urlbase
                        .all(QUERIES.inventory.by_agency)
                        .all(filter['udn']._id
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['model'])
                        .customGET();
                }
                else {
                    return urlbase
                        .all(QUERIES.inventory.by_agency
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['model'])
                        .customGET();
                }
            }
        }

        function listByKind(filter) {
            if (filter['sucursal']) {
                if (filter['sucursal']._id) {
                    return urlbase
                        .all(QUERIES.inventory.by_subsidiary)
                        .all(filter['sucursal']._id
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['kind'])
                        .customGET();
                }
                else {
                    return urlbase
                        .all(QUERIES.inventory.by_subsidiary
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['kind'])
                        .customGET();
                }
            }
            if (filter['udn']) {
                if (filter['udn']._id) {
                    return urlbase
                        .all(QUERIES.inventory.by_agency)
                        .all(filter['udn']._id
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['kind'])
                        .customGET();
                }
                else {
                    return urlbase
                        .all(QUERIES.inventory.by_agency
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['kind'])
                        .customGET();
                }
            }
        }

        function listByUnileverStatus(filter) {
            if (filter['sucursal']) {
                if (filter['sucursal']._id) {
                    return urlbase
                        .all(QUERIES.inventory.by_subsidiary)
                        .all(filter['sucursal']._id
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['unilever_status'])
                        .customGET();
                }
                else {
                    return urlbase
                        .all(QUERIES.inventory.by_subsidiary
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['unilever_status'])
                        .customGET();
                }
            }
            if (filter['udn']) {
                if (filter['udn']) {
                    return urlbase
                        .all(QUERIES.inventory.by_agency)
                        .all(filter['udn']._id
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['unilever_status'])
                        .customGET();
                }
                else {
                    return urlbase
                        .all(QUERIES.inventory.by_agency
                            + '?' + QUERIES.inventory.by_attribute
                            + '=' + QUERIES.inventory.attributes['unilever_status'])
                        .customGET();
                }
            }
        }
    }
})();