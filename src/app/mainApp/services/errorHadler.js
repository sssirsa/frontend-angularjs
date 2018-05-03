(function () {
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('ErrorHandler', ErrorHandler);

    function ErrorHandler(toastr, Translate) {
        return {
            succcesCreation: succcesCreation,
            succcesUpdate: succcesUpdate,
            succcesDelete: succcesDelete,
            succcesUpload: succcesUpload,
            succcesCancel: succcesCancel,
            errortranslate: errortranslate
        };




        function succcesCreation() {
            var successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            var translatemsg = Translate.translate('SUCCESS.CREATE');
            toastr.success(translatemsg, successTitle);
        }

        function succcesUpdate() {
            var successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            var translatemsg = Translate.translate('SUCCESS.UPDATE');
            toastr.success(translatemsg, successTitle);
        }

        function succcesDelete() {
            var successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            var translatemsg = Translate.translate('SUCCESS.DELETE');
            toastr.success(translatemsg, successTitle);
        }

        function succcesUpload() {
            var successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            var translatemsg = Translate.translate('SUCCESS.UPLOAD');
            toastr.success(translatemsg, successTitle);
        }

        function succcesCancel() {
            var successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
            var translatemsg = Translate.translate('SUCCESS.CANCEL');
            toastr.success(translatemsg, successTitle);
        }

        function errortranslate(response) {
            var errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
            var unexpectederror = Translate.translate('ERRORS.UNEXPECTED');
            var errorsession = Translate.translate('ERRORS.SESSION_EXPIRED');
            var translatemsg = '';
            console.log(response);
            console.log('errorHandler')
            if (response) {
                console.log(response);
                switch (response.status) {
                    case -1:
                        toastr.warning(unexpectederror, errorTitle);
                        break;
                    //BAD REQUEST
                    case 400:
                        if (response.data) {
                            if (response.data.message){
                                console.log('error bad request',);
                                var temporal="ERRORS."+response.data.message[0];
                                console.log(temporal);
                                translatemsg = Translate.translate(temporal);
                                console.log(translatemsg);
                                toastr.error(translatemsg, errorTitle);

                            }
                            else{
                                angular.forEach(response.data, function(value, key) {
                                    console.log(value)
                                    console.log(key)
                                    var tmp =key + ': ' + value;
                                    toastr.error(tmp, errorTitle);
                                });
                            }
                        }
                        else{
                            toastr.error(unexpectederror, errorTitle);
                        }
                        break;
                    //UNAUTHORIZED
                    case 401:
                        toastr.error(errorsession, errorTitle);
                        break;
                    case 404:
                        toastr.error('El recurso solicitado no existe.', errorTitle);
                        break;
                    case 500:
                        console.log(unexpectederror)
                        toastr.error(unexpectederror, errorTitle);
                        break;
                    default:
                        toastr.error(unexpectederror, errorTitle);
                        break;

                }
            }
        }


    }
})
();
