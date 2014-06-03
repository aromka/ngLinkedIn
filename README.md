ngLinkedIn
==========

LinkedIn wrapper for AngularJS.

See official [LinkedIn API](https://developer.linkedin.com/documents/javascript-api-reference-0) for more info and options.

## Usage ##

Install via bower:
> bower install ngLinkedIn --save

Include ngLinkedIn module:

```
angular.module('app', ['ngLinkedIn']);
```

Set app key through config provider:

```
.config(function($linkedInProvider) {
   $linkedInProvider.set('appKey', '123456789');
});
```

Use in controller:

```
.controller(['$scope', '$linkedIn', function($scope, $linkedIn) {
  $scope.connect = function() {
      $linkedIn.authorize();
  }
}]);
```

## Additional options ##

The following options are supported through config:

Property      | Type          | Default
------------- | ------------- | -------------
appKey        | String        | null
authorize     | Boolean       | false
lang          | String        | 'en_US'
scope         | String        | 'r_basicprofile'


You can also chain the config setting during setup like this:

```
$linkedInProvider
    .set('appKey', '123456789')
    .set('scope', 'r_basicprofile r_network')
    .set('authorize', true);
```

## Common issues ##
```
Uncaught Error: You must specify a valid JavaScript API Domain as part of this key's configuration.
```
You need to set API Domains in your app. It is located in ```JavaScript API Domains:``` in the ```Other``` section in your app.

## Available API methods ##

Most of the API functions are supported:

### $linkedIn.isAuthorized() ###
IN.User.isAuthorized() - Checks if user is already authorized and returns true or false.

### $linkedIn.authorize() ###
IN.User.authorize() - Opens auth popup for user authorization.

### $linkedIn.refresh() ###
IN.User.refresh() - Extend token life by 30 minutes.

### $linkedIn.logout() ###
IN.User.logout() - End user session.

### $linkedIn.share(url) ###
IN.UI.Share() - Share specified URL.

### $linkedIn.api(api, ids, field, params) ###
General api method that is used by shortcut methods:

* $linkedIn.profile(ids, field, params)         // get user(s) profile(s).
* $linkedIn.connections(ids, field, params)     // get connections. requires 'r_network' and 'rw_nus' permissions.
* $linkedIn.memberUpdates(ids, field, params)   // get updates. requires 'rw_nus' permission.

All 3 params (ids, field, params) are optional. If `ids` is not provided, 'me' is used by default to get info about current user.

For more information about fields and params refer to [API Documentation](http://developer.linkedin.com/documents/making-api-requests-using-inapi).
