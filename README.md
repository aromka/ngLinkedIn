ngLinkedIn
==========

LinkedIn wrapper for AngularJS.

See official [LinkedIn API](https://developer.linkedin.com/documents/javascript-api-reference-0) for more info and options.

## Usage ##

Include ngLinkedIn module:

```
angular.module('app', ['ngLinkedIn']);
```

Set app key through config provider:

```
.config(function($linkedInProvider) {
   $linkedInProvider.set('appKey', '77fqv2gnm90k3e');
});
```

Use in controller:

```
angular.module('app').controller(['$scope', '$linkedIn', function($scope, $linkedIn) {
  $scope.connect = function() {
      $linkedIn.authorize();
  }
}]);
```

## Additional options ##

The following options are supported through config:

* appKey (string, default: null)
* onLoad (default: null)
* authorize (bool, default: false)
* lang: (string, default: 'en_US')
* scope: (string, default: 'r_basicprofile')

You can also chain the config setting during setup:

```
$linkedInProvider
    .set('appKey', '77fqv2gnm90k3e')
    .set('scope', 'r_basicprofile r_network')
    .set('authorize', true);
```