chat旨在提供一个聊天工具的基础功能，其余功能可以通过插件的方式由第三方提供。
目前chat正处于开发阶段。

## 运行项目
#### 建议环境
* 操作系统：MAC OS或者LINUX
* nodejs 0.11.*
* mysql 5.6.20
#### 跑起来
* 1、git clone https://github.com/yibuyisheng/chat.git
* 2、安装mysql，建立名为chat的数据库；
* 3、修改db/databse.js，配置数据库连接：
```js
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'root'
});
```
* 4、安装grunt：npm install -g grunt-cli；
* 5、在项目根目录下运行npm install；
* 6、在项目根目录下运行grunt develop；
* 7、打开浏览器，地址栏中输入：http://127.0.0.1:3000/registe，如果能正常出来注册页面，那么恭喜您，项目成功跑起来了。

## 联系作者：
email: yibuyisheng@163.com