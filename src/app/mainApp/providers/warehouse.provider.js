(function () {
    angular
        .module('app.mainApp.warehouse')
        .factory('WAREHOUSEProvider', warehouseProvider);

    function warehouseProvider(
        API,
        QUERIES,
        URLS,
        XLSX,
        moment,
        $q
    ) {
        var urlbase = API.all(URLS.warehouse.base)
            .all(URLS.warehouse.fridge);


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

        function generateReport(filter) {
            var defer = $q.defer();

            list(filter)
                .then(function (assetList) {
                    //Initialize variable with table headers
                    var assetData = [];
                    assetData.push({
                        A: "Total de equipos",
                        B: assetList.length
                    });
                    assetData = [{
                        A: "Activo",
                        B: "Inventario",
                        C: "Serie",
                        D: "Denominación",
                        E: "Año",
                        F: "Tipo",
                        G: "Status",
                        H: "Localización",//Changed below
                        I: "Fecha de ingreso"
                    }];

                    if (filter['sucursal']) {
                        assetData[0].H = "Sucursal";
                    }

                    if (filter['udn']) {
                        assetData[0].H = "Udn";
                    }

                    angular.forEach(assetList, function (value) {
                        var location;
                        if (filter['sucursal']) {
                            location = value.sucursal.nombre;
                        }

                        if (filter['udn']) {
                            location = value.udn.nombre;
                        }
                        var unileverStatusString = "Sin estatus unilever";
                        if (value['estatus_unilever']) {
                            unileverStatusString = value.estatus_unilever.code + ' - ' + value.estatus_unilever.description;
                        }
                        assetData.push({
                            A: value.id_unilever ? value.id_unilever : "Sin activo",
                            B: value.economico ? value.economico : "Sin inventario",
                            C: value.no_serie ? value.no_serie : "Sin número de serie",
                            D: value.modelo ? value.modelo.nombre : "Sin denominación",
                            E: value.modelo && value.modelo.tipo ? value.modelo.tipo.nombre : "Sin tipo de equipos",
                            F: value.year ? value.year : "Sin año",
                            G: unileverStatusString,
                            H: location ? location : "Sin localización",
                            I: value.fecha_ingreso ? value.fecha_ingreso : "Sin información"
                        });
                    });

                    var ws = XLSX.utils.json_to_sheet(assetData, {
                        header: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
                        skipHeader: true
                    });

                    XLSX.utils.sheet_add_json(ws,
                        assetData,
                        { header: ["A", "B", "C", "D", "E", "F", "G", "H", "I"], skipHeader: true, location: { c: 0, r: 0 } });

                    /* add to workbook */
                    var wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Stock");

                    /* write workbook and force a download */
                    XLSX.writeFile(wb, name ? name : "reporte_inventario " + moment().format("YYYY-MM-DD HH:mm:ss") + ".xlsx");
                    defer.resolve();
                })
                .catch(function (listError) {
                    defer.reject(listError);
                });

            return defer.promise;
        }

        //Internal functions
        function list(filter) {
            var params = {};
            params[QUERIES.inventory.by_attribute] = QUERIES.inventory.attributes['all'];
            if (filter['sucursal']) {
                if (filter['sucursal']._id) {
                    return urlbase
                        .all(QUERIES.inventory.by_subsidiary)
                        .all(filter['sucursal']._id)
                        .customGET(null, params);
                }
                else {
                    return urlbase
                        .all(QUERIES.inventory.by_subsidiary)
                        .customGET(null, params);
                }
            }
            if (filter['udn']) {
                if (filter['udn']._id) {
                    return urlbase
                        .all(QUERIES.inventory.by_agency)
                        .all(filter['udn']._id)
                        .customGET(null, params);
                }
                else {
                    return urlbase
                        .all(QUERIES.inventory.by_agency)
                        .customGET(null, params);
                }
            }
        }


        return {
            listByBrand: listByBrand,
            listByModel: listByModel,
            listByKind: listByKind,
            listByUnileverStatus: listByUnileverStatus,
            generateReport: generateReport
        };
    }
})();