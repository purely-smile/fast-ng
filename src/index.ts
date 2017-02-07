#!/usr/bin/env node

import meow = require('meow');
import createFiles from './libs/createFiles'

const cli = meow([
    '简介',
    '用于快速生成angular的初始化文件',
    '-n --ng2 :是否生成angular2页面component',
    '-f --filename ：string：文件名称',
    '-p --page : boolean:生成路由页面文件，默认',
    '-c --component:boolean：生成组件页面文件'
], {
        string: ['filename'],
        boolean: ['page', 'component', 'ng2'],
        alias: {
            f: 'filename',
            p: 'page',
            c: 'component',
            n: 'ng2'
        }
    });

// console.log(cli);
createFiles(cli.flags);
