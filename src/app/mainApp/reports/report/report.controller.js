(function () {
    angular
        .module('app.mainApp.reports')
        .controller('reportRequestController', ReportRequestController);
    function ReportRequestController(
        $stateParams,
        REPORT,
        ErrorHandler
    ) {
        var vm = this;
        //Globals
        vm.reportTemplate;


        var init = function init() {
            if ($stateParams.reportId) {
                vm.loadingPromise = REPORT
                    .getReportByID($stateParams.reportId)
                    .then(function reportSuccess(response) {
                        vm.reportTemplate = response;
                    })
                    .catch(function reportError(error) {
                        ErrorHandler.errorTranslate(error);
                    });
            }
            else {
                throw new Error('Parameter "reportID" was not provided');
            }
        };

        init();

        //Functions
        vm.generate = function generate() {
            //TODO: Handle generate funcitonality
        };
    }
})();
