/**
 * 用户信息实体类
 * Created at 2020/5/21 10:07
 *
 * @author DaiHai
 * @version 1.0
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const warehouse = () => import('../views/Warehouse')
const goods = () => import('../views/Goods')
const userInfo = () => import('../views/UserInfo')
const authority = () => import('../views/Authority')
const login = () => import('../views/Login')
const retrievePassword = () => import('../views/RetrievePassword')
const home = () => import('../components/Home')
const homeUpdatePass = () => import('../views/HomeUpdatePass')
const supplier = () => import('../views/Supplier')
const logger = () => import('../views/Logger')
const personalInfo = () => import('../views/PersonalInfo')
const stock = () => import('../views/Stock')
const order = () => import('../views/Order')
const approve = () => import('../views/Approve')
const consigneeInfo = () => import('../views/ConsigneeInfo')
const logistics = () => import('../views/Logistics')
const warehousing = () =>import('../views/Warehousing')
const property = () =>import('../views/Property')
const warehouseOut = () =>import('../views/WarehouseOut')
const inventory = () =>import('../views/Inventory')
const graphical = () =>import('../views/Graphical')


const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/retrievePassword',
        component: retrievePassword
    },
    {
        path: '/home',
        redirect: '/userInfo',
        component: home,
        children: [
            { //人员管理
                path: '/userInfo',
                meta: {
                    name: '人员管理',
                    comp: 'userInfo'
                },
                component: userInfo
            },
            { //权限管理
                path: '/authority',
                meta: {
                    name: '权限管理',
                    comp: 'authority'
                },
                component: authority
            },
            { //仓库管理
                path: '/warehouse',
                meta: {
                    name: '仓库管理',
                    comp: 'warehouse'
                },
                component: warehouse
            },
            { //物品管理
                path: '/goods',
                meta: {
                    name: '物品管理',
                    comp: 'goods'
                },
                component: goods
            },
            { //修改密码
                path: '/homeUpdatePass',
                meta: {
                    name: '修改密码',
                    comp: 'homeUpdatePass'
                },
                component: homeUpdatePass
            },
            { //供货商管理
                path: '/supplier',
                meta: {
                    name: '供货商管理',
                    comp: 'supplier'
                },
                component: supplier
            },
            { //日志管理
                path: '/logger',
                meta: {
                    name: '日志查询',
                    comp: 'logger'
                },
                component: logger
            }
            ,
            { //个人信息
                path: '/personalInfo',
                meta: {
                    name: '个人信息',
                    comp: 'personalInfo'
                },
                component: personalInfo
            }
            ,
            { //个人信息
                path: '/stock',
                meta: {
                    name: '库存管理',
                    comp: 'stock'
                },
                component: stock
            },
            { //下单管理
                path: '/order',
                meta: {
                    name: '下单管理',
                    comp: 'order'
                },
                component: order
            },
            { //审核管理
                path: '/approve',
                meta: {
                    name: '审核管理',
                    comp: 'approve'
                },
                component: approve
            },
            { //收货地址
                path: '/consigneeInfo',
                meta: {
                    name: '收货地址',
                    comp: 'consigneeInfo'
                },
                component: consigneeInfo
            },
            { //物流信息
                path: '/logistics',
                meta: {
                    name: '物流管理',
                    comp: 'logistics'
                },
                component: logistics
            },
            { //入库管理
                path: '/warehousing',
                meta: {
                    name: '入库管理',
                    comp: 'warehousing'
                },
                component: warehousing
            },
            { //入库管理
                path: '/warehouseOut',
                meta: {
                    name: '出库管理',
                    comp: 'warehouseOut'
                },
                component: warehouseOut
            },
            { //财产管理
                path: '/property',
                meta: {
                    name: '财产管理',
                    comp: 'property'
                },
                component: property
            },
            { //仓库盘点
                path: '/inventory',
                meta: {
                    name: '仓库盘点',
                    comp: 'inventory'
                },
                component: inventory
            },
            { //图形数据
                path: '/graphical',
                meta: {
                    name: '图形数据',
                    comp: 'graphical'
                },
                component: graphical
            }

        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

/*
* 全局前置路由
* */
router.beforeEach((to, from, next) => {
    //校验是否找回密码
    console.info("进入全局前置路由"+to.path);
    if (to.path == '/retrievePassword') {
        next()
        //校验是否登录，防止不登录，直接进入其他页面
    } else if ((to.path == '/login' && from.path === '/') || (to.path == '/userInfo' && from.path === '/login')) {
        next()
    } else {
        if (sessionStorage.getItem('profile') === null) {
            next('/login')
        } else {
            next()
        }
    }
})


//重写路由的push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

export default router
