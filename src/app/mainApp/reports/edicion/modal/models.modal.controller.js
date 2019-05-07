(function () {
    'use_strict';

    angular
        .module('app.mainApp.reports')
        .controller('ModelsReportModalController', ModelsReportModalController);

    function ModelsReportModalController(
        Translate,
        Reportes,
        reporte,
        $mdDialog,
        _) {
        var vm = this;
        //Function parsing
        vm.cancel = cancel;
        vm.thema = "blue-grey";
        vm.create = create;
        vm.selectedFields = [];
        vm.selectedFilters = [];
        vm.reporte = null;
        vm.tableDisplayHeaders = [
            Translate.translate('REPORTS.MODIFY.FIELD_NAME'),
            Translate.translate('REPORTS.MODIFY.FIELD_VERBOSE'),
            Translate.translate('REPORTS.MODIFY.FIELD_TYPE'),
            Translate.translate('REPORTS.MODIFY.FIELD_FIELDS'),
            Translate.translate('REPORTS.MODIFY.FIELD_FILTER')
        ];
        activate();

        function activate() {
            var root_related_field = {
                verbose_name: reporte.root_model_name,
                field_name: '',
                path: '',
                model_id: reporte.root_model,
                related_fields: []
            };
            vm.related_models_promise = Reportes.getRelatedModels(reporte.root_model).then(function (result) {
                root_related_field.related_fields = result;
                vm.related_models = [root_related_field];
            });

        }
        function create() {
            _.each(vm.selectedFields, function (element) {
                _.extend(element, { report: reporte.id, group: false, aggregate: "", sort: null, sort_reverse: false, total: false, display_format: null });
            });
            _.each(vm.selectedFilters, function (element) {
                _.extend(element, { report: reporte.id, exclude: false, filter_value: "filtro", filter_value2: "" });
            });
            var respuesta = {
                filters: vm.selectedFilters,
                fields: vm.selectedFields
            };
            $mdDialog.hide(respuesta);
        }
        function cancel() {
            $mdDialog.cancel(null);
        }
    }

})();
