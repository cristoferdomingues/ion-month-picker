'use strict';

var ionMonthPicker = angular.module('ionMonthPicker', ['ionic']);
//Relative Path
var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length - 1].src;
var popUpTemplatePath = currentScriptPath.replace('ion-month-picker.js', 'ion-month-picker.html')
var directiveTemplatePath = currentScriptPath.replace('ion-month-picker.js', 'ion-select-element.html');

ionMonthPicker.directive('ionMonthPicker', function($timeout, $ionicPopup, $filter) {
  return {
    restrict: 'EAC',
    scope: {
      label: '@',
      format: '@',
      ngModel: '=?',
    },
    require: '?ngModel',
    transclude: false,
    replace: false,
    templateUrl: directiveTemplatePath || 'ion-select-element.html',
    link: function(scope, element, attrs, ngModel) {

      scope.monthList = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

      var dataAtual = new Date();
      scope.currentDate = {
        year: dataAtual.getFullYear(),
        month: dataAtual.getMonth()
      };

      scope.prev = function(currentYear) {
        scope.currentDate.year = currentYear - 1;
      };

      scope.next = function(currentYear) {
        scope.currentDate.year = currentYear + 1;
      };

      scope.setMonth = function(month) {
        scope.currentDate.month = month;
      };
      
      var dateFormat = attrs.format;
      console.log('dateformat',dateFormat);
      attrs.$observe('format', function(newValue) {
        if (dateFormat == newValue || !ngModel.$modelValue) return;
        dateFormat = newValue;
        ngModel.$modelValue = new Date(ngModel.$setViewValue);
      });

      ngModel.$formatters.unshift(function(modelValue) {
        scope = scope;
        if (!dateFormat || !modelValue) return "";
        var retVal = $filter('date')(modelValue,dateFormat);
        return retVal;
      });

      ngModel.$parsers.unshift(function(viewValue) {
        scope = scope;
        var date = $filter('date')(viewValue,dateFormat);
        return date || "";
      });
      scope.resetInput = function() {
        ngModel.$setViewValue(null);
        ngModel.$render();
      };
      
      scope.openPopup = function() {
        $ionicPopup.show({
          templateUrl: popUpTemplatePath || 'ion-month-picker.html',
          title: 'Selecione um mês',
          subTitle: '',
          scope: scope,
          buttons: [{
            text: 'Cancelar'
          }, {
            text: '<b>Selecionar</b>',
            type: 'button-positive',
            onTap: function(e) {
              ngModel.$setViewValue(new Date(scope.currentDate.year, scope.currentDate.month));
              ngModel.$render();
            }
          }]
        });
      };
    }
  };
});