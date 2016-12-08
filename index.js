#!/usr/bin/env node

let meow = require('meow');
let fs = require('fs');
let path = require('path');
const camelCase = require('camelcase');

let currentPath = process.cwd();

let cli = meow([
    '简介',
    '用于快速生成angular1的初始化文件',
    '-f --filename ：string：文件名称',
    '-p --page : boolean:生成路由页面文件，默认',
    '-c --component:boolean：生成组件页面文件'
], {
    string: ['filename'],
    boolean: ['page', 'component'],
    alias: {
        f: 'filename',
        p: 'page',
        c: 'component'
    }
});

// console.log(cli);
let { filename, page, component } = cli.flags;

if (!filename) {
    console.error('需要设置文件名');
    process.exit(1);
}

let cameName = camelCase(filename);

let htmlName = path.resolve(currentPath, `./${filename}.html`);
let scssName = path.resolve(currentPath, `./${filename}.scss`);
let controllerName = path.resolve(currentPath, `./${filename}.controller.ts`);
let componentName = path.resolve(currentPath, `./${filename}.component.ts`);

let controllerText1 = `
export default class ${cameName}Controller {
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
}
`;

let componentText = `
angular
  .module('app')
  .component('${cameName}', {
    template: <any>require('./${filename}.html'),
    controller: (<any>require)('./${filename}.controller').default,
    controllerAs: '${cameName}'
  })
`;

createFile(htmlName);
createFile(scssName);
createFile(controllerName, controllerText1);

if (component) {
    createFile(componentName, componentText);
}

function createFile(path, str = '') {
    fs.writeFileSync(path, str, 'utf8');
    console.log(path, '创建成功');
};