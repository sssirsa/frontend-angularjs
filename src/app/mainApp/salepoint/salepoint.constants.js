(function () {
    angular
        .module('app.mainApp.salepoint')
        .constant('SALEPOINT', {
            base: 'sale_point',
            catalogues: {
                base: 'catalogues',
                cities: 'municipio',
                localities: 'localidad',
                segmentation:'segmentacion',
                states: 'estado',
                stores:'establecimiento'
            },
            preRequest:'pre_request',
            requests:'request'
        });
}) ();
