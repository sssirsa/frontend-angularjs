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
            pre_request: {
                base: 'pre_request',
                pre_request: 'pre_request',
                new_request: 'request'
            },
            request: {
                base: 'request',
                list: 'all',
                new_request: 'register',
                incremental_request: 'incremental',
                change_request: 'change',
                retrieve_request: 'retrieve',
                technical_service_request: 'technical_service'
            }
        });
}) ();
