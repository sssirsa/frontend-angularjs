(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint')
        .factory('REQUESTS', RequestsProvider);

    function RequestsProvider(
        API,
        URLS,
        PAGINATION,
        QUERIES,
        _
    ) {
        var requestsUrl = API
            .all(URLS.salepoint.base)
            .all(URLS.salepoint.request.base);

        //Request Kind must be one pf the following
        //open, in-process, closed, cancelled
        //Otherwise, all requests are returned
        //Page parameter is used for pagination,
        //without it just first page is provided
        function listRequests(requestKind, page) {
            var url = requestsUrl.all(URLS.salepoint.request.list);
            var params;
            //Pagination params building
            if (page) {
                params = {
                    limit: PAGINATION.pageSize,
                    offset: PAGINATION.pageSize * (page - 1)
                };
                //Adding ordering parameter
                params[QUERIES.ordering] = '-id';
            }
            if (requestKind) {
                //A request kind has been provided
                switch (requestKind) {
                    case 'open':
                        params[QUERIES.salepoint.by_status.base]=QUERIES.salepoint.by_status.open;
                        break;
                    case 'assigned':
                        params[QUERIES.salepoint.by_status.base]=QUERIES.salepoint.by_status.assigned;
                        break;
                    case 'in-process':
                        params[QUERIES.salepoint.by_status.base]=QUERIES.salepoint.by_status.in_process;
                        break;
                    case 'closed':
                        params[QUERIES.salepoint.by_status.base]=QUERIES.salepoint.by_status.closed;
                        break;
                    case 'cancelled':
                        params[QUERIES.salepoint.by_status.base]=QUERIES.salepoint.by_status.cancelled;
                        break;
                }
            }
            return url.customGET(null, params);
        }

        function lllllistRequests(limit, offset, filter) {
            var params = {limit: limit, offset: offset};
            if (angular.isDefined(filter)) {
                params = _.extend(params, filter);
            }
            return requestsUrl
                .customGET(URLS.salepoint.request.list, params);
        }

        function getRequestByID(requestID) {
            return requestsUrl
                .all(URLS.salepoint.request.list)
                .customGET(requestID);
        }

        function create_new_request(requestData) {
            return requestsUrl
                .all(URLS.salepoint.request.new_request)
                .post(requestData);
        }

        function create_incremental_request(requestData) {
            return requestsUrl
                .all(URLS.salepoint.request.incremental_request)
                .post(requestData);
        }

        function create_change_request(requestData) {
            return requestsUrl
                .all(URLS.salepoint.request.change_request)
                .post(requestData);
        }

        function create_retrieve_request(requestData) {
            return requestsUrl
                .all(URLS.salepoint.request.retrieve_request)
                .post(requestData);
        }

        function create_technical_service_request(requestData) {
            return requestsUrl
                .all(URLS.salepoint.request.technical_service_request)
                .post(requestData);
        }

        return {
            getRequestByID: getRequestByID,
            listRequests: listRequests,
            create_new_request: create_new_request,
            create_incremental_request: create_incremental_request,
            create_change_request: create_change_request,
            create_retrieve_request: create_retrieve_request,
            create_technical_service_request: create_technical_service_request
        };
    }

})();
