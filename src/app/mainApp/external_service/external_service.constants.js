(function () {
    angular
        .module('app.mainApp.external_service')
        .constant('EXTERNAL_SERVICE', {
            base: 'sale_point',
            catalogues: {
                base: 'catalogues'
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
                increase_request: 'increase'
            }
        });
})();
