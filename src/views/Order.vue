<template>
    <div>
        <!--工具条-->
        <el-col :span="24"  style="padding-bottom: 0;">
            <el-form :inline="true" :model="filters" >
<!--                <el-form-item prop="goodsId">-->
<!--                    <el-select v-model="filters.goodsId" filterable placeholder="请选择物品" style="width: 150px">-->
<!--                        <el-option-->
<!--                                v-for="item in goodsAllList"-->
<!--                                :key="item.id"-->
<!--                                :label="item.name"-->
<!--                                :value="item.id">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
                <el-form-item prop="statusId">
                    <el-select v-model="filters.statusId" filterable placeholder="请选择状态" style="width: 150px" @change="btnSearch">
                        <el-option
                                v-for="item in statusList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item prop="orderNumber">
                    <el-input v-model="filters.orderNumber" placeholder="订单号"  prefix-icon="el-icon-search" style="width: 150px" @keyup.enter.native="btnSearch()"></el-input>
                </el-form-item>
<!--                <el-form-item prop="applicantId">-->
<!--                    <el-input v-model="filters.applicantId" placeholder="申请人"  prefix-icon="el-icon-search" style="width: 150px"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item prop="approverId">
                    <el-input v-model="filters.approverId" placeholder="审批人"  prefix-icon="el-icon-search" style="width: 150px" @keyup.enter.native="btnSearch()"></el-input>
                </el-form-item>
<!--                <el-form-item prop="consignee">-->
<!--                    <el-input v-model="filters.consignee" placeholder="收货人"  prefix-icon="el-icon-search" style="width: 150px"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item prop="time">
                    <el-date-picker v-model="filters.times" type="daterange" range-separator="至" start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="timestamp"
                                    @change="timeChange">
                    </el-date-picker>
                </el-form-item>
                <el-dropdown split-button type="primary" @click="btnSearch" trigger="click" style="margin-right: 10px">
                    搜索
                    <el-dropdown-menu slot="dropdown" trigger="click">
                        <el-dropdown-item @click.native="btnReset">重置</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown split-button type="primary" @click="btnNew" trigger="click">
                    新增
                    <el-dropdown-menu slot="dropdown" trigger="click">
                        <el-dropdown-item @click.native="btnDelete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form>
        </el-col>
        <el-table
                ref="order"
                :data="orderData"
                :header-cell-style="tableHeaderColor"
                border
                highlight-current-row
                @current-change="handleTableChange"
                style="width: 100%;" v-loading="listLoading">
            <el-table-column type="expand">
                <template slot-scope="date">
                    <el-form :inline="true" >
                        <el-form-item style="margin-left: 50px">
                            订 单 号:{{date.row.orderNumber}}
                        </el-form-item>
                        <el-form-item style="float: right;margin-right: 50px">
                            申 请 时 间: {{date.row.createTime}}
                        </el-form-item>
                    </el-form>
                    <el-table
                            :data="date.row.purchaseApplicationList"
                            :header-cell-style="tableHeaderColor"
                            border
                            highlight-current-row
                            style="width: 100%;">
                        <el-table-column type="expand">
                            <template slot-scope="dataInfo">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-row :gutter="10">
                                            <el-col :span="12">
                                                <span style="font-size: 20px;color: #409EFF">物品信息</span>
                                                <el-form label-position="left" inline class="demo-table-expand">
                                                    <el-form-item label="物品名称">
                                                        <span>{{ dataInfo.row.goods.name }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="计量单位">
                                                        <span>{{ dataInfo.row.goods.unit }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="规格型号">
                                                        <span>{{ dataInfo.row.goods.type }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="尺寸">
                                                        <span>{{ dataInfo.row.goods.size }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="质量">
                                                        <span>{{ dataInfo.row.goods.weight }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="保存温度">
                                                        <span>{{ dataInfo.row.goods.temperature }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="参考价钱(元)">
                                                        <span>{{ dataInfo.row.goods.price }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="物品描述">
                                                        <span>{{ dataInfo.row.goods.description }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="登记时间">
                                                        <span>{{ dataInfo.row.goods.registerTime }}</span>
                                                    </el-form-item>
                                                </el-form>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form label-position="left" inline class="demo-table-expand">
                                                    <viewer >
                                                        <el-form-item v-for="item in dataInfo.row.goods.pictures">
                                                            <img :src="getImgUrl(item.url)" :key="item.url" style="width: 100px;height:100px">
                                                        </el-form-item>
                                                    </viewer>
                                                </el-form>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="6">
                                        <span  style="font-size: 20px;color: #409EFF">申请信息</span>
                                        <el-form label-position="left" inline class="demo-table-expand">
                                            <el-form-item label="申请人">
                                                <span>{{ dataInfo.row.applicantId }}</span>
                                            </el-form-item>
                                            <el-form-item label="申请原因">
                                                <span>{{ dataInfo.row.reason }}</span>
                                            </el-form-item>
                                            <el-form-item label="申请到货时间">
                                                <span>{{ dataInfo.row.timeArrival }}</span>
                                            </el-form-item>
                                            <el-form-item label="申请时间">
                                                <span>{{ dataInfo.row.timeApplication }}</span>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                    <el-col :span="6">
                                        <span  style="font-size: 20px;color: #409EFF">收货人信息</span>
                                        <el-form label-position="left" inline class="demo-table-expand">
                                            <el-form-item label="收货人">
                                                <span>{{ dataInfo.row.consignee }}</span>
                                            </el-form-item>
                                            <el-form-item label="收货人电话">
                                                <span>{{ dataInfo.row.phone }}</span>
                                            </el-form-item>
                                            <el-form-item label="申请人地址">
                                                <span>{{ dataInfo.row.addressShipping }}</span>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="goods.name"
                                sortable
                                label="物品">
                        </el-table-column>
                        <el-table-column
                                prop="goods.unit"
                                sortable
                                label="单位">
                        </el-table-column>
                        <el-table-column
                                prop="brand"
                                sortable
                                label="品牌">
                        </el-table-column>
                        <el-table-column
                                prop="quantity"
                                sortable
                                label="数量">
                        </el-table-column>
                        <el-table-column
                                prop="timeArrival"
                                sortable
                                label="到货时间">
                        </el-table-column>
                        <el-table-column
                                prop="consignee"
                                sortable
                                label="收货人">
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                sortable
                                label="收货电话">
                        </el-table-column>
                        <el-table-column
                                prop="addressShipping"
                                sortable
                                label="收货地址">
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="orderPurchaseClick(scope.row,date.row.statusId)" size="small">编辑</el-button>
                                <el-button type="text" @click="deleteOrderPurchase(scope.row,date.row.statusId)" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-form :inline="true" >
                        <el-form-item style="margin-left: 50px">
                            申 请 人:{{date.row.purchaseApplicationList[0].applicantId}}
                        </el-form-item>
                        <el-form-item style="float: right;margin-right: 50px">
                            审 批 人: {{date.row.approverId}}
                        </el-form-item>
                    </el-form>

                </template>
            </el-table-column>
            <el-table-column
                    prop="orderNumber"
                    sortable
                    label="订单号">
            </el-table-column>
            <el-table-column
                    prop="approverName"
                    sortable
                    label="审批人">
            </el-table-column>
            <el-table-column
                    prop="statusId"
                    sortable
                    label="审批状态"
                    :formatter="formatterStatus">
            </el-table-column>
            <el-table-column
                    prop="comments"
                    sortable
                    label="审批意见">
            </el-table-column>
            <el-table-column
                    prop="timeProcessing"
                    sortable
                    label="审批时间">
            </el-table-column>
            <el-table-column
                    prop="effective"
                    sortable
                    label="是否有效"
                    :formatter="effectiveHandle">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    sortable
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="printingClick(scope.row)" size="small">打印页面</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" >
            <el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="tableLength" style="float:right;">
            </el-pagination>
        </el-col>
        <el-dialog title="打印页面" :visible.sync="printingVisible" width="42%"  :close-on-click-modal="false">
            <div id="printTest">
                <div style="text-align: center">
                    <h2>中本硕采购申请单</h2>
                </div>
                <div style="padding: 10px">
                    <h4> NO:{{printOrderList.orderNumber}}</h4>
                    <el-table
                            :data="printOrderList.purchaseApplicationList"
                            :header-cell-style="tableHeaderColor"
                            border
                            highlight-current-row
                            style="width: 100%;font-size: 10px">
                        <el-table-column
                                prop="goods.name"
                                label="物品"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="goods.unit"
                                label="单位"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                prop="brand"
                                label="品牌"
                                width="60">
                        </el-table-column>
                        <el-table-column
                                prop="quantity"
                                label="数量"
                                width="60">
                        </el-table-column>
                        <el-table-column
                                prop="timeArrival"
                                label="到货时间"
                                width="90">
                        </el-table-column>
                        <el-table-column
                                prop="consignee"
                                label="收货人"
                                width="60">
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                label="收货电话"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="addressShipping"
                                label="收货地址">
                        </el-table-column>
                        <el-table-column
                                prop="reason"
                                label="申请原因">
                        </el-table-column>
                    </el-table>
                    <div style="margin-top: 10px">
                        <h4 style="display: inline"> 请购人:</h4>{{printOrderList.applicantName}}
                    </div>
                    <div style="margin-top: 10px">
                        <h4 style="display: inline"> 请购日期:</h4>{{printOrderList.createTime}}
                    </div>
                    <div style="margin-top: 10px">
                        <h4 style="display: inline"> 批复意见:</h4>{{printOrderList.comments}}
                    </div>
                    <div style="margin-top: 10px">
                        <h4 style="display: inline"> 批复人:</h4>{{printOrderList.approverName}}
                    </div>
                    <div style="margin-top: 10px;float: right">
                        {{getNewTime()}}
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="printingVisible = false">取消</el-button>
                <el-button type="primary" v-print="'#printTest'" >去打印</el-button>
            </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增下单" :visible.sync="addFormVisible"  :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px"  ref="addForm">
                <el-form-item label="订单号" >
                    <el-input v-model="addForm.orderNumber" style="width:217px;margin-right: 10px " disabled auto-complete="off" ></el-input>
                    <el-button type="primary" @click="openGoodsDrawer">新增商品</el-button>
                </el-form-item>
                <el-form-item label="申请原因" >
                    <el-input type="textarea" style="width:325px;margin-right: 10px " v-model="addForm.reason" auto-complete="off" rows="2"></el-input>
                </el-form-item>
                <el-form-item label="到货时间" >
                    <el-date-picker  v-model="addForm.timeArrival" value-format="yyyy-MM-dd HH:mm:ss"  type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="收货人" >
                    <el-select v-model="addForm.consigneeId"  filterable placeholder="请选择">
                        <el-option
                                v-for="item in consigneeInfoList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            <span >{{ item.name }}——</span>
                            <span >{{ item.phone }}——</span>
                            <span >{{ item.address }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-table
                        ref="orderPreview"
                        :data="addForm.purchaseList"
                        :header-cell-style="tableHeaderColor"
                        border
                        highlight-current-row
                        style="width: 100%;">
                    <el-table-column
                            prop="goodsName"
                            label="物品">
                    </el-table-column>
                    <el-table-column
                            prop="quantity"
                            label="数量">
                    </el-table-column>
                    <el-table-column
                            prop="consignee"
                            label="收件人">
                    </el-table-column>
                    <el-table-column
                            prop="brand"
                            label="品牌">
                    </el-table-column>
                    <el-table-column
                            prop="supplierName"
                            label="供货商">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="purchaseClick(scope.row)" size="small">编辑</el-button>
                            <el-button type="text" @click="deletePurchase(scope.row)" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-drawer
                :before-close="handleClose"
                :visible.sync="drawerDialog"
                direction="rtl"
                custom-class="demo-drawer"
                ref="drawer">
            <div>
                <el-form :model="addFormDrawer" :rules="addFormDrawerRules" ref="addFormDrawer" label-width="100px" style="margin: 50px">
                    <el-form-item label="物品" prop="goodsId">
                        <el-select v-model="addFormDrawer.goodsId"  filterable placeholder="请选择">
                            <el-option
                                    v-for="item in goodsList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="供货商" >
                        <el-select v-model="addFormDrawer.supplierId"  filterable placeholder="请选择">
                            <el-option
                                    v-for="item in supplierList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌" prop="brand">
                        <el-input v-model="addFormDrawer.brand" style="width:217px " auto-complete="off" ></el-input>
                    </el-form-item>
                    <el-form-item label="数量" prop="quantity">
                        <el-input-number :min="1" v-model="addFormDrawer.quantity" auto-complete="off" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="申请原因" prop="reason">
                        <el-input type="textarea" v-model="addFormDrawer.reason" auto-complete="off" rows="2"></el-input>
                    </el-form-item>
                    <el-form-item label="到货时间" prop="timeArrival">
                        <el-date-picker  v-model="addFormDrawer.timeArrival" value-format="yyyy-MM-dd HH:mm:ss"  type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="收货人" prop="consigneeId">
                        <el-select v-model="addFormDrawer.consigneeId"  filterable placeholder="请选择">
                            <el-option
                                    v-for="item in consigneeInfoList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                <span >{{ item.name }}——</span>
                                <span >{{ item.phone }}——</span>
                                <span >{{ item.address }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="float: right;margin-right: 50px">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="submitDrawer()" :loading="drawerLoading">{{ drawerLoading ? '提交中 ...' : '确 定' }}</el-button>
                </div>
            </div>
        </el-drawer>
        <!--更新界面-->
        <el-dialog title="修改订单" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" :rules="editFormRules"  ref="editForm" label-width="100px" >
                <el-form-item label="物品" prop="goodsId">
                    <el-select v-model="editForm.goodsId"  filterable placeholder="请选择">
                        <el-option
                                v-for="item in goodsList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="供货商" >
                    <el-select v-model="editForm.supplierId"  filterable placeholder="请选择">
                        <el-option
                                v-for="item in supplierList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                    <el-input v-model="editForm.brand" style="width:217px " auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="quantity">
                    <el-input-number :min="1" v-model="editForm.quantity" auto-complete="off" ></el-input-number>
                </el-form-item>
                <el-form-item label="申请原因" prop="reason">
                    <el-input type="textarea" v-model="editForm.reason" auto-complete="off" rows="2"></el-input>
                </el-form-item>
                <el-form-item label="到货时间" prop="timeArrival">
                    <el-date-picker  v-model="editForm.timeArrival" value-format="yyyy-MM-dd HH:mm:ss"  type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="收货人" prop="consignee">
                    <el-input  v-model="editForm.consignee" auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="收货人电话" prop="phone">
                    <el-input v-model="editForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收获地址" prop="addressShipping">
                    <el-input  v-model="editForm.addressShipping" auto-complete="off" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                <el-button @click="editFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="submitPurchase()" :loading="editLoading">{{ editLoading ? '提交中 ...' : '确 定' }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'
    export default {
        name: "Order",

        data(){
            let quantity = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error("请输入数量"))
                } else if (value<=0) {
                    callback(new Error("数量不能小于0"))
                } else {
                    callback()
                }

            };
            return {
                printObj: {
                    id: "printTest",
                    popTitle: '苏州中本硕机电工程有限公司'
                },
                page: 1,//当前页数
                pageSize:10,//一页显示几条
                listLoading: false,//table加载loading等待
                addFormVisible: false,//新增界面是否显示
                editFormVisible: false,//编辑界面是否显示
                addLoading: false,//新增提交等待页面
                editLoading: false,//编辑提交等待页面
                printingVisible: false,//打印页面
                addFormDrawerRules: {
                     goodsId: [{ required: true, message: '请选择物品', trigger: 'change' },],
                    quantity: [{ validator:quantity, trigger: 'blur' },],
                    reason: [{ required: true, message: '请输入申请原因', trigger: 'blur' },],
                    timeArrival: [{ required: true, message: '请输入要求到货时间', trigger: 'change' },],
                    consigneeId: [{ required: true, message: '请选择物品', trigger: 'change' },],
                },
                editFormRules: {
                    goodsId: [{ required: true, message: '请选择物品', trigger: 'change' },],
                    quantity: [{ validator:quantity, trigger: 'blur' },],
                    reason: [{ required: true, message: '请输入申请原因', trigger: 'blur' },],
                    timeArrival: [{ required: true, message: '请输入要求到货时间', trigger: 'change' },],
                    consignee:[{ required: true, message: '请输入收货人', trigger: 'blur' },],
                    phone:[{ required: true, message: '请输入收货人电话', trigger: 'blur' },],
                    addressShipping:[{ required: true, message: '请输入收货人地址', trigger: 'blur' },],

                },
                //新增界面数据
                addForm: {
                    orderNumber:'',//订单号
                    purchaseList:[],//订单list
                },
                addFormDrawer:{
                    uuid:"",//随机生成ID
                    goodsId:null,//物品Id
                    supplierId:null,//供应商Id
                    goodsName:'',//物品名称
                    supplierName:'',//供应商名称
                    brand:'',//品牌
                    quantity:1,//数量
                    reason:'',//申请原因
                    timeArrival:'',//要求到货时间
                    consigneeId:null,//收货人ID
                    consignee:'',//收货人
                    phone:'',//收货人电话
                    addressShipping:'',//收货地址
                },
                //编辑界面数据
                editForm: {
                    goodsId: '',//物品ID
                    supplierId:0,//供货商ID
                    brand:'',//品牌
                    quantity:1,//数量
                    reason:'',//申请原因
                    timeArrival:'',//要求到货时间
                    consignee:'',//收货人
                    phone:'',//收货人电话
                    addressShipping:'',//收货地址
                    id:0,//订单主键Id
                },
                //筛选条件
                filters: {
                    orderNumber:'',//订单号
                    goodsId: 0,//商品ID
                    applicantId:'',//申请人
                    approverId:'',//审批人
                    startTime:'',//开始时间
                    endTime:'',//结束时间
                    consignee:'',//收货人
                    times:[],//时间组
                    statusId:0,//状态
                },
                orderData: [],//数据
                tableLength:0,//数据总个数
                // 更改表头样式
                tableHeaderColor ({ rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                currentRow:{},//行数据
                goodsList:[],//物品选择
                goodsAllList:[],//物品全部选择
                statusList:[],//状态表信息
                supplierList:[],//仓库选择
                consigneeInfoList:[],//收货人全部list
                drawerDialog:false,
                drawerLoading:false,
                printOrderList:[],//打印页面的list
            }
        },
        mounted(){
            let timestampBt = this.defaultTime(new Date(),-30);
            let timestampEt = new Date().getTime();
            this.filters.startTime = this.timestampToTime(timestampBt);
            this.filters.endTime = this.timestampToTime(timestampEt);
            this.filters.times.push(timestampBt);
            this.filters.times.push(timestampEt);
            this.searchStatus();
            this.searchGoodsList();
            this.searchSupplierList();
            this.search();
        },
        methods: {
            //打印页面
            printingClick(row){
                console.info("打印数据",row);
                this.printingVisible = true;
                this.printOrderList = row;
            },
            //更新订单明细物品
            submitPurchase(){
                let that = this;
                that.$refs.editForm.validate((valid) => {
                    if(valid) {
                        that.editLoading = true;
                        let param = that.editForm;
                        let url = "/purchase/updatePurchase";//更新明细物品
                        that.post_url(url, param, "更新失败！", null).then(function (res) {
                            console.info("更新订单明细物品",res);
                            that.editLoading = false;
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("更新成功");
                                that.editFormVisible = false;
                                that.search();
                            }else{
                                that.$message.success("更新失败");
                            }
                        }).catch(()=>{
                            that.$message.success("更新失败");
                            that.editLoading = false;
                        });
                    }
                })
            },
            //订单明细物品的编辑
            orderPurchaseClick(row,statusId){
                if (statusId == 2 ||statusId == 3) {
                    this.$alert('当前选中的信息审批状态已经处理过，无法修改！', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                    return;
                }
                console.info("订单明细物品的编辑",row);
                this.editFormVisible = true;
                this.editForm = {
                    goodsId: row.goodsId,//物品ID
                    supplierId:row.supplierId,//供货商ID
                    brand:row.brand,//品牌
                    quantity:row.quantity,//数量
                    reason:row.reason,//申请原因
                    timeArrival:row.timeArrival,//要求到货时间
                    consignee:row.consignee,//收货人
                    phone:row.phone,//收货人电话
                    addressShipping:row.addressShipping,//收货地址
                    id:row.id,//订单主键Id
                }
            },
            //订单明细物品的删除
            deleteOrderPurchase(row,statusId){
                if (statusId !== 1) {
                    this.$alert('当前选中的信息审批状态已经处理过，无法删除！', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                    return;
                }
                let that = this;
                console.info("订单明细物品的删除",row);
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let param = {
                        id: row.id//删除 订单明细物品ID
                    }
                    let url = "/purchase/deletePurchase";//删除订单明细物品
                    this.post_url(url, param, "删除失败！", null).then(function (res) {
                        console.info("删除订单明细物品",res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.$message.success("删除成功");
                            that.search();
                        }else{
                            that.$message.success("删除失败");
                        }
                    }).catch(()=>{
                        that.$message.success("删除失败");
                    });
                })
            },
            //拼接图片地址
            getImgUrl(url){
                return this.getPath() + ":" + this.getPort() + url;
            },
            //获取系统时间
            getNewTime(){
                return this.timestampToTimeYMDHMS() ;
            },
            //对是否失效处理
            effectiveHandle(row) {
                if (row.effective == 1) {
                    return '有效'
                } else {
                    return '无效'
                }
            },
            //初始化新增物品信息
            initDrawerInfo(){
                this.addFormDrawer.uuid= '';
                this.addFormDrawer.goodsId= '';
                this.addFormDrawer.goodsName='';
                this.addFormDrawer.supplierId= '';
                this.addFormDrawer.supplierName='';
                this.addFormDrawer.brand='';//品牌
                this.addFormDrawer.quantity='';//数量
                // this.addFormDrawer.reason='';//申请原因
                // this.addFormDrawer.timeArrival='';//要求到货时间
                // this.addFormDrawer.consignee='';//收货人
                // this.addFormDrawer.phone='';//收货人电话
                // this.addFormDrawer.addressShipping='';//收货地址
                // this.addFormDrawer.consigneeId='';//收货地址Id
                if(this.addForm.reason!=null&&this.addForm.reason!==''){
                    this.addFormDrawer.reason= this.addForm.reason;//申请原因
                }
               if(this.addForm.timeArrival!=null&&this.addForm.timeArrival!==''){
                   this.addFormDrawer.timeArrival=this.addForm.timeArrival;//要求到货时间
               }
               if(this.addForm.consigneeId!=null&&this.addForm.consigneeId!==''){
                   this.addFormDrawer.consigneeId=this.addForm.consigneeId;//收货地址Id
               }


            },
            //新增商品按钮
            openGoodsDrawer(){
                this.drawerDialog = true;
                this.initDrawerInfo();

            },
            //点击新增下单操作编辑
            purchaseClick(row){
                console.info("编辑按钮",row);
                this.drawerDialog = true;
                this.addFormDrawer.uuid= row.uuid;
                this.addFormDrawer.goodsId= row.goodsId;
                this.addFormDrawer.goodsName=row.goodsName;
                this.addFormDrawer.supplierId= row.supplierId;
                this.addFormDrawer.supplierName=row.supplierName;
                this.addFormDrawer.brand=row.brand;//品牌
                this.addFormDrawer.quantity=row.quantity;//数量
                this.addFormDrawer.reason=row.reason;//申请原因
                this.addFormDrawer.timeArrival=row.timeArrival;//要求到货时间
                this.addFormDrawer.consignee=row.consignee;//收货人
                this.addFormDrawer.phone=row.phone;//收货人电话
                this.addFormDrawer.addressShipping=row.addressShipping;//收货地址
                this.addFormDrawer.consigneeId=row.consigneeId;//收货地址Id

            },
            //点击新增下单操作删除
            deletePurchase(row){
                console.info("删除按钮",row);
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    for(let i = 0;i<this.addForm.purchaseList.length;i++){
                        if(this.addForm.purchaseList[i].uuid==row.uuid){
                            this.addForm.purchaseList.splice(i,1);
                            break;
                        }
                    }
                })
            },
            //提交drawer
            submitDrawer(){
                this.$refs.addFormDrawer.validate((valid) => {
                    if(valid) {
                        this.drawerLoading = true;
                        let object = new Object();
                        let obj = {};
                        if(this.addFormDrawer.supplierId!=''&this.addFormDrawer.supplierId!=0){
                            for(let i = 0;i<this.supplierList.length;i++){
                                if(this.supplierList[i].id ==this.addFormDrawer.supplierId){
                                    obj = this.supplierList[i];
                                    break;
                                }
                            }
                            console.info("供应商选择改变事件",obj);
                            this.addFormDrawer.supplierName = obj.name;
                        }
                        obj = {};
                        for(let i = 0;i<this.goodsList.length;i++){
                            if(this.goodsList[i].id ==this.addFormDrawer.goodsId){
                                obj = this.goodsList[i];
                                break;
                            }
                        }
                        console.info("物品选择改变事件",obj);
                        this.addFormDrawer.goodsName = obj.name;

                        obj = {};
                        for(let i = 0;i<this.consigneeInfoList.length;i++){
                            if(this.consigneeInfoList[i].id ==this.addFormDrawer.consigneeId){
                                obj = this.consigneeInfoList[i];
                                break;
                            }
                        }
                        console.info("物品选择改变事件",obj);
                        this.addFormDrawer.consignee = obj.name;
                        this.addFormDrawer.phone = obj.phone;
                        this.addFormDrawer.addressShipping = obj.address;
                        object.goodsId = this.addFormDrawer.goodsId;
                        object.goodsName = this.addFormDrawer.goodsName;
                        object.supplierId = this.addFormDrawer.supplierId;
                        object.supplierName = this.addFormDrawer.supplierName;
                        object.brand = this.addFormDrawer.brand;
                        object.quantity = this.addFormDrawer.quantity;
                        object.reason = this.addFormDrawer.reason;
                        object.timeArrival = this.addFormDrawer.timeArrival;
                        object.consigneeId = this.addFormDrawer.consigneeId;
                        object.consignee = this.addFormDrawer.consignee;
                        object.phone = this.addFormDrawer.phone;
                        object.addressShipping = this.addFormDrawer.addressShipping;
                        console.info("返回后的数据",object);
                        debugger
                        let index = 0;
                        if(this.addFormDrawer.id==null||this.addFormDrawer.id==''){
                            object.uuid = this.getUuid();
                        }else{
                            object.uuid = this.addFormDrawer.uuid;
                            for(let i = 0;i<this.addForm.purchaseList.length;i++){
                                if(this.addForm.purchaseList[i].uuid==this.addFormDrawer.uuid){
                                    index = i;
                                    this.addForm.purchaseList.splice(i,1)
                                    break;
                                }
                            }
                        }
                        this.addForm.purchaseList.splice(index,0,object);
                        console.info("purchaseList数据",this.addForm.purchaseList);
                        this.initDrawerInfo();
                        this.drawerLoading = false;
                    }
                })
            },
            //关闭drawer
            handleClose(){
                this.drawerDialog = false;
                this.initDrawerInfo();
                this.drawerLoading = false;
            },
            //初始化状态
            formatterStatus(row){
                if (row.statusId==1) {
                    return "待审批"
                } else if(row.statusId==2) {
                    return "通过"
                } else if(row.statusId==3) {
                    return "拒绝"
                }else if(row.statusId==4) {
                    return "驳回待修改"
                }else{
                    return ""
                }
            },
            /*时间段输入框值发生改变时触发 value：当前输入框值*/
            timeChange(value) {
                let that = this;
                let articleNum = ''
                let type = ''
                if (type !== " ") {
                    type = this.type
                }
                if (this.articleNum !== " ") {
                    articleNum = this.articleNum
                }
                let startTime = ''
                let endTime = ''
                if (this.times != null) {
                    startTime = value[0]
                    endTime = value[1]
                }
                that.filters.startTime = this.timestampToTime(value[0]);
                that.filters.endTime = this.timestampToTime(value[1]);
                console.info("开始时间",that.filters.startTime);
                console.info("结束时间",that.filters.endTime);
                this.search();
            },
            //改变行选择事件
            handleTableChange(val){
                let that = this;
                console.info("点击行的数据",val);
                if(val!=null){
                    that.currentRow = val;
                }

            },
            //删除订单
            btnDelete(){
                let that = this;
                let ids = this.currentRow.orderNumber;
                if (ids == '' || ids == null) {
                    this.$alert('请选择要删除的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else if (this.currentRow.statusId !== 1 ) {
                    this.$alert('当前选中的信息审批状态已经处理过，无法删除！', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        console.info("要删除的数据",this.currentRow)
                        let param = {
                            orderNumber: this.currentRow.orderNumber//删除  订单
                        }
                        that.listLoading = true;
                        let url = "/purchase/deleteOrder";//删除物品
                        this.post_url(url, param, "删除订单失败！", null).then(function (res) {
                            console.info(res);
                            that.listLoading = false;
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除订单成功");
                                that.search();
                            }
                        }).catch(() => {
                            that.$message.warning("删除订单失败");
                        });
                    }).catch(() => {
                        that.$message.warning("删除订单失败");
                    });
                }
            },
            //查询全部收货人
            searchConsigneeInfo(){
                let that = this;
                let url = "/consigneeInfo/searchAllConsigneeInfos";
                let param = {
                };
                that.consigneeInfoList = [];
                this.post_url(url, param, "查询全部收货人失败！", null).then(function (res) {
                    console.info("查询全部收货人回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.consigneeInfoList = res.data;
                    }

                }).catch(()=>{
                    that.$message.error("服务器错误！")
                });
            },
            //查询全部物品
            searchGoodsList:function(){
                let that = this;
                let url = "/goods/searchAllGoods";
                let param = {
                };
                that.goodsList = [];
                this.post_url(url, param, "查询全部物品失败！", null).then(function (res) {
                    console.info("查询全部物品返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        let all = {
                            id:0,
                            name:'全部'
                        };
                        let allList = JSON.parse(JSON.stringify(res.data));
                        allList.unshift(all);
                        that.goodsAllList = allList;
                        console.info("全部list",allList);
                        that.goodsList = res.data;
                    }

                }).catch(()=>{
                    that.$message.error("服务器错误！")
                });
            },
            //查询状态表信息
            searchStatus:function(){
                let that = this;
                let url = "/purchase/searchStatus";
                let param = {
                };
                that.goodsList = [];
                this.post_url(url, param, "查询全部状态失败！", null).then(function (res) {
                    console.info("查询全部状态返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        let all = {
                            id:0,
                            name:'全部'
                        };
                        res.data.unshift(all)
                        that.statusList = res.data;
                    }

                }).catch(()=>{
                    that.listLoading = false;
                    that.$message.error("服务器错误！")
                });
            },
            //查询全部仓库
            searchSupplierList:function(){
                let that = this;
                let url = "/supplier/searchAllSuppliers";
                let param = {
                };
                that.supplierList = [];
                this.post_url(url, param, "查询全部供应商失败！", null).then(function (res) {
                    console.info("查询全部供应商返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.supplierList = res.data;
                    }

                }).catch(()=>{
                    that.$message.error("服务器错误！")
                });
            },
            //查询库存信息
            search: function () {
                let that = this;
                let url = "/purchase/searchPurchase";
                that.currentRow = {};
                let param = {
                    goodsId:that.filters.goodsId,//物品ID
                    applicantId:that.filters.applicantId,//申请人
                    approverId:that.filters.approverId,//审批人
                    startTime:that.filters.startTime,//开始时间
                    endTime:that.filters.endTime,//结束时间
                    consignee:that.filters.consignee,//收货人
                    statusId:that.filters.statusId,//审批状态
                    size: that.pageSize,// 每页的记录数（行数）
                    page: that.page//第几条开始
                };
                that.orderData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询订单信息失败！", null).then(function (res) {
                    that.listLoading = false;
                    console.info("查询订单息返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.orderData = res.data.list;
                        that.tableLength = res.data.total;
                    }

                }).catch(()=>{
                    that.listLoading = false;
                    that.$message.error("服务器错误！")
                });
            },
            //初始页page、初始每页数据数pageSize和数据data
            handleSizeChange(size) {
                if (size != this.pageSize) {
                    this.pageSize = size;
                    this.search();
                }
            },
            handleCurrentChange(val) {
                if (val != this.page) {
                    this.page = val;
                    this.search();
                }
            },
            //重置
            btnReset() {
                this.filters = {
                    goodsId: 0,
                    warehouseId:0,
                };
                this.search();
            },
            //新增
            btnNew() {
                let that = this;
                that.searchConsigneeInfo();
                that.addFormVisible = true;//打开新增页面
                let url = "/purchase/getOrderNumber";//获取订单号
                let param = {};
                this.post_url(url, param, "获取订单号失败！", null).then(function (res) {
                    that.addLoading = false;
                    console.info("获取订单号返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.addForm.orderNumber =res.data;
                    }else{
                        that.$message.error("获取订单号失败");
                    }
                }).catch(() => {
                    that.addLoading = false;
                    that.$message.error("获取订单号失败");
                });

            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        if(this.addForm.purchaseList.length<=0){
                            this.$message.info("请先新增物品！");
                            return;
                        }
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let that = this;
                            let url = "/purchase/applyForPurchase";//新增下单
                            let param = that.addForm;
                            this.post_url(url, param, "新增下单失败！", null).then(function (res) {
                                that.addLoading = false;
                                console.info("新增下单返回体",res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增下单成功");
                                    that.addFormVisible = false;
                                    that.$refs.addForm.resetFields();
                                    that.search();
                                }else{
                                    that.$message.error("新增库存失败");
                                }
                            }).catch(() => {
                                that.addLoading = false;
                                that.$message.error("新增库存失败");
                            });
                        });
                    }
                });
            },
            //提交编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let that = this;
                            let url = "/purchase/updatePurchase";//编辑提交
                            let param = that.editForm;
                            this.post_url(url, param, "修改订单失败！", null).then(function (res) {
                                that.editLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改订单成功");
                                    that.editFormVisible = false;
                                    that.$refs.editForm.resetFields();
                                    that.editForm = {};
                                    that.search();
                                } else {
                                    that.$message.error("修改订单失败");
                                }
                            }).catch(() => {
                                that.editLoading = false;
                                that.$message.error("服务器错误");
                            });
                        });
                    }
                });
            },
            /**
             * 搜索
             */
            btnSearch: function () {
                this.search();
            },

        },
    }
</script>

<style scoped>
    @page {
        size:auto;
        margin: 5.5mm 3mm 10mm 3mm; /* this affects the margin in the printer settings */
    }
    @media print {
        .noprint {
            display: none;
        }
    }
    .titleExpand{
        font-size: 20px;
        color: #0022ff
    }
    .demo-table-expand {
        font-size: 0;
        /*border:2px solid red ;*/
    }
    .demo-table-expand label {
        width: 100px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 80%;
    }
    .el-carousel__item el-image {
        color: #475669;
        opacity: 0.75;
        margin: 0;
    }
</style>