(function () {
    angular
        .module('app.mainApp.salepoint')
        .controller('detalleAsignacionController', detalleAsignacionController);

    function detalleAsignacionController(
        SalePointRequests,
        SalePoint,
        $stateParams,
        toastr,
        Translate,
        Persona_Admin,
        $mdDialog,
        $log,
        _,
        $document
    ) {
        var vm = this;

        //Variables
        vm.salePoint = null;
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

        activate();

        function activate() {
            SalePoint.getByID($stateParams.id)
                .then(function (salePoint) {

                    vm.salePoint = salePoint;
                    if (salePoint.persona) {
                        vm.personLoading = Persona_Admin.get(salePoint.persona)
                            .then(function (personaSuccess) {
                                vm.assignedPerson = personaSuccess;
                            })
                            .catch(function (personaError) {
                                vm.assignedPerson = null;
                                $log.error(personaError);
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
                                    $log.error(storeError);
                                    toastr.error(
                                        Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                                        Translate.translate('MAIN.MSG.ERROR_TITLE')
                                    );
                                });

                        })
                        .catch(function (requestError) {
                            $log.error(requestError);
                            vm.salePoint = null;
                            toastr.error(
                                Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                                Translate.translate('MAIN.MSG.ERROR_TITLE')
                            );
                        });
                }).catch(function (salePointError) {
                    $log.error(salePointError);
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
                        $log.error(userListError);

                        toastr.error(
                            Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                            Translate.translate('MAIN.MSG.ERROR_TITLE')
                        );
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
            // SalePoint.assignToPerson(vm.assignedPerson.id, vm.salePoint.folio)
            //     .then(function () {
            //         toastr.success(
            //             Translate.translate('SALEPOINT_REQUEST.ASSIGN_DETAIL.TOASTR_SUCCESS'),
            //             Translate.translate('MAIN.MSG.SUCCESS_TITLE')
            //         );
            //         $state.go('triangular.admin-default.serviceAssing');
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //         toastr.error(
            //             Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
            //             Translate.translate('MAIN.MSG.ERROR_TITLE')
            //         );
            //     });


            $mdDialog.show({
                controller: 'dialogAsignacionTecnicoController',
                templateUrl: 'app.mainApp.salepoint/external/asignacionServicio/Dialog/dialogAsignacionTecnico.tmpl.html',
                parent: angular.element($document.body),
                controllerAs: 'vm',
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    salePoint: vm.salePoint
                }
            })
                .then(function () {
                    $mdDialog.hide();
                });
        }

    }

})();
