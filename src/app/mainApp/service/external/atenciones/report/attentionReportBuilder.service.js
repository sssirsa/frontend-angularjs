(function () {
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('AttentionReportBuilder', AttentionReportBuilder);

    function AttentionReportBuilder(atencionPV, $http, $log, toastr, Translate) {
        var vm = this;


        return {
            buildReport: buildReport
        };

        function buildReport(id) {

            var getInfopromise = atencionPV.getReport(id);
            getInfopromise.then(function (respuesta) {
                vm.infoReport = respuesta;
                $http.get('app/mainApp/service/external/atenciones/report/report.json')
                    .then(function (reporteToPDF) {
                        vm.reportToPDF = reporteToPDF;
                        $http.get('app/mainApp/service/external/atenciones/report.header.json')
                            .then(function (cabecera) {
                                vm.cabecera = cabecera;
                                vm.cabecera.header.columns[1][4].text = vm.infoReport.folio;
                                vm.cabecera.header.columns[1][5].text = vm.infoReport.tipo;
                                vm.reportToPDF.content.push(vm.cabecera.header);
                                vm.reportToPDF.content.push(vm.cabecera.break);
                                $log.info(vm.reportToPDF);
                                pdfMake.createPdf(vm.reportToPDF).download("Reporte-atencion-" + vm.infoReport.folio.toString() + ".pdf");

                            });


                    }).catch(function (JSONError) {
                    $log.error(JSONError);
                    toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.JSON_REPORT_ERROR'));
                });
            });
        }


    }
})();
