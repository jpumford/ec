angular-file-upload
===================


**Click here for <a href="http://angular-file-upload.appspot.com/" target="_blank">DEMO</a>**

Lightweight Angular JS directive to upload files. Features:
* File upload for HTML5 and non HTML5 browsers with Flash polyfill. Allows client side validation before uploading the file.
* Sends the file with regular angular $http (with shim for non-HTML5 browsers) so all angular $http features are available.
* Supports upload progress
* Supports cancel/abort upload while in progress
* Supports File drag and drop
* All non-HTML5 code is in a separate shim file so you can easily remove it if you only supports HTML5.
* Flash FileAPI will be loaded on demand so it won't add extra load for HTML5 browsers.
* You can configure $http method to be either POST or PUT for HTML5 browsers.

HTML:
```html
<script src="angular.file-upload-shim.min.js"></script> <!--only needed if you support upload progress/abort or non HTML5 FormData browsers. Most be placed before angular.js-->
<script src="angular.min.js"></script>
<script src="angular-file-upload.min.js"></script> <!--place after angular.js-->

<div ng-controller="MyCtrl">
  <input type="text" ng-model="myModelObj">
  <input type="file" ng-file-select="onFileSelect($files)" >
  <input type="file" ng-file-select="onFileSelect($files)" multiple>
  <div ng-file-drop="onFileSelect($files)" ng-file-drag-over-class="optional-css-class"
        ng-show="dropSupported">drop files here</div>
  <div ng-file-drop-available="dropSupported=true" 
        ng-show="!dropSupported">HTML5 Drop File is not supported!</div>
  <button ng-click="upload.abort()">Cancel Upload</button>
</div>
```

JS:
```js
//inject angular file upload directives and service.
angular.module('myApp', ['angularFileUpload']);

var MyCtrl = [ '$scope', '$upload', function($scope, $upload) {
  $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var $file = $files[i];
      $scope.upload = $upload.upload({
        url: 'server/upload/url', //upload.php script, node.js route, or servlet upload url
        // method: POST or PUT,
        // headers: {'headerKey': 'headerValue'}, withCredential: true,
        data: {myObj: $scope.myModelObj},
        file: $file,
        //fileFormDataName: myFile, //(optional) sets 'Content-Desposition' formData name for file
        progress: function(evt) {
          console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
      })
      //.error(...).then(...); 
    }
  }
}];
```


For the browsers not supporting HTML5 FormData you need [FileAPI](https://github.com/mailru/FileAPI) files **FileAPI.min.js** and **FileAPI.flash.swf** as a polyfill. These files will not be loaded to the client if the browser supports HTML5 FormData (no extra load).
**Note**: Flash needs to be installed on the client browser if it doesn't support HTML5. 

You can put these two files beside angular-file-upload-shim(.min).js on your server to be loaded automatically on demand or use the following script to set the FileAPI load path (optional):
```script
<script>
    //optional
    FileAPI = {
        jsPath: '/js/FileAPI.min.js/folder/',
        staticPath: '/flash/FileAPI.flash.swf/folder/'
    }
</script>
```
This needs to be loaded before angular-file-upload-shim(.min).js (before `<script src="angular-file-upload-shim.min.js"></script>`)

You can find the sample server code in Java/GAE [here](https://github.com/danialfarid/angular-file-upload/blob/master/src/com/df/angularfileupload/FileUpload.java).

If you wish to use CDN to include the script files you can use this CDN: [http//cdn.jsdelivr.net/angular.file-upload/1.0.2/angular-file-upload.js](//cdn.jsdelivr.net/angular.file-upload/1.0.2/angular-file-upload.js) 
If you use this CDN you need to add a crossdomain.xml file to your root server in order for the Adbobe Flash to be able to upload the file for browsers not supporting FormData.

crossdomain.xml (Only needed if you are using CDN instead of having the js/swf files on your server)
```crossdomain.xml
<?xml version="1.0" ?>
<cross-domain-policy>
  <allow-access-from domain="cdn.jsdelivr.net" />
</cross-domain-policy>
```

If you use this module you can give it a thumbs up at [http://ngmodules.org/modules/angular-file-upload](http://ngmodules.org/modules/angular-file-upload).
The module is registered at bower with the name **"angularjs-file-upload"** (notice 'js' after angular): bower install angularjs-file-upload#1.0.2

Let [me](mailto:danial.farid@gmail.com) know if you see any bug or open an [issue](https://github.com/danialfarid/angular-file-upload/issues).



