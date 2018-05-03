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
            error: error
        };

        var successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
        var errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        var unexpectederror = Translate.translate('ERRORS.UNEXPECTED');
        var errorsession = Translate.translate('ERRORS.SESSION_EXPIRED');
        var translatemsg = '';

        function succcesCreation() {
            translatemsg = Translate.translate('SUCCESS.CREATE');
            toastr.success(translatemsg, successTitle);
        }

        function succcesUpdate() {
            translatemsg = Translate.translate('SUCCESS.UPDATE');
            toastr.success(translatemsg, successTitle);
        }

        function succcesDelete() {
            translatemsg = Translate.translate('SUCCESS.DELETE');
            toastr.success(translatemsg, successTitle);
        }

        function succcesUpload() {
            translatemsg = Translate.translate('SUCCESS.UPLOAD');
            toastr.success(translatemsg, successTitle);
        }

        function succcesCancel() {
            translatemsg = Translate.translate('SUCCESS.CANCEL');
            toastr.success(translatemsg, successTitle);
        }

        function error(response) {
            if (response) {
                console.log(response);
                switch (response.status) {
                    case -1:
                        toastr.warning(unexpectederror, errorTitle);
                        break;
                    //BAD REQUEST
                    case 400:
                        if (response.data) {
                            if (response.data.message[0]){
                                translatemsg = Translate.translate(response.data.message[0]);
                                toastr.warn(translatemsg, errorTitle);

                            }
                            else{
                                angular.forEach(response.data, function(value, key) {
                                    var tmp =key + ': ' + value;
                                    toastr.warn(tmp, errorTitle);
                                });
                            }
                        }
                        else{
                            toastr.warning(unexpectederror, errorTitle);
                        }
                        break;
                    //UNAUTHORIZED
                    case 401:
                        toastr.warning(errorsession, errorTitle);
                        break;
                    case 404:
                        toastr.warning('La página solicitada no existe.', errorTitle);
                        break;
                    default:
                        toastr.warning(unexpectederror, errorTitle);
                        break;

                }
            }
        }


    }
})
();
