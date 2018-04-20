(function () {
    angular
        .module('app.mainApp')
        .component('fileUploader', {
            templateUrl: 'app/mainApp/components/fileUploader/fileUploader.tmpl.html',
            controller: fileUploaderController,
            bindings: {
                fileFormats: '<', //image/*, audio/*, video/*, application/pdf
                capture: '<', //camera
                validations: '<', //size: {max: '20MB', min: '10B'}, height: {max: 12000}, width: {max: 12000}, duration: {max: '5m'}}
                resize: '<', //{width: 1000, height: 1000, centerCrop: true}
                resizeIf: '<', //$width > 5000 || $height > 5000
                maxDimensions: '<', //Max dimensions for images
                maxDuration: '<', //Max duration for videos
                multipleFiles: '<', //Allow multiple files
                allowFolders: '<', //Allow directory uploading
                maxFiles: '<', //Max number of files allowed
                keep:'<' //true, false or distinct
            }
        });

    /* @ngInject */
    function fileUploaderController($scope, Upload, $timeout) {
        var vm = this;

        vm.selectFiles = selectFiles;
        vm.dropFiles = dropFiles;
        vm.removeFile=removeFile;

        vm.files = [];

        function selectFiles(files) {
            console.log(files);
            vm.files = files;
        }

        function dropFiles(files){
            console.log(files);
            vm.files = files;
        }

        function removeFile(){

        }

    }

})();
