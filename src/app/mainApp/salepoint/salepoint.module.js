(function () {
    angular
        .module('app.mainApp.salepoint',
        [
            'app.mainApp.external_service.pre_request',
            'app.mainApp.external_service.request'
        ]
        );
}) ();
