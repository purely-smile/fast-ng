export default function createFiles(flags) {
  let { filename, page, component, ng2} = flags;
  if (!filename) {
    console.error('需要设置文件名,使用fastng --help查看使用方法');
    process.exit(1);
  }
  const camelCase = require('camelcase');
  const fs = require('fs');
  const path = require('path');
  const currentPath = process.cwd();

  const templates = getTemplates();

  const htmlPath = path.resolve(currentPath, `./${filename}.html`);
  const scssPath = path.resolve(currentPath, `./${filename}.scss`);
  const ng1controllerPath = path.resolve(currentPath, `./${filename}.controller.ts`);
  const componentPath = path.resolve(currentPath, `./${filename}-component.ts`);

  const ng2IndexPath = path.resolve(currentPath, `./index.ts`);

  createFile(htmlPath);
  createFile(scssPath);


  if (ng2) {
    createFile(ng2IndexPath, templates.ng2Index);
    createFile(componentPath, templates.ng2Component);
  } else {
    createFile(ng1controllerPath, templates.ng1Controller);
    if (component) {
      createFile(componentPath, templates.ng1Component);
    }
  }


  function createFile(path, str = '') {
    fs.writeFileSync(path, str, 'utf8');
    console.log(path, '创建成功');
  };

  function getTemplates() {
    const cameName = camelCase(filename);
    return {
      ng1Controller: `export default class ${cameName}Controller {
  private $scope: angular.IScope;
  private $http: angular.IHttpService;
  private ngNotify: ngNotifyService;
  private $state;

  constructor($scope,$http, ngNotify, $state){
    'ngInject';
    this.$scope = $scope;
    this.$http = $http;
    this.ngNotify = ngNotify;
    this.$state = $state;
    this.init();
   }
   init (){

   }
}`,
      ng1Component: `angular
  .module('app')
  .component('${cameName}', {
    template: <any>require('./${filename}.html'),
    controller: (<any>require)('./${filename}.controller').default,
    controllerAs: '${cameName}'
  })`,
      ng2Component: `import { Component, Input } from '@angular/core';
@Component({
      selector: '${filename}',
      templateUrl: './${filename}.html',
      styleUrls: ['./${filename}.scss']
})
export class ${cameName}Component;`,
      ng2Index: `export * from './${filename}-component'`
    }
  }

};