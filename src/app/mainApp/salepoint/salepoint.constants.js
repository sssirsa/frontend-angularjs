(function () {
    angular
        .module('app.mainApp.salepoint')
        .constant('SALEPOINT', {
            base: 'salepoint',
            catalogues: {
                base: 'catalogues',
                cities: 'municipio',
                localities: 'localidad',
                states: 'estado',
                stores:'establecimiento'
            }
        });
}) ();
