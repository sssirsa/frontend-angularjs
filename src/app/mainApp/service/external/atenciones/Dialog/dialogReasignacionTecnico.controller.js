(function () {
    angular
        .module('app.mainApp.service')
        .controller('dialogReasignacionTecnicoController', dialogReasignacionTecnicoController);

    function dialogReasignacionTecnicoController(SalePointRequests, SalePoint, toastr, Translate,
                                               Persona_Admin, $state, salePoint, $mdDialog, ErrorHandler) {
        var vm = this;

        //Variables
        vm.chip = [];
        vm.request = null;
        vm.assignedPerson = null;
        vm.personSearchText = null;
        vm.personList = null;
        vm.store = null;
        vm.limit = 100;
        vm.toAsigned = {
            persona: null,
            prioridad: 4,
            hora_inicio: '09:00:00',
            hora_fin: '18:00:00'
        };
        vm.horainicio = null;
        vm.horafin = null;

        vm.horamin = "09:00:00";
        vm.horaminPrev = null;
        vm.horamax = "18:00:00";
        vm.horamaxPrev = null;

        vm.horaminPrev = salePoint.hora_cliente_inicio;
        vm.horamaxPrev = salePoint.hora_cliente_fin;
        setLimitHours();


        //Functions
        vm.selectedPersonChange = selectedPersonChange;
        vm.preSearchPerson = preSearchPerson;
        vm.showStoreLocation = showStoreLocation;
        vm.showRequestLocation = showRequestLocation;
        vm.assign = assign;
        vm.cancel = cancel;
        vm.view = view;
        vm.clean = clean;

        console.log(salePoint.folio);
        vm.id = salePoint.folio;
        activate();

        function activate() {
            vm.personLoading = SalePoint.getByID(salePoint.folio)
                .then(function (salePointp) {
                    vm.salePoint = salePointp;
                    if (salePointp.persona) {
                        Persona_Admin.get(salePointp.persona)
                            .then(function (personaSuccess) {
                                vm.assignedPerson = personaSuccess;
                            })
                            .catch(function (personaError) {
                                vm.assignedPerson = null;
                                console.log(personaError);
                            });
                    }
                    SalePointRequests.getByID(salePoint.solicitud)
                        .then(function (requestSuccess) {
                            vm.request = requestSuccess;
                            vm.storeLoading = SalePoint.getStore(requestSuccess.establecimiento)
                                .then(function (storeSuccess) {
                                    vm.store = storeSuccess;
                                })
                                .catch(function (storeError) {
                                    console.log(storeError);
                                    toastr.error(
                                        Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                                        Translate.translate('MAIN.MSG.ERROR_TITLE')
                                    );
                                });

                        })
                        .catch(function (requestError) {
                            console.log(requestError);
                            vm.salePoint = null;
                            toastr.error(
                                Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                                Translate.translate('MAIN.MSG.ERROR_TITLE')
                            );
                        });
                }).catch(function (salePointError) {
                console.log(salePointError);
                toastr.error(
                    Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                    Translate.translate('MAIN.MSG.ERROR_TITLE')
                );
            });
        }

        function selectedPersonChange() {
            vm.salePoint.persona = vm.assignedPerson.id;
            vm.infoChip = null;
            worklist(vm.salePoint.persona);
        }

        function searchPerson() {
            return Persona_Admin.listPromise(vm.limit,0)
                .then(function (userListSuccess) {
                    userListSuccess = userListSuccess.results;
                    vm.personList = userListSuccess;
                    return searchPersonCollection();
                })
                .catch(function (userListError) {
                    vm.personList = null;
                    console.log(userListError);
                    console.log("Error al obtener personas");
                    toastr.error(
                        Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                        Translate.translate('MAIN.MSG.ERROR_TITLE')
                    );
                });
        }

        function preSearchPerson() {
            if (!vm.personList && !vm.personSearchText) {
                return Persona_Admin.listPromise(0, 0)
                    .then(function (userList) {
                        vm.limit = userList.count;
                        return searchPerson();
                    })
                    .catch(function () {

                    });
            }
            else {
                return searchPersonCollection();
            }
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

        function showStoreLocation() {
            SalePointRequests.locate(vm.store.latitud, vm.store.longitud);
        }

        function showRequestLocation() {
            SalePointRequests.locate(vm.request.latitud, vm.request.longitud);
        }

        function assign() {

            if (prepareObjectSend()) {
                toastr.error(
                    'La hora inicio debe ser menor a la hora fin',
                    Translate.translate('MAIN.MSG.ERROR_TITLE')
                );
                return;
            }

            console.log('asignedPerson: ', vm.toAsigned);

            vm.personLoading = SalePoint.assignToPerson(vm.toAsigned, vm.salePoint.folio)
                .then(function () {
                    toastr.success(
                        Translate.translate('Se reasigno correctamente al tecnico'),
                        Translate.translate('MAIN.MSG.SUCCESS_TITLE')
                    );
                    $mdDialog.hide();
                })
                .catch(function (error) {
                    ErrorHandler.errorTranslate(error);
                    //   console.log(error);
                    //   if(error.status == 500) {
                    //      toastr.error(
                    //          Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                    //         Translate.translate('MAIN.MSG.ERROR_TITLE')
                    //     );
                    //  }
                    // else{
                    //   angular.forEach(error.data.message, function (item) {
                    //     var t = 'ERRORS.' + item;
                    //   toastr.error(
                    //      Translate.translate(t),
                    //     Translate.translate('MAIN.MSG.ERROR_TITLE')
                    //  );
                    //    });
                    //  }

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

            console.log("hora_inicio", hora1, ':', min1, ':00');
            console.log("hora_fin", hora2, ':', min2, ':00');

            vm.toAsigned.hora_inicio = hora1 + ':' + min1 + ':00';
            vm.toAsigned.hora_fin = hora2 + ':' + min2 + ':00';
            vm.toAsigned.persona = vm.assignedPerson.id;

            return false;
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

        function cancel() {
            $mdDialog.cancel();
        }

        function worklist(persona) {
            vm.chip = [];
            vm.worklistLoading = SalePoint.assignedTo(persona)
                .then(function (list) {

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
                .catch(function (listError) {
                    toastr.error(
                        Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                        Translate.translate('MAIN.MSG.ERROR_TITLE')
                    );
                });
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


    }

})();
