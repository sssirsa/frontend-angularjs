/**
 * Created by amezc on 30/10/2016.
 */
(function() {
    'use_strict';

    angular
        .module('app.mainApp.reports')
        .controller('GenerateReportModalController', GenerateReportModalController);

    function GenerateReportModalController( Reportes, $mdDialog, reporte) {
        var vm = this;
        //Function parsing
        vm.exportar = exportar;
        vm.cancel = cancel;
        vm.report=reporte;
        //vm.formats=OPTIONS.formats;
        vm.formatSelected="xlsx";



        function exportar() {
            Reportes.requestReport(vm.report.id,vm.formatSelected).then(function () {
                $mdDialog.hide();
            }).catch(function (err) {
                $mdDialog.cancel(err);
            });
        }

        function cancel() {
            $mdDialog.cancel(null);
        }

    }

})();
