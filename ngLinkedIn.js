/**
 * Angular LinkedIn Service
 *
 * For more info see official API Documentation:
 * https://developer.linkedin.com/documents/javascript-api-reference-0
 *
 * @author  Roman Alexeev <roman@boket.to>
 * @date    April 21, 2014
 * @version 0.1.2
 * @license MIT
 */
'use strict';

angular.module('ngLinkedIn', [])
    .provider('$linkedIn', function() {
        var config = {
            appKey: null,
            authorize: false,
            lang: 'en_US',
            scope: 'r_basicprofile',
            credentials_cookie: false
        };

        this.set = function(property, value) {
            if (!config.hasOwnProperty(property)) {
                throw 'Config does not support property: ' + property;
            }
            config[property] = value;
            return this;
        };

        this.get = function(property) {
            if (!config.hasOwnProperty(property)) {
                throw 'Config does not support property: ' + property;
            }
            return config[property];
        };

        this.$get = ['$rootScope', '$q', '$window', function($rootScope, $q, $window) {
            var $linkedIn = $q.defer();

            $rootScope.$on("in.load", function(e, IN) {
                $linkedIn.resolve(IN);

                var events = ['auth', 'logout'];
                angular.forEach(events, function(event) {
                    IN.Event.on(IN, event, function(response) {
                        $rootScope.$broadcast("in." + event, response);
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                    });
                });
            });

            $linkedIn.config = function(property) {
                return config[property];
            };

            // init
            $linkedIn.init = function() {
                if (!$linkedIn.config('appKey')) {
                    throw '$linkedInProvider: appKey is not set';
                }

                $window.inAsyncLoad = function() {
                    $rootScope.$broadcast("in.load", $window.IN);
                };
                $window.IN.ENV.js.suppressWarnings = true;
                $window.IN.init(angular.extend({
                    api_key: $linkedIn.config('appKey'),
                    onLoad: 'inAsyncLoad'
                }, config));
            };

            // check auth
            $linkedIn.isAuthorized = function() {
                return $linkedIn.promise.then(function(IN) {
                    return IN.User.isAuthorized();
                });
            };

            // authorize
            $linkedIn.authorize = function() {
                var defer = $q.defer();
                return $linkedIn.promise.then(function(IN) {
                    IN.User.authorize(function() {
                        defer.resolve();
                    });
                    return defer.promise;
                });
            };

            // refresh token
            $linkedIn.refresh = function() {
                IN.User.refresh();
            };

            // logout
            $linkedIn.logout = function() {
                var defer = $q.defer();
                return $linkedIn.promise.then(function(IN) {
                    IN.User.logout(function() {
                        defer.resolve();
                    });
                    return defer.promise;
                });
            };

            // share
            $linkedIn.share = function(url) {
                if (!url) {
                    throw 'Url is not specified';
                }
                IN.UI.Share()
                    .params({ url: url })
                    .place();
            };

            // general api request
            $linkedIn.api = function(api, ids, fields, params) {
                var defer = $q.defer();
                return $linkedIn.promise.then(function(IN) {
                    IN.API[api](ids.toString() || 'me')
                        .fields(fields || null)
                        .params(params || {})
                        .result(function(response) {
                            defer.resolve(response);
                        });
                    return defer.promise;
                });
            };

            // api shortcut methods
            // profile
            $linkedIn.profile = function(ids, fields, params) {
                return $linkedIn.api('Profile', ids, fields, params);
            };

            // connections
            // requires 'r_network' and 'rw_nus' permissions
            $linkedIn.connections = function(ids, fields, params) {
                return $linkedIn.api('Connections', ids, fields, params);
            };

            // member updates
            // requires 'rw_nus' permission
            $linkedIn.memberUpdates = function(ids, fields, params) {
                return $linkedIn.api('MemberUpdates', ids, fields, params);
            };

            return $linkedIn;
        }];
    })
    .run(['$rootScope', '$linkedIn', function($rootScope, $linkedIn) {
        if (!window.IN) {
            $.getScript("//platform.linkedin.com/in.js?async=true", function () {
                $linkedIn.init();
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            });
        }
    }]);
