(function () {
    angular
        .module('app.mainApp.external_service')
        .constant('EXTERNAL_SERVICE', {
            base: '',
            catalogues: {
                base: 'catalogues'
            },
            pre_request: {
                base: ''
            },
            request: {
                base: ''
            }
        });
})();
