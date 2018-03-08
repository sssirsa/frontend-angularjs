(function () {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('ListRequestPageController', ListRequestPageController);

    /* @ngInject */
    function ListRequestPageController($state, $log, toastr, SalePointRequests, Translate, $http, Solicitudes) {
        var vm = this;

        //Function mapping
        vm.listRequests = listRequests;
        vm.selectRequest = selectRequest;
        vm.downloadReport = downloadReport;

        //Variable declaration
        vm.selectedKind = null;
        vm.allRequests = null;

        activate();

        function activate() {
            vm.loadingPromise = SalePointRequests.getAll()
                .then(function (listRequestsSuccess) {
                    vm.allRequests = listRequestsSuccess;
                    vm.requests = vm.allRequests;
                })
                .catch(function (listRequestsError) {
                    $log.error(listRequestsError);
                    toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.ERROR'));
                });
        }

        function listRequests(requestKind) {
            if (requestKind !== 'Todo') {
                vm.requests = _.where(vm.allRequests, {status: requestKind});
            }
            else {
                vm.requests = vm.allRequests;
            }
        }

        function selectRequest(request) {
            $state.go('triangular.admin-default.detailRequest', {id: request.id});
        }

        function downloadReport(requestID) {

            $http.get('app/mainApp/servicios/solicitudes/report/formato.json')
                .success(function (formato) {
                    vm.getReportPromise = Solicitudes.report(requestID)
                        .then(function (reporte) {
                            $log.debug(reporte);
                            var fecha = moment(reporte.fecha, 'DD/MM/YYYY hh:mm:ss');
                            //Encabezado
                            //Titulo
                            formato.content[0].columns[1].stack[2].text = 'Reporte de Solicitud';
                            //Folio de la solicitud
                            formato.content[0].columns[1].stack[3].text = reporte.id;
                            //Información de la solicitud
                            //Titulo
                            formato.content[1].text = 'Información de la solicitud'
                            //Estatus
                            formato.content[2].stack[0].columns[1].text = reporte.status;
                            //Tipo
                            formato.content[2].stack[0].columns[3].text = reporte.tipo;
                            //Atendió
                            formato.content[3].stack[0].columns[1].text = reporte.persona;
                            //Fecha
                            formato.content[3].stack[0].columns[3].text = fecha;
                            //Sucursal
                            formato.content[4].stack[0].columns[1].text = reporte.sucursal;
                            //Calificación
                            formato.content[4].stack[0].columns[3].text = reporte.calificacion;
                            //Información del establecimiento
                            //Nombre establecimiento
                            formato.content[6].stack[0].columns[0].text = reporte.establecimiento.nombre_establecimiento;
                            //Encargado
                            formato.content[7].stack[0].columns[1].text = reporte.establecimiento.nombre_encargado;
                            //Teléfono
                            formato.content[7].stack[0].columns[3].text = reporte.establecimiento.telefono_encargado;
                            //Calle
                            formato.content[8].stack[0].columns[1].text = reporte.establecimiento.calle;
                            //Número
                            formato.content[8].stack[0].columns[3].text = reporte.establecimiento.numero;
                            //Entre calle 1
                            formato.content[9].stack[0].columns[1].text = reporte.establecimiento.entre_calle1;
                            //Entre call2 2
                            formato.content[9].stack[0].columns[3].text = reporte.establecimiento.entre_calle2;
                            //Estado
                            formato.content[10].stack[0].columns[1].text = reporte.establecimiento.estado;
                            //Municipio
                            formato.content[10].stack[0].columns[3].text = reporte.establecimiento.municipio;
                            //Localidad
                            formato.content[11].stack[0].columns[1].text = reporte.establecimiento.localidad;
                            //CP
                            formato.content[11].stack[0].columns[3].text = reporte.establecimiento.cp;
                            //Observaciones
                            //Técnicas
                            formato.content[13].columns[0].stack[1].text = reporte.observaciones_tecnico;
                            //Cliente
                            formato.content[13].columns[1].stack[1].text = reporte.observaciones_cliente;
                            //Firmas
                            //Trabajador
                            if (reporte.firma_prospectador) {
                                formato.content[15].columns[0].stack[1].image = 'data:image/png;base64,' + reporte.firma_prospectador;
                            }
                            //Cliente
                            if (reporte.firma_cliente) {
                                formato.content[15].columns[1].stack[1].image = 'data:image/png;base64,' + reporte.firma_cliente;
                            }

                            //Evidencias
                            reporte.evidencia.forEach(function (evidence) {
                                var image = {
                                    image: 'data:image/png;base64,' + evidence.foto,
                                    width: 500,
                                    alignment: 'center'
                                };
                                formato.content.push(image);
                            });
                            $log.debug(formato);
                            //Generación del PDF
                            pdfMake.createPdf(formato).download("Reporte-Solicitud-" + reporte.id.toString() + ".pdf");

                        })
                        .catch(function (reporteError) {
                            $log.error(reporteError);
                            toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.REPORT_ERROR'));
                        });
                })
                .catch(function (JSONError) {
                    $log.error(JSONError);
                    toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.JSON_REPORT_ERROR'));
                });
        }

    }
})();
