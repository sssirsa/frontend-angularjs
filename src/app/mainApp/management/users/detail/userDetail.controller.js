(function () {
    angular
        .module('app.mainApp.management.users')
        .controller('userDetailController', UserDetailController);
    function UserDetailController(
        $stateParams,
        USERS,
        ErrorHandler,
        $window
    ) {
        var vm = this;

        //Globals
        vm.user;
        vm.modifying;
        vm.changingPhoto;
        vm.changingId;
        vm.editableUser;

        //Constructors
        var user = function (data) {
            var vm = this;
            if (data) {
                vm.nombre = data['nombre'];
                vm.apellido_paterno = data['apellido_paterno'];
                vm.apellido_materno = data['apellido_materno'];
                vm.direccion = data['direccion'];
                vm.telefono = data['telefono'];
            }
            else {
                vm.nombre = '';
                vm.apellido_paterno = '';
                vm.apellido_materno = '';
                vm.direccion = '';
                vm.telefono = '';
            }
        };

        //Validations and constraints
        vm.imageConstraints = {
            validations: {
                size: {
                    max: '5MB',
                    min: '10B',
                    height: { max: 4096, min: 100 },
                    width: { max: 4096, min: 100 }
                }
            },
            resize: { width: 4096 },
            resizeIf: '$width > 4096 || $height > 4096'
        };

        function init() {
            vm.modifying = false;
            vm.changingPhoto = false;
            vm.changingId = false;
            //Getting the user 
            vm.userPromise = USERS.getUserDetail($stateParams.personId)
                .then(function userSuccess(user) {
                    vm.user = user;
                })
                .catch(function userError(error) {
                    ErrorHandler.errorTranslate(error);
                });
        }
        init();

        vm.modifyButtonPressed = function modifyButtonPressed() {
            vm.modifying = true;
            vm.editableUser = new user(vm.user);
        };

        vm.modifyPerson = function modifyPerson() {
            vm.savePromise = USERS.modifyPerson(
                vm.user['id'],
                vm.editableUser
            )
                .then(function successModifyUser() {
                    init();
                })
                .catch(function errorModifyUser(error) {
                    ErrorHandler.errorTranslate(error);
                });
        };

        vm.discardChanges = function discardChanges() {
            vm.modifying = false;
            vm.editableUser = new user();
        };

        vm.pictureClick = function pictureClick(url) {
            $window.open(url, '_blank');
        };

        vm.changePhotoButtonPressed = function changePhotoButtonPressed() {
            vm.changingPhoto = true;
        };

        vm.changeIdButtonPressed = function changeIdButtonPressed() {
            vm.changingId = true;
        };

        vm.changePhotoCancelPressed = function changePhotoButtonPressed() {
            vm.changingPhoto = false;
            delete (vm.editableUser['foto']);
        };

        vm.changeIdCancelPressed = function changeIdButtonPressed() {
            vm.changingId = false;
            delete (vm.editableUser['ife']);
        };

        vm.selectPicture = function selectPictue(files, model) {
            if (files.length > 0) {
                var file = files[0];
                //Image processing as a base64 string
                var base64Image = null;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onloadend = function () {
                    base64Image = fileReader.result;
                    vm.editableUser[model] = base64Image;
                };

            }
            else {
                delete (vm.editableUser[model]);
            }
        };

    }
})();
