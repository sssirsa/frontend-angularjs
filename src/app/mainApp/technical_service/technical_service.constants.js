(function () {
    angular
        .module('app.mainApp.technical_service')
        .constant('TECHNICAL_SERVICE', {
            base: 'technical_services',
            catalogues: {
                base: 'catalogues',
                action: 'action',
                symptom: 'symptom',
                failure_type: 'failure_type',
                next_step: 'next_step',
                com_incidence: 'com_incidence'
            }
        });
})();
