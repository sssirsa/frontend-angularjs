(function () {
    angular
        .module('app.mainApp.management.users')
        .controller('userCreateController', UserCreateController);
    function UserCreateController(
        USERS,
        ErrorHandler,
        $window,
        toastr,
        Translate
    ) {
        var vm = this;

        //Globals
        vm.changingPhoto;
        vm.changingId;
        vm.editableUser;
        vm.newPassword;

        //Constructors
        var user = function () {
            var vm = this;

            vm.nombre = '';
            vm.apellido_paterno = '';
            vm.apellido_materno = '';
            vm.direccion = '';
            vm.telefono = '';
            vm.foto = null;
            vm.ife = null;
            vm.user = {
                username: '',
                email: ''
            };
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
            vm.newPassword = '';
            vm.editableUser = new user();
        }
        init();

        vm.createPerson = function createPerson() {
            vm.savePromise = USERS.createPerson(
                vm.editableUser
            )
                .then(function successCreateUser() {
                    toastr.success(Translate.translate(
                        'USERS.CREATE.MESSAGES.SUCCESS_CREATE'
                    ));
                    init();
                })
                .catch(function errorCreateUser(error) {
                    ErrorHandler.errorTranslate(error);
                });
        };
        vm.selectPicture = function selectPicture(files, model) {
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
