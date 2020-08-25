<template>
    <div>
        <!--工具条-->
        <el-col :span="24"  style="padding-bottom: 0;">
            <el-form :inline="true" :model="filters" >
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
                <el-form-item prop="approverId">
                    <el-input v-model="filters.approverId" placeholder="审批人"  prefix-icon="el-icon-search" style="width: 150px" @keyup.enter.native="btnSearch()"></el-input>
                </el-form-item>
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
            </el-form>
        </el-col>
        <el-table
                ref="order"
                :data="orderData"
                :header-cell-style="tableHeaderColor"
                border
                highlight-current-row
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
                    </el-table>
                    <el-form :inline="true" >
                        <el-form-item style="margin-left: 50px">
                            申 请 人:{{date.row.applicantName}}
                        </el-form-item>
                        <el-form-item style="float: right;margin-right: 50px">
                            审 批 人: {{date.row.approverName}}
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
                    <el-button type="text" @click="approveClick(scope.row)" size="small">审批</el-button>
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
        <!--审批界面-->
        <el-dialog title="审批订单" :visible.sync="approveFormVisible"  :close-on-click-modal="false">
            <el-form :model="approveForm" :rules="approveFormRules" label-width="100px"  ref="approveForm">
                <el-form-item label="订单号" >
                    <el-input v-model="approveForm.orderNumber" style="width:217px;margin-right: 10px " disabled auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="审批意见" >
                    <el-input type="textarea" style="width:325px;margin-right: 10px " v-model="approveForm.comments" auto-complete="off" rows="2"></el-input>
                </el-form-item>
                <el-form-item label="审批状态" >
                    <el-select v-model="approveForm.statusId"  filterable placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="approveFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{addLoading?'提交中...':'确定'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'
    export default {
        name: "Approve",

        data(){
            return {
                //有效，无效，全部select
                options: [{
                    value: 2,
                    label: '通过'
                }, {
                    value: 3,
                    label: '拒绝'
                }, {
                    value: 4,
                    label: '驳回带修改'
                }],
                printObj: {
                    id: "printTest",
                    popTitle: '苏州中本硕机电工程有限公司'
                },
                page: 1,//当前页数
                pageSize:10,//一页显示几条
                listLoading: false,//table加载loading等待
                printingVisible: false,//打印页面
                addLoading:false,
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
                approveForm:{
                    orderNumber:'',
                    comments:'',
                    statusId:'',
                },
                approveFormRules: {
                    orderNumber: [{ required: true, message: '订单号不能为空', trigger: 'change' },],
                    comments: [{ required: true, message: '审批意见不能为空', trigger: 'blur' },],
                    statusId: [{ required: true, message: '审批状态不能为空', trigger: 'change' },]
                },
                orderData: [],//数据
                tableLength:0,//数据总个数
                // 更改表头样式
                tableHeaderColor ({ rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                statusList:[],//状态表信息
                printOrderList:[],//打印页面的list
                approveFormVisible:false,
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
            this.search();
        },
        methods: {
            //审批提交按钮
            addSubmit(){
                let that = this;
                that.addLoading = true;
                let url = "/purchase/approveForOrder";
                let param = that.approveForm;
                this.post_url(url, param, "审批订单失败！", null).then(function (res) {
                    that.addLoading = false;
                    console.info("审批订单返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.approveFormVisible = false;
                        that.search();
                        that.$message.success("提交成功")
                    }

                }).catch(()=>{
                    that.addLoading = false;
                    that.$message.error("服务器错误！")
                });
            },
            //审批按钮
            approveClick(row){
                this.approveFormVisible = true;
                this.approveForm={
                    orderNumber:row.orderNumber,
                        comments:'',
                        statusId:'',
                };
            },
            //打印页面
            printingClick(row){
                console.info("打印数据",row);
                this.printingVisible = true;
                this.printOrderList = row;
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
                this.btnSearch();
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