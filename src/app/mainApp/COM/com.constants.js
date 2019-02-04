(function () {
    angular
        .module('app.mainApp.com')
        .constant('COM', {
            base: 'com_middleware',
            catalogues: {
                base: 'catalogues',
                ticket_type: "ticket_type",
                date_type: "date_type",
                process_instructions:"process_instructions"
            },
            actions: {
                base: "com",
                message: {
                    base: "message",

                }

            }
        });
})();
