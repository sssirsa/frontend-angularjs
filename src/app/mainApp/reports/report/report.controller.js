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
            cancelButton: Translate.translate('REPORT_META.REQUEST.BUTTONS.CANCEL'),
            saveButton: Translate.translate('REPORT_META.REQUEST.BUTTONS.SAVE_FILTER'),
            fieldLabel: Translate.translate('REPORT_META.REQUEST.LABELS.FIELD'),
            propertyLabel: Translate.translate('REPORT_META.REQUEST.LABELS.PROPERTY'),
            filtersLabel: Translate.translate('REPORT_META.REQUEST.LABELS.FILTER'),
            valueLabel: Translate.translate('REPORT_META.REQUEST.LABELS.VALUE'),
            filterTranslations: {
                not:Translate.translate('REPORT_META.REQUEST.FILTERS.NOT'),
                gt:Translate.translate('REPORT_META.REQUEST.FILTERS.GT'),
                lt:Translate.translate('REPORT_META.REQUEST.FILTERS.LT'),
                gte:Translate.translate('REPORT_META.REQUEST.FILTERS.GTE'),
                lte:Translate.translate('REPORT_META.REQUEST.FILTERS.LTE'),
                contains:Translate.translate('REPORT_META.REQUEST.FILTERS.CONTAINS'),
                icontains:Translate.translate('REPORT_META.REQUEST.FILTERS.ICONTAINS'),
                startswith:Translate.translate('REPORT_META.REQUEST.FILTERS.STARTSWITH'),
                istartswith:Translate.translate('REPORT_META.REQUEST.FILTERS.ISTARTSWITH'),
                equals: Translate.translate('REPORT_META.REQUEST.FILTERS.EQUALS')
            }
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
