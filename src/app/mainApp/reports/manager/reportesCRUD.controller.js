/**
 * Created by Emmanuel on 16/10/2016.
 */
(function () {
    "use strict";

    angular
        .module('app.mainApp.reports')
        .controller('ReportesCrudController', ReportsCrudController)
        .filter('reportSearch', reportSearch);
    function ReportsCrudController(toastr, $stateParams, OPTIONS, $mdDialog, Reportes, Translate) {
        //Variable declaration
        var vm = this;
        vm.isOpen = false;
        vm.hidden = false;
        vm.report = null;
        vm.formato = "DD-MM-YYYY";
        vm.filterType = OPTIONS.filter;
        vm.days = OPTIONS.days;
        vm.searchParameter = "";

        vm.filterTypeDate = OPTIONS.filterDate;
        vm.filterTypeChar = OPTIONS.filterChar;
        vm.filterInt = OPTIONS.filterInt;
        vm.fieldQueries = OPTIONS.field_types;

        //Function parse
        vm.lookup = lookup;
        vm.querySearch = querySearch;
        vm.selectedItemChange = selectedItemChange;
        vm.createReport = createReport;
        vm.duplicateReport = duplicateReport;
        vm.remove = remove;
        vm.update = update;
        vm.onTabPreview = onTabPreview;
        vm.clear = clear;
        vm.exportar = exportar;
        vm.getValidFilters = getValidFilters;
        vm.initDates = initDates;
        vm.removeField = removeField;
        vm.removeFilter = removeFilter;
        vm.showEditionFields = showEditionFields;

        vm.tableDisplayHeaders = [
            Translate.translate('REPORTS.MODIFY.TABLE'),
            Translate.translate('REPORTS.MODIFY.FIELD_NAME'),
            Translate.translate('REPORTS.MODIFY.FIELD_VERBOSE'),
            Translate.translate('REPORTS.MODIFY.FIELD_TYPE'),
            Translate.translate('REPORTS.MODIFY.FIELD_QUERY'),
            Translate.translate('REPORTS.MODIFY.GROUP'),
            Translate.translate('REPORTS.MODIFY.TOTALS'),
            Translate.translate('REPORTS.MODIFY.DELETE')
        ];

        vm.tableFilterHeaders = [
            Translate.translate('REPORTS.MODIFY.TABLE'),
            Translate.translate('REPORTS.MODIFY.FIELD_NAME'),
            Translate.translate('REPORTS.MODIFY.FIELD_VERBOSE'),
            Translate.translate('REPORTS.MODIFY.FIELD_TYPE'),
            Translate.translate('REPORTS.TABLE_FILTER.FILTER_TYPE'),
            Translate.translate('REPORTS.MODIFY.VALUE'),
            Translate.translate('REPORTS.MODIFY.EXCLUDE'),
            Translate.translate('REPORTS.MODIFY.DELETE')
        ];

        vm.fieldQueries = OPTIONS.field_types;
        //Translates
        vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.successCreate = Translate.translate('REPORTS.MESSAGES.REPORT_CREATE_SUCCESS');
        vm.successUpdate = Translate.translate('REPORTS.MESSAGES.REPORT_UPDATE_SUCCESS');
        vm.errorCreate = Translate.translate('REPORTS.MESSAGES.REPORT_CREATE_ERROR');
        vm.successDelete = Translate.translate('REPORTS.MESSAGES.REPORT_DELETE_SUCCESS');
        vm.errorDelete = Translate.translate('REPORTS.MESSAGES.REPORT_DELETE_ERROR');
        vm.successClone = Translate.translate('REPORTS.MESSAGES.REPORT_CLONE_SUCCESS');
        vm.errorClone = Translate.translate('REPORTS.MESSAGES.REPORT_CLONE_ERROR');
        vm.errorPreview = Translate.translate('REPORTS.MESSAGES.REPORT_PREVIEW_ERROR');
        vm.errorExport = Translate.translate('REPORTS.MESSAGES.REPORT_EXPORT_ERROR');

        vm.successTitleExport = Translate.translate('REPORTS.MESSAGES.REPORT_EXPORT_TITLE_SUCCESS');
        vm.successExport = Translate.translate('REPORTS.MESSAGES.REPORT_EXPORT_MSG_SUCCESS');

        vm.dialogTitle = Translate.translate('MAIN.DIALOG.DELETE_TITLE');
        vm.dialogMessage = Translate.translate('MAIN.DIALOG.DELETE_MESSAGE');
        vm.deleteButton = Translate.translate('MAIN.BUTTONS.DELETE');
        vm.cancelButton = Translate.translate('MAIN.BUTTONS.CANCEL');

        activate();
        function activate() {
            vm.loadingPromise = Reportes.getPartialReports().then(function (res) {
                vm.reports = res;
                vm.reports = _.sortBy(vm.reports, 'name');

            });
            if ($stateParams.id !== null) {
                var obj = {
                    id: $stateParams.id
                };
                selected(obj);
            }

        }

        function querySearch(query) {
            return query ? lookup(query) : vm.reports;

        }

        function onTabPreview() {
            vm.preview = null;
            vm.loadingPromisePreview = Reportes.generatePreviewPaginator(vm.report.id, 1).then(function (res) {
                vm.preview = res;
            }).catch(function () {
                toastr.warning(vm.errorPreview, vm.errorTitle);
            });
        }

        function selectedItemChange(item) {
            if (item !== null) {
                vm.selectedReport = angular.copy(item);
                vm.loadingPromiseReport = Reportes.getReportObject(item.id).then(function (res) {
                    vm.report = angular.copy(res);
                    if (res.displayfield_set !== null)
                        vm.report.displayfield_set = reorganizeFieldIndexes(res.displayfield_set);
                    if (res.filterfield_set !== null)
                        vm.report.filterfield_set = reorganizeFieldIndexes(res.filterfield_set);
                    Reportes.getModel(res.root_model).then(function (res) {
                        vm.rootModel = res.name;
                    }).catch();
                });

                vm.selectedTab = 0;
            } else {
                //cancel();
            }
        }

        function exportar() {

            $mdDialog.show({
                controller: 'GenerateReportModalController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/reports/manager/modal/generate/generateReport.modal.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    reporte: vm.report
                }
            }).then(function () {
                toastr.success(vm.successExport, vm.successTitleExport);
            }).catch(function (err) {
                if (err !== null) {
                    toastr.error(vm.errorExport, vm.errorTitle);
                }
            });
        }

        function clear() {
            vm.report = null;
            vm.selectedReport = null;
            vm.searchParameter = "";
        }

        function update() {
            vm.report.report_file_creation=moment(vm.report.report_file_creation,vm.formato).format('YYYY-MM-DD');
            vm.report.report_file_creation=moment(vm.report.report_file_creation,vm.formato).format('YYYY-MM-DD');
            angular.forEach(vm.report.filterfield_set, function(value, key) {
                if(value.field_type === "DateField"){
                    value.filter_value2=moment(value.filter_value2,vm.formato).format('YYYY-MM-DD');
                }
            });
            Reportes.updateReport(vm.report).then(function () {
                toastr.success(vm.successUpdate, vm.successTitle);
                activate();
            }).catch(function () {
                toastr.warning(vm.errorMessage, vm.errorTitle);
            });
        }

        function lookup(search_text) {
            vm.search_items = _.filter(vm.reports, function (item) {
                return item.name.toLowerCase().indexOf(search_text.toLowerCase()) >= 0;
            });
            return vm.search_items;
        }

        function duplicateReport() {
            $mdDialog.show({
                controller: 'CloneReportModalController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/reports/manager/modal/clone/cloneReport.modal.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    reporte: vm.report
                }
            }).then(function () {
                activate();
                toastr.success(vm.successClone, vm.successTitle);
            }).catch(function (err) {
                if (err !== null) {
                    toastr.error(vm.errorClone, vm.errorTitle);
                }
            });
        }

        function createReport() {

            $mdDialog.show({
                controller: 'CreateReportModalController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/reports/manager/modal/create/createReport.modal.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true
            }).then(function (reportCreatedSuccess) {
                Reportes.getReportObject(reportCreatedSuccess.id).then(function(reportObtainedSuccess){
                    clear();
                    vm.searchParameter=reportObtainedSuccess.name;
                    vm.report=angular.copy(reportObtainedSuccess);
                    vm.selectedReport=angular.copy(reportObtainedSuccess);
                    toastr.success(vm.successCreate, vm.successTitle);
                })
            }).catch(function (err) {
                if (err !== null) {
                    toastr.error(vm.errorCreate, vm.errorTitle);
                }
            });
        }

        function remove() {
            var confirm = $mdDialog.confirm()
                .title(vm.dialogTitle)
                .textContent(vm.dialogMessage)
                .ariaLabel('Confirmar eliminación')
                .ok(vm.deleteButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function () {
                Reportes.deleteReport(vm.report).then(function () {
                    toastr.success(vm.successDelete, vm.successTitle);
                    activate();
                }).catch(function () {
                    toastr.error(vm.errorDelete, vm.errorTitle);
                });
            }, function () {
                //Cancelled
            });


        }

        function getValidFilters(fieldType) {
            switch (fieldType) {
                case 'CharField':
                    return vm.filterTypeChar;
                    break;
                case 'DateTimeField':
                    return vm.filterTypeDate;
                    break;
                case 'DateField':
                    return vm.filterTypeDate;
                    break;
                case 'DecimalField':
                    return vm.filterInt;
                case 'IntegerField':
                    return vm.filterInt;
                default:
                    return vm.filterType;
                    break;
            }
        }

        function initDates(field) {
            if (field.filter_type === 'range') {
                if (field.filter_value2 === "") {
                    field.filter_value = moment();
                    field.filter_value2 = moment();
                }
            } else if (field.filter_type === 'week_day') {
                field.filter_value = "";
                field.filter_value2 = "";
            }
        }

        function removeField(id) {
            vm.report.displayfield_set.splice(id, 1);
            vm.report.displayfield_set = reorganizeFieldIndexes(vm.report.displayfield_set);
        }

        function removeFilter(id) {
            vm.report.filterfield_set.splice(id, 1);
            vm.report.filterfield_set = reorganizeFieldIndexes(vm.report.filterfield_set);
        }

        function reorganizeFieldIndexes(fields) {
            for (i = 0; i < fields.length; i++) {
                fields[i].position = i;
            }
            return fields;
        }

        function showEditionFields(ev) {
            $mdDialog.show({
                controller: 'ModelsReportModalController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/reports/edicion/modal/models.modal.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                fullscreen: true,
                clickOutsideToClose: true,
                locals: {
                    reporte: vm.report
                }
            }).then(function (res) {
                Array.prototype.push.apply(vm.report.displayfield_set, res.fields);
                vm.report.displayfield_set = reorganizeFieldIndexes(vm.report.displayfield_set);
                Array.prototype.push.apply(vm.report.filterfield_set, res.filters);
                vm.report.filterfield_set = reorganizeFieldIndexes(vm.report.filterfield_set);
            }).catch(function (err) {
                if (err !== null) {
                    toastr.warning(vm.errorMessage, vm.errorTitle);
                }
            });
        }
    }

    function reportSearch() {
        return function (input, text) {
            if (!angular.isString(text) || text === '') {
                return input;
            }

            return _.filter(input, function (item) {
                return item.name.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            });

        };
    }

})();
