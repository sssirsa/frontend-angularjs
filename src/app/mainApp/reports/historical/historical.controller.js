(function () {
    'use strict';

    angular
        .module('app.mainApp.reports')
        .controller('historicalReportController', historicalReportController);

    function historicalReportController( REPORT,
                                         $state,
                                         ErrorHandler,
                                         $window
    ) {
        var vm = this;

        //Function mapping
        vm.listFilteredHistorical = listFilteredHistorical;
        vm.downloadReport = downloadReport;
        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;

        //Variable declaration
        vm.selectedKind = null;
        vm.allHistoricalReports = null;
        vm.offset = 0;
        vm.filteredActivated = false;
        vm.limit = 20;
        vm.lastFilter = 'Abierta';
        vm.lastKindFilter = 'Abierta';
        vm.refreshPaginationButtonsComponent = false;

        listFilteredHistorical('Todo');

        function listlistHistoricalReportsRequests() {
            vm.loadingPromise = REPORT.listHistoricalReports(vm.limit, vm.offset)
                .then(function (listHistoricalSuccess) {
                    vm.allHistoricalReports = listHistoricalSuccess;
                    prepareDataFunction();
                })
                .catch(function (listRequestsError) {
                    ErrorHandler.errorTranslate(listRequestsError);
                });
        }

        function listFilteredHistorical(requestKind) {
            vm.refreshPaginationButtonsComponent = false;
            vm.filteredActivated = true;
            vm.lastFilter = requestKind;
            if (vm.lastKindFilter !== requestKind){
                vm.offset = 0;
                vm.lastKindFilter = requestKind;
            }
            if (requestKind === 'Todo') {
                listlistHistoricalReportsRequests();
            }
            else {
                var filterSTR = 'status='+requestKind;
                vm.loadingPromise = REPORT.listHistoricalReports(vm.limit, vm.offset, filterSTR)
                    .then(function (listHistoricalSuccess) {
                        vm.allHistoricalReports = listHistoricalSuccess;
                        prepareDataFunction();
                    })
                    .catch(function (listHistoricalError) {
                        ErrorHandler.errorTranslate(listHistoricalError);
                    });
            }
        }

        function downloadReport(event,historical) {
            event.stopPropagation();
            $window.open(historical, '_blank');
        }

        function prepareDataFunction() {
            vm.reports_download = vm.allHistoricalReports.results;
            if (vm.allHistoricalReports.count > vm.limit) {
                vm.refreshPaginationButtonsComponent = true;
            }
            vm.filteredActivated = false;
        }

        function sigPage() {
            vm.offset += vm.limit;
            listFilteredHistorical(vm.lastFilter);
        }

        function prevPage() {
            vm.offset -= vm.limit;
            listFilteredHistorical(vm.lastFilter);
        }

        function goToNumberPage(number) {
            vm.offset = number * vm.limit;
            listFilteredHistorical(vm.lastFilter);
        }
    }
})();
