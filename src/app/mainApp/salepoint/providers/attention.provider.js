(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint')
        .factory('ATTENTIONS', attentionProvider);

    function attentionProvider(
        API,
        URLS,
        _
    ) {
        var AttentionBaseURL = API
            .all(URLS.salepoint.base)
            .all(URLS.salepoint.attention.base);

        function listAttentions(limint, offset, filter) {
            var params = {limit: limint, offset: offset};
            if (angular.isDefined(filter)) {
                params = _.extend(params, filter);
            }
            return AttentionBaseURL
                .customGET(URLS.salepoint.attention.all, params);
        }

        function getAttention(attentionID) {
            return AttentionBaseURL
                .all(URLS.salepoint.attention.all)
                .customGET(attentionID);
        }

        function createRegisterAttention(attentionData) {
            return AttentionBaseURL
                .all(URLS.salepoint.attention.register_attention)
                .post(attentionData);
        }

        function createChangeAttention(attentionData) {
            return AttentionBaseURL
                .all(URLS.salepoint.attention.change_attention)
                .post(attentionData);
        }

        function createRetrieveAttention(attentionData) {
            return AttentionBaseURL
                .all(URLS.salepoint.attention.retrieve_attention)
                .post(attentionData);
        }

        function createTechnicalServiceAttention(attentionData) {
            return AttentionBaseURL
                .all(URLS.salepoint.attention.technical_service_attention)
                .post(attentionData);
        }
        
        function assignationTechnician(serviceID, technicianData) {
            return AttentionBaseURL
                .all(URLS.salepoint.attention.assignation)
                .all(serviceID)
                .customPUT(technicianData);
        }

        return {
            listAttentions: listAttentions,
            getAttention: getAttention,
            createRegisterAttention: createRegisterAttention,
            createChangeAttention: createChangeAttention,
            createRetrieveAttention: createRetrieveAttention,
            createTechnicalServiceAttention: createTechnicalServiceAttention,
            assignationTechnician: assignationTechnician
        };

    }
})();
