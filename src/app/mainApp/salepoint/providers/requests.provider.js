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
        PERMISSION,
        User
    ) {
        var requestsUrl = API
            .all(URLS.salepoint.base)
            .all(URLS.salepoint.request.base);

        //Request Kind must be one pf the following
        //open, in-process, closed, cancelled
        //Otherwise, all requests are returned
        //Page parameter is used for pagination,
        //without it, just the first page is provided
        //
        //Proveder determines if all the requests are returned
        //or just the ones the user have created given their permissions
        function listRequests(requestKind, page) {
            var url = requestsUrl.all(URLS.salepoint.request.list);
            var params = {};
            //Adding ordering parameter
            params[QUERIES.ordering] = '-id';
            var canGetAll;
            var canGetJustOwn;
            //Permission retrieving
            if (PERMISSION.hasPermission('sale_point__request__request__get')) {
                canGetAll = true;
            }
            else {
                if (PERMISSION.hasPermission('sale_point__request__requests_own__get')) {
                    canGetJustOwn = true;
                    params[QUERIES.salepoint.by_user] = User.getUser().id;
                }
            }
            if (canGetAll || canGetJustOwn) {
                //Pagination params building
                if (page) {
                    params[PAGINATION.limit] = PAGINATION.pageSize;
                    params[PAGINATION.offset] = PAGINATION.pageSize * (page - 1);
                }
                if (requestKind) {
                    //A request kind has been provided
                    switch (requestKind) {
                        case 'open':
                            params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.open;
                            break;
                        case 'assigned':
                            params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.assigned;
                            break;
                        case 'in-process':
                            params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.in_process;
                            break;
                        case 'closed':
                            params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.closed;
                            break;
                        case 'cancelled':
                            params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.cancelled;
                            break;
                    }
                }
                return url.customGET(null, params);
            }
            else {
                //User does not have the required permissions to retrive attentions
                throw new Error('@REQUESTS provider, @listRequests function: User does not have the required permission for retriving the requests list');
            }
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
