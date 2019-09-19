(function () {
    angular
        .module('app.mainApp.reports')
        .constant('REPORTS', {
            base: 'report',
            report: {
                base: 'report-manager',
                new: {
                    base: 'report',
                    request: 'request'
                },
                historical: {
                    base: 'history'
                }
            }

        });
})();
