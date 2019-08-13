(function () {
    angular
        .module('app.mainApp.salepoint')
        .controller('dialogAsignationTechnicianController', dialogAsignationTechnicianController);

    function dialogAsignationTechnicianController(ATTENTIONS, REQUESTS, $state, $mdDialog, $document, ErrorHandler, $stateParams, attention, Stores,
        Person, Persona_Admin, SalePoint) {
        var vm = this;

        console.log("el controler", attention);
        //Variables
        vm.chip = [];
        vm.request = null;
        vm.assignedPerson = null;
        vm.personSearchText = null;
        vm.personList = null;
        vm.store = null;
        vm.toAsigned = {
            persona: null,
            prioridad: 4,
            horaInicio: '09:00:00',
            horaFin: '18:00:00'
        };
        vm.horainicio = null;
        vm.horafin = null;

        vm.horamin = '09:00:00';
        vm.horaminPrev = null;
        vm.horamax = '18:00:00';
        vm.horamaxPrev = null;

        vm.horaminPrev = attention.hora_cliente_inicio;
        vm.horamaxPrev = attention.hora_cliente_fin;
        vm.id = attention.folio;

        vm.limit = 0;

        //Functions
        vm.selectedPersonChange = selectedPersonChange;
        vm.searchPerson = searchPerson;
        vm.assign = assign;
        vm.cancel = cancel;
        vm.view = view;
        vm.clean = clean;

        setLimitHours();
        activate();

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
                                console.log(vm.assignedPerson);
                            })
                            .catch(function (personaError) {
                                vm.assignedPerson = null;
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

        function preSearchPerson() {
            console.log("entre");
            Persona_Admin.listPromise(0,0)
                .then(function (userList) {
                    vm.limit = userList.count;
                    console.log(vm.limit);
                    searchPerson();
                })
                .catch(function () {

                });
        }

        function selectedPersonChange() {
            vm.salePoint.persona = vm.assignedPerson.id;
            vm.infoChip = null;
            worklist(vm.salePoint.persona);
        }

        function searchPerson() {
            if(vm.limit !== 0){
                if (!vm.personList) {
                    return Persona_Admin.listPromise(vm.limit,0)
                        .then(function (userListSuccess) {
                            userListSuccess = userListSuccess.results;
                            vm.personList = userListSuccess;
                            return searchPersonCollection();
                        })
                        .catch(function (userListError) {
                            vm.personList = null;
                            $log.error(userListError);
                        });
                } else {
                    return searchPersonCollection();
                }
            }
        }

        function searchPersonCollection() {
            if (!vm.personSearchText) {
                return vm.personList;
            } else {
                return _.filter(vm.personList, function (item) {
                    return item.user.username.toLowerCase().includes(vm.personSearchText.toLowerCase())
                        || item.nombre.toLowerCase().includes(vm.personSearchText.toLowerCase())
                        || item.apellido_paterno.toLowerCase().includes(vm.personSearchText.toLowerCase())
                        || item.apellido_materno.toLowerCase().includes(vm.personSearchText.toLowerCase());

                });
            }
        }

        function assign() {

            if (prepareObjectSend()) {
                ErrorHandler.error();
                return;
            }



            vm.personLoading = ATTENTIONS.assignationTechnician(vm.toAsigned, vm.id)
                .then(function () {
                    ErrorHandler.success();
                    $mdDialog.hide();
                    $state.go('triangular.admin-default.serviceAssing');
                })
                .catch(function (error) {
                    ErrorHandler.errorTranslate(error);
                });
        }

        function prepareObjectSend() {
            var hora1Num = vm.horainicio.getHours();
            var hora2Num = vm.horafin.getHours();
            var min1Num = vm.horainicio.getMinutes();
            var min2Num = vm.horafin.getMinutes();

            if (vm.horainicio >= vm.horafin) {
                return true;
            }

            var hora1 = hora1Num < 10 ? '0' + hora1Num.toString() : hora1Num.toString();
            var hora2 = hora2Num < 10 ? '0' + hora2Num.toString() : hora2Num.toString();
            var min1 = min1Num < 10 ? '0' + min1Num.toString() : min1Num.toString();
            var min2 = min2Num < 10 ? '0' + min2Num.toString() : min2Num.toString();

            vm.toAsigned.horaInicio = hora1 + ':' + min1 + ':00';
            vm.toAsigned.horaFin = hora2 + ':' + min2 + ':00';
            vm.toAsigned.persona = vm.assignedPerson.id;

            return false;
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function view(info) {
            if(!vm.infoChip){
                vm.infoChip = info;
            }else if(vm.infoChip.folio == info.folio){
                vm.infoChip = null;
            }else if(vm.infoChip.folio != info.folio){
                vm.infoChip = info;
            }
        }

        function clean() {
            vm.infoChip = null;
        }

        function worklist(persona) {
            console.log("worklist");
            vm.chip = [];
            vm.worklistLoading = SalePoint.assignedTo(persona)
                .then(function (list) {
                    console.log("listatrabajo", list);

                    angular.forEach(list.results, function (solicitud) {
                        var aux = {
                            servicio: solicitud.hora_tecnico_inicio + ' - ' + solicitud.hora_tecnico_fin,
                            folio: solicitud.folio,
                            nombreEstablecimiento: solicitud.establecimiento.nombre_establecimiento,
                            direccion: solicitud.establecimiento.calle
                        };
                        vm.chip.push(aux);
                    });

                })
                .catch(function () {
                    console.log("nada");
                    ErrorHandler.error();
                });
        }

    }

})();
