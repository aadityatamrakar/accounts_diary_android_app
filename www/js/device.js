angular.module('ngCordova.plugins.device', [])
  .factory('$cordovaDevice', [function () {
    return {
      getDevice: function () {
        return device;
      },
      getCordova: function () {
        return device.cordova;
      },
      getModel: function () {
        return device.model;
      },
      getName: function () {
        return device.name;
      },
      getPlatform: function () {
        return device.platform;
      },
      getUUID: function () {
        return device.uuid;
      },
      getVersion: function () {
        return device.version;
      },
      getManufacturer: function () {
        return device.manufacturer;
      }
    };
  }]);
