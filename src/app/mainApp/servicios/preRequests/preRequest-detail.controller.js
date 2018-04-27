(function(){
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('preRequestDetailController',preRequestDetailController);
    function preRequestDetailController(preRequests, $stateParams) {

        var vm = this;
        //Listado de Variables

        vm.preRequest={};

        //Listado de funciones
        vm.images = [
            {
                id : 1,
                url : 'https://sssirsa-mobile-dev-documents.s3.amazonaws.com:443/evidencia/f2cb858e-464.jpg?Signature=XvG2l3OGqh9zdo4YregFg%2BSp3NI%3D&Expires=1524856670&AWSAccessKeyId=AKIAIITVBJH7HAF5W5XA',
                deletable : true,
            },
            {
                id : 2,
                thumbUrl : 'https://pixabay.com/static/uploads/photo/2016/04/11/18/53/aviator-1322701__340.jpg',
                url : 'https://pixabay.com/static/uploads/photo/2016/04/11/18/53/aviator-1322701_960_720.jpg'
            }
        ];

        vm.getinfo=getinfo;
        vm.photos=[];
        getinfo();

        function getinfo() {
            var promiseGetInfoPreRequest=preRequests.getByID($stateParams.idPreRequest);
            promiseGetInfoPreRequest.then(function(elementPreRequest){
                vm.preRequest=elementPreRequest;

                console.log(vm.preRequest);
                conditioninGallery();
            }).catch(function (errCarga) {
                console.log(errCarga);

            });

        }

        //vm.photos=vm.preRequest.fotos;
        function conditioninGallery(){
            vm.preRequest.fotos.forEach(function (foto, index) {
                var fototmp={
                    id:index+1,
                    url:foto.foto
                };
                vm.photos.push(fototmp);
            });
            console.log(vm.photos);
        }




    }
})();
