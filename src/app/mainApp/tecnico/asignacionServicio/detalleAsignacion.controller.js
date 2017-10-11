(function () {
    angular
        .module('app.mainApp.tecnico')
        .controller('detalleAsignacionController', detalleAsignacionController);

    function detalleAsignacionController(SalePointRequests, SalePoint, $stateParams, toastr, Translate, Persona_Admin,
                                         Persona, $state) {
        var vm = this;
        //Variables
        vm.salePoint = null;
        vm.request = null;
        vm.profile = null;
        vm.assignedPerson = null;
        vm.personSearchText = null;
        vm.personList = null;
        vm.store = null;
        //Functions
        vm.loadUsers = loadUsers;
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
                    if(salePoint.persona) {
                        vm.personLoading = Persona_Admin.get(salePoint.persona)
                            .then(function(personaSuccess){
                                vm.assignedPerson=personaSuccess;
                                console.log(personaSuccess);
                            })
                            .catch(function(personaError){
                                vm.assignedPerson=null;
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
                });
            Persona.listProfile()
                .then(function (profileSuccess) {
                    vm.profile = profileSuccess;
                })
                .catch(function (profileError) {
                    console.log(profileError);
                    vm.profile = null;
                    toastr.error(
                        Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                        Translate.translate('MAIN.MSG.ERROR_TITLE')
                    );
                });
        }

        function loadUsers() {
            return Persona_Admin.listPromise()
                .then(function (userListSuccess) {
                    vm.personList = userListSuccess;
                    return userListSuccess;
                })
                .catch(function (userListError) {
                    console.log(userListError);
                    toastr.error(
                        Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                        Translate.translate('MAIN.MSG.ERROR_TITLE')
                    );
                });
        }

        function selectedPersonChange(user) {
            vm.salePoint.persona = user;
        }

        function searchPerson() {
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
            SalePoint.assignedTo(vm.assignedPerson.id)
                .then(function () {
                    toastr.success(
                        Translate.translate('MAIN.MSG.SUCCESS_MESSAGE'),
                        Translate.translate('SALEPOINT_REQUEST.ASSIGN_DETAIL.TOASTR_SUCCESS')
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
