(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint.request')
        .controller('listRequestController', listRequestController);

    /* @ngInject */
    function listRequestController(
        REQUESTS,
        $state,
        ErrorHandler,
        Translate,
        $http,
        pdfMake,
        $log,
        $mdDialog,
        $document
    ) {
        var vm = this;

        //Function mapping
        vm.AssignationTechnician = AssignationTechnician;
        vm.listFilteredRequests = listFilteredRequests;
        vm.selectRequest = selectRequest;
        vm.downloadReport = downloadReport;
        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;

        //Variable declaration
        vm.selectedKind = null;
        vm.allRequests = null;
        vm.offset = 0;
        vm.filteredActivated = false;
        vm.limit = 20;
        vm.lastFilter = 'Abierta';
        vm.lastKindFilter = 'Abierta';
        vm.refreshPaginationButtonsComponent = false;

        listFilteredRequests('Abierta');

        function listRequests() {
            vm.loadingPromise = REQUESTS.listRequests(vm.limit, vm.offset)
                .then(function (listRequestsSuccess) {
                    vm.allRequests = listRequestsSuccess;
                    prepareDataFunction();
                })
                .catch(function (listRequestsError) {
                    ErrorHandler.errorTranslate(listRequestsError);
                });
        }

        function listFilteredRequests(requestKind) {
            vm.refreshPaginationButtonsComponent = false;
            vm.filteredActivated = true;
            vm.lastFilter = requestKind;
            if (vm.lastKindFilter !== requestKind){
                vm.offset = 0;
                vm.lastKindFilter = requestKind;
            }
            if (requestKind === 'Todo') {
                listRequests();
            }
            else {
                var filterSTR = {status: requestKind};
                vm.loadingPromise = REQUESTS.listRequests(vm.limit, vm.offset, filterSTR)
                    .then(function (listRequestsSuccess) {
                        vm.allRequests = listRequestsSuccess;
                        prepareDataFunction();
                    })
                    .catch(function (listRequestsError) {
                        ErrorHandler.errorTranslate(listRequestsError);
                    });
            }
        }

        function selectRequest(request) {
            $state.go('triangular.admin-default.detail-request', {id: request.id});
        }

        function AssignationTechnician(attention) {
            $mdDialog.show({
                controller: 'dialogAsignationTechnicianController',
                templateUrl: 'app/mainApp/salepoint/attentions/assignment/dialogAssignationTechnician.tmpl.html',
                parent: angular.element($document.body),
                controllerAs: 'vm',
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    attention: attention
                }
            })
                .then(function () {
                    vm.listAttentions();
                });
        }

        function downloadReport(requestID, event) {

            event.stopPropagation();

            $http.get('app/mainApp/salepoint/request/report/formato.json')
                .then(function (formato) {
                    if(formato) {
                        vm.getReportPromise = REQUESTS.getRequestByID(requestID)
                            .then(function (reporte) {
                                var fecha = moment(reporte.fecha_entrada).format('DD/MM/YYYY hh:mm:ss');
                                var persona = reporte.persona.nombre + ' ' + reporte.persona.apellido_materno;
                                var direccion = reporte.establecimiento.localidad;
                                //Encabezado
                                //Titulo
                                formato.data.content[0].columns[1].stack[2].text = 'Reporte de Solicitud';
                                //Folio de la solicitud
                                formato.data.content[0].columns[1].stack[3].text = reporte.id;
                                //Información de la solicitud
                                //Titulo
                                formato.data.content[1].text = 'Información de la solicitud';
                                //Estatus
                                formato.data.content[2].stack[0].columns[1].text = reporte.status;
                                //Tipo
                                formato.data.content[2].stack[0].columns[3].text = reporte.tipo;
                                //Atendió
                                formato.data.content[3].stack[0].columns[1].text = persona;
                                //Fecha
                                formato.data.content[3].stack[0].columns[3].text = fecha;
                                //Sucursal
                                formato.data.content[4].stack[0].columns[1].text = reporte.sucursal.nombre;
                                //Calificación
                                formato.data.content[4].stack[0].columns[3].text = reporte.calificacion;
                                //Información del establecimiento
                                //Nombre establecimiento
                                formato.data.content[6].stack[0].columns[0].text = reporte.establecimiento.nombre_establecimiento;
                                //Encargado
                                formato.data.content[7].stack[0].columns[1].text = reporte.establecimiento.nombre_encargado;
                                //Teléfono
                                formato.data.content[7].stack[0].columns[3].text = reporte.establecimiento.telefono_encargado;
                                //Calle
                                formato.data.content[8].stack[0].columns[1].text = reporte.establecimiento.calle;
                                //Número
                                formato.data.content[8].stack[0].columns[3].text = reporte.establecimiento.numero;
                                //Entre calle 1
                                formato.data.content[9].stack[0].columns[1].text = reporte.establecimiento.entre_calle1;
                                //Entre call2 2
                                formato.data.content[9].stack[0].columns[3].text = reporte.establecimiento.entre_calle2;
                                //Estado
                                formato.data.content[10].stack[0].columns[1].text = direccion.municipio.estado.nombre;
                                //Municipio
                                formato.data.content[10].stack[0].columns[3].text = direccion.municipio.nombre;
                                //Localidad
                                formato.data.content[11].stack[0].columns[1].text = direccion.nombre;
                                //CP
                                formato.data.content[11].stack[0].columns[3].text = direccion.codigo_postal;
                                //Observaciones
                                //Técnicas
                                formato.data.content[13].columns[0].stack[1].text = reporte.observaciones_tecnico;
                                //Cliente
                                formato.data.content[13].columns[1].stack[1].text = reporte.observaciones_cliente;
                                //Firmas
                                //Trabajador
                                if (reporte.firma_prospectador) {
                                    formato.data.content[15].columns[0].stack[1].image = 'data:image/png;base64,' + reporte.firma_prospectador;
                                }
                                //Cliente
                                if (reporte.firma_cliente) {
                                    formato.data.content[15].columns[1].stack[1].image = 'data:image/png;base64,' + reporte.firma_cliente;
                                }

                                //Evidencias
                                reporte.evidencia.forEach(function (evidence) {
                                    var image = {
                                        image: 'data:image/png;base64,' + evidence.foto,
                                        width: 500,
                                        alignment: 'center'
                                    };
                                    formato.data.content.push(image);
                                });
                                //Generación del PDF
                                $log.log(formato.data.content);
                                pdfMake.createPdf(formato.data).download("Reporte-Solicitud-" + reporte.id.toString() + ".pdf");

                            })
                            .catch(function (reporteError) {
                                $log.log(reporteError);
                                ErrorHandler.errorTranslate(reporteError);
                            });
                    }
                    else{
                        ErrorHandler.errorTranslate("Error al leer el formato.data del reporte");
                        //toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.JSON_REPORT_ERROR'));
                    }
                })
                .catch(function (JSONError) {
                    ErrorHandler.errorTranslate(JSONError);
                });
        }

        function prepareDataFunction() {
            vm.requests = vm.allRequests.results;
            if (vm.allRequests.count > vm.limit) {
                vm.refreshPaginationButtonsComponent = true;
            }
            vm.filteredActivated = false;
        }

        function sigPage() {
            vm.offset += vm.limit;
            listFilteredRequests(vm.lastFilter);
        }

        function prevPage() {
            vm.offset -= vm.limit;
            listFilteredRequests(vm.lastFilter);
        }

        function goToNumberPage(number) {
            vm.offset = number * vm.limit;
            listFilteredRequests(vm.lastFilter);
        }
    }
})();
