(function () {
    angular
        .module('app.mainApp.reports')
        .controller('reportRequestController', ReportRequestController);
    function ReportRequestController(
        $stateParams,
        REPORT,
        ErrorHandler,
        Translate
    ) {
        var vm = this;
        //Globals
        vm.reportTemplate;
        vm.queries = [];


        //Translates
        vm.translates = {
            addButton: Translate.translate('REPORT_META.REQUEST.BUTTONS.ADD'),
            removeButton: Translate.translate('REPORT_META.REQUEST.BUTTONS.REMOVE'),
            modifyButton: Translate.translate('REPORT_META.REQUEST.BUTTONS.MODIFY'),
            fieldLabel: Translate.translate('REPORT_META.REQUEST.LABELS.FIELD'),
            propertyLabel: Translate.translate('REPORT_META.REQUEST.LABELS.PROPERTY'),
            filterLabel: Translate.translate('REPORT_META.REQUEST.LABELS.FILTER'),
            valueLabel: Translate.translate('REPORT_META.REQUEST.LABELS.VALUE')
        };

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
