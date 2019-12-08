(function () {
    angular
        .module('app.mainApp.salepoint')
        .controller('dialogAsignationTechnicianController', dialogAsignationTechnicianController);

    function dialogAsignationTechnicianController(
        ATTENTIONS,
        REQUESTS,
        $state,
        $mdDialog,
        $document,
        ErrorHandler,
        $stateParams,
        attention,
        Stores,
        Person,
        Persona_Admin,
        SalePoint,
        EnvironmentConfig,
        URLS,
        PAGINATION,
        QUERIES,
        toastr,
        Translate,
        $log,
        _
    ) {
        var vm = this;

        //Variables
        vm.chip = [];
        vm.request = null;
        vm.assignedPerson = null;
        vm.personSearchText = null;
        vm.personList = null;
        vm.store = null;
        vm.toAsigned = {
            persona_id: null,
            prioridad: 4,
            hora_inicio: '09:00:00',
            hora_fin: '18:00:00'
        };
        vm.horainicio = null;
        vm.horafin = null;

        vm.horamin = '09:00:00';
        vm.horaminPrev = null;
        vm.horamax = '18:00:00';
        vm.horamaxPrev = null;

        vm.horaminPrev = attention.hora_cliente_inicio;
        vm.horamaxPrev = attention.hora_cliente_fin;

        if (attention.folio) {
            vm.id = attention.folio;
        } else {
            vm.id = attention.id;
        }

        vm.limit = 0;
        vm.noResults = null;
        vm.filtro = false;

        //Functions
        vm.selectedPersonChange = selectedPersonChange;
        vm.preSearchPerson = preSearchPerson;
        vm.onElementSelect = onElementSelect;
        vm.clearText = clearText;
        vm.assign = assign;
        vm.cancel = cancel;
        vm.view = view;
        vm.clean = clean;

        setLimitHours();
        activate();

        vm.personal = {
            type: 'catalog',
            model: 'id',
            label: 'Trabajadores',
            catalog: {
                url: EnvironmentConfig.site.rest.api
                    + '/' + URLS.management.base
                    + '/' + URLS.management.administration.base
                    + '/' + URLS.management.administration.person,
                name: 'Trabajador',
                model: 'id',
                option: 'nombre',
                elements: 'results',
                pagination: {
                    total: PAGINATION.total,
                    limit: PAGINATION.limit,
                    offset: PAGINATION.offset,
                    pageSize: PAGINATION.pageSize
                },
                loadMoreButtonText: 'Cargar mas...',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            required: true
        };

        function clearText() {
            vm.personList = null;
            vm.chip = [];
        }

        function setLimitHours() {
            //limit min hour
            if (vm.horaminPrev) {
                var min = new Date();
                var minPrev = new Date();
                min.setHours(9);
                minPrev.setHours(parseInt(vm.horaminPrev.substring(0, 2)));
                min.setMinutes(0);
                minPrev.setMinutes(parseInt(vm.horaminPrev.substring(3, 5)));
                min.setSeconds(0);
                minPrev.setSeconds(parseInt(vm.horaminPrev.substring(6, 8)));
                if (minPrev > min) {
                    vm.horamin = vm.horaminPrev;
                }
            }

            if (vm.horamaxPrev) {
                var max = new Date();
                var maxPrev = new Date();
                max.setHours(18);
                maxPrev.setHours(parseInt(vm.horamaxPrev.substring(0, 2)));
                max.setMinutes(0);
                maxPrev.setMinutes(parseInt(vm.horamaxPrev.substring(3, 5)));
                max.setSeconds(0);
                maxPrev.setSeconds(parseInt(vm.horamaxPrev.substring(6, 8)));
                if (maxPrev < max) {
                    vm.horamax = vm.horamaxPrev;
                }
            }
        }

        function activate() {
            vm.salePoint = REQUESTS.getRequestByID(vm.id)
                .then(function (requestSuccess) {
                    vm.request = requestSuccess;
                    if (requestSuccess.persona) {
                        Person.getPerson(vm.request.persona.id)
                            .then(function (userSuccess) {
                                vm.assignedPerson = userSuccess;
                                worklist(vm.assignedPerson.id);
                            })
                            .catch(function (personaError) {
                                vm.assignedPerson = null;
                                $log.error(personaError);
                            });
                    } else {
                        preSearchPerson();
                    }
                    vm.storePromise = Stores.getByID(requestSuccess.establecimiento.no_cliente);
                    return vm.storePromise;
                })
                .then(function (storeSuccess) {
                    vm.store = storeSuccess;
                })
                .catch(function (errors) {
                    $log.error('@Controller:detailRequestController\n@Function:activate\n@detail: ' + errors);
                    ErrorHandler.errorTranslate(errors);
                });
        }


        function selectedPersonChange() {
            vm.chip = [];
            vm.salePoint.persona = vm.assignedPerson.id;
            vm.infoChip = null;
            worklist(vm.salePoint.persona);
        }

        function searchPerson() {
            Persona_Admin.list(vm.limit, 0, vm.searchText)
                .then(function (userListSuccess) {
                    userListSuccess = userListSuccess.results;
                    vm.personList = userListSuccess;
                    return searchPersonCollection();
                })
                .catch(function () {
                    vm.personList = null;
                });
        }

        function preSearchPerson() {
            vm.personList = null;
            Persona_Admin.list(0, 0, vm.searchText)
                .then(function (userList) {
                    vm.limit = userList.count;
                    if (vm.limit == 0) {
                        vm.noResults = true;
                    } else {
                        vm.noResults = false;
                        searchPerson();
                    }
                })
                .catch(function () {
                    vm.noResults = true;
                });
        }

        function searchPersonCollection() {
            if (!vm.personSearchText) {
                return vm.personList;
            }
            else {
                return _.filter(vm.personList, function (item) {
                    return item.user.username.toLowerCase().includes(vm.personSearchText.toLowerCase())
                        || item.nombre.toLowerCase().includes(vm.personSearchText.toLowerCase())
                        || item.apellido_paterno.toLowerCase().includes(vm.personSearchText.toLowerCase())
                        || item.apellido_materno.toLowerCase().includes(vm.personSearchText.toLowerCase());

                });
            }
        }

        function onElementSelect(element) {
            vm.chip = [];
            vm.assignedPerson.id = element;
            vm.salePoint.persona = vm.assignedPerson.id;
            vm.infoChip = null;
            worklist(vm.salePoint.persona);
        }

        function assign() {

            if (!prepareObjectSend()) {
                toastr.warning(Translate.translate('SALEPOINT_REQUEST.ASSIGN.MESSAGES.HOUR_ERROR'));
                return;
            }

            vm.personLoading = ATTENTIONS.assignationTechnician(vm.id, vm.toAsigned)
                .then(function () {
                    toastr.success(Translate.translate('SALEPOINT_REQUEST.ASSIGN.MESSAGES.CORRECT_ASSIGNMENT'));
                    $mdDialog.hide();
                })
                .catch(function (error) {
                    ErrorHandler.errorTranslate(error);
                });
        }

        //Prepares the object hours and returns a bool to indicate is the convertion was correct or not
        function prepareObjectSend() {
            var hora1Num = vm.horainicio.getHours();
            var hora2Num = vm.horafin.getHours();
            var min1Num = vm.horainicio.getMinutes();
            var min2Num = vm.horafin.getMinutes();

            if (vm.horainicio > vm.horafin) {
                return false;
            }

            var hora1 = hora1Num < 10 ? '0' + hora1Num.toString() : hora1Num.toString();
            var hora2 = hora2Num < 10 ? '0' + hora2Num.toString() : hora2Num.toString();
            var min1 = min1Num < 10 ? '0' + min1Num.toString() : min1Num.toString();
            var min2 = min2Num < 10 ? '0' + min2Num.toString() : min2Num.toString();

            vm.toAsigned.hora_inicio = hora1 + ':' + min1 + ':00';
            vm.toAsigned.hora_fin = hora2 + ':' + min2 + ':00';
            vm.toAsigned.persona_id = vm.assignedPerson.id;

            return true;
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function view(info) {
            if (!vm.infoChip) {
                vm.infoChip = info;
            } else if (vm.infoChip.folio == info.folio) {
                vm.infoChip = null;
            } else if (vm.infoChip.folio != info.folio) {
                vm.infoChip = info;
            }
        }

        function clean() {
            vm.infoChip = null;
        }

        function worklist(persona) {
            vm.chip = [];
            vm.worklistLoading = SalePoint.assignedTo(persona)
                .then(function (list) {
                    angular.forEach(list.results, function (solicitud) {
                        if (solicitud.status == "En_proceso" || solicitud.status == "Abierta") {
                            var aux = {
                                servicio: solicitud.hora_tecnico_inicio + ' - ' + solicitud.hora_tecnico_fin,
                                folio: solicitud.folio,
                                nombreEstablecimiento: solicitud.solicitud.establecimiento.nombre_establecimiento,
                                direccion: solicitud.solicitud.establecimiento.calle
                            };
                            vm.chip.push(aux);
                        }
                    });

                })
                .catch(function () {
                    ErrorHandler.errorTranslate();
                });
        }

    }

})();
