/**
 * Created by Antonin on 31/03/2015.
 */

angular.module('gabbler.server.service', [


])


.factory('ServerLink', function()
    {

        var service = {};
        var urlBase;

        service.GetBaseUrlFromServer = function()
        {
            urlBase = "http://localhost:8082/gabbler/api";
            return urlBase;
        };

        service.GetUrlEndpoint = function()
        {
            var urlEndpoint =
            {
                loginUrl: "api/login"
            };
            return urlEndpoint;
        };

        return service;
    });

