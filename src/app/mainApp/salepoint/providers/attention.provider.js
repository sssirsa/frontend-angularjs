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
                .customGET(URLS.salepoint.attention.list, params);
        }

        function getAttention(attentionID) {
            return AttentionBaseURL
                .customGET(URLS.salepoint.attention.list + '/' + attentionID);
        }

        function performRegisterAttention(attentionId, attentionData) {
            return AttentionBaseURL
                .all(URLS.salepoint.attention.register_attention)
                .all(attentionId)
                .patch(attentionData);
        }

        function performChangeAttention(attentionId, attentionData) {
            return AttentionBaseURL
                .all(URLS.salepoint.attention.change_attention)
                .all(attentionId)
                .patch(attentionData);
        }

        function performRetrieveAttention(aattentionId, attentionData) {
            return AttentionBaseURL
                .all(URLS.salepoint.attention.retrieve_attention)
                .all(attentionId)
                .patch(attentionData);
        }

        function performTechnicalServiceAttention(attentionId, attentionData) {
            return AttentionBaseURL
                .all(URLS.salepoint.attention.technical_service_attention)
                .all(attentionId)
                .patch(attentionData);
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
            performRegisterAttention: performRegisterAttention,
            performChangeAttention: performChangeAttention,
            performRetrieveAttention: performRetrieveAttention,
            performTechnicalServiceAttention: performTechnicalServiceAttention,
            assignationTechnician: assignationTechnician
        };

    }
})();
