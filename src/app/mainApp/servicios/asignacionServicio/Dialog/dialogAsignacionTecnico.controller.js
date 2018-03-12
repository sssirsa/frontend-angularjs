(function () {
    angular
        .module('app.mainApp.servicios')
        .controller('dialogAsignacionTecnicoController', dialogAsignacionTecnicoController);

    function dialogAsignacionTecnicoController(SalePointRequests, SalePoint, toastr, Translate,
                                         Persona_Admin, $state,salePoint ) {
        var vm = this;

        //Variables
        vm.request = null;
        vm.assignedPerson = null;
        vm.personSearchText = null;
        vm.personList = null;
        vm.store = null;



        //Functions
        vm.selectedPersonChange = selectedPersonChange;
        vm.searchPerson = searchPerson;
        vm.showStoreLocation = showStoreLocation;
        vm.showRequestLocation = showRequestLocation;
        vm.assign = assign;

        console.log(salePoint);

        activate();

        function activate() {
            SalePoint.getByID(salePoint.folio)
                .then(function (salePointp) {
                    vm.salePoint = salePointp;
                    if (salePointp.persona) {
                        vm.personLoading = Persona_Admin.get(salePointp.persona)
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
        }

        function searchPerson() {
            if (!vm.personList) {
                return Persona_Admin.listPromise()
                    .then(function (userListSuccess) {
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
            else{
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
            SalePoint.assignToPerson(vm.assignedPerson.id, vm.salePoint.folio)
                .then(function () {
                    toastr.success(
                        Translate.translate('SALEPOINT_REQUEST.ASSIGN_DETAIL.TOASTR_SUCCESS'),
                        Translate.translate('MAIN.MSG.SUCCESS_TITLE')
                    );
                    $state.go('triangular.admin-default.serviceAssing');
                })
                .catch(function (error) {
                    console.log(error);
                    toastr.error(
                        Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                        Translate.translate('MAIN.MSG.ERROR_TITLE')
                    );
                });
        }

    }

})();
