/**
 * 用户信息实体类
 * Created at 2020/8/4 11:26
 *
 * @author DaiHai
 * @version 1.0
 */
// vue.config.js
const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    chainWebpack: config => {
        //路径配置
        config.resolve.alias
            .set('assets', resolve('src/assets'))
            .set('styles', resolve('src/assets/styles'))
    },

    // webpack-dev-server 相关配置
    devServer: {
        // 调试端口
        // port: 8989
    }
    //其他配置....
}