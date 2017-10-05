(function () {
    angular
        .module('app.mainApp.tecnico')
        .controller('detalleAsignacionController', detalleAsignacionController);

    function detalleAsignacionController(SalePointRequests, SalePoint, $stateParams, toastr, Translate, Persona_Admin,
                                         Persona) {
        var vm = this;
        //Variables
        vm.salePoint = null;
        vm.request = null;
        vm.profile = null;
        vm.assignedPerson = null;
        vm.personSearchText = null;
        vm.personList = null;
        //Functions
        vm.loadUsers = loadUsers;
        vm.selectedPersonChange = selectedPersonChange;
        vm.searchPerson = searchPerson;

        activate();

        function activate() {
            SalePoint.getByID($stateParams.id)
                .then(function (salePointSuccess) {
                    vm.salePoint = salePointSuccess;
                    SalePointRequests.getBiID(vm.salepoint.solicitud)
                        .then(function (requestSuccess) {
                            vm.request = requestSuccess;
                        })
                        .catch(function (requestError) {
                            console.log(requestError);
                            vm.request = null;
                            toastr.error(
                                Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                                Translate.translate('MAIN.MSG.ERROR_TITLE')
                            );
                        });
                })
                .catch(function (salePointError) {
                    console.log(salePointError);
                    vm.salePoint = null;
                    toastr.error(
                        Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                        Translate.translate('MAIN.MSG.ERROR_TITLE')
                    );
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
            vm.assignedPerson = user;
        }

        function searchPerson() {
            if(!vm.personSearchText){
                return vm.personList;
            }
            else{
                return _.filter(vm.personList, function (item){
                    return item.user.username.toLowerCase().includes(vm.personSearchText.toLowerCase())
                    || item.nombre.toLowerCase().includes(vm.personSearchText.toLowerCase())
                    || item.apellido_paterno.toLowerCase().includes(vm.personSearchText.toLowerCase())
                    || item.apellido_materno.toLowerCase().includes(vm.personSearchText.toLowerCase());

                });
            }
        }

    }

})();
