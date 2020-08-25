<template>
    <div>
        <!--工具条-->
        <el-col :span="24"  style="padding-bottom: 0;">
            <el-form :inline="true" :model="filters" >
                <el-form-item prop="orderNumber">
                    <el-input v-model="filters.orderNumber" placeholder="订单号"  prefix-icon="el-icon-search" style="width: 150px" @keyup.enter.native="btnSearch()"></el-input>
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
                ref="warehousing"
                :data="warehousingData"
                :header-cell-style="tableHeaderColor"
                border
                highlight-current-row
                @current-change="handleTableChange"
                style="width: 100%;" v-loading="listLoading">
            <el-table-column type="expand">
                <template slot-scope="date">
                    <el-table
                            :data="date.row.goodsList"
                            :header-cell-style="tableHeaderColor"
                            border
                            highlight-current-row
                            style="width: 100%;">
                        <el-table-column
                                prop="goods"
                                sortable
                                label="物品">
                        </el-table-column>
                        <el-table-column
                                prop="quantity"
                                sortable
                                label="数量">
                        </el-table-column>
                        <el-table-column
                                prop="unitPrice"
                                sortable
                                label="单价">
                        </el-table-column>
                        <el-table-column
                                prop="realPrice"
                                sortable
                                label="实收单价">
                        </el-table-column>
                        <el-table-column
                                prop="totalPrice"
                                sortable
                                label="总价">
                        </el-table-column>
                        <el-table-column
                                prop="statusId"
                                sortable
                                label="入库状态"
                                :formatter="warehousingStatusId">
                        </el-table-column>
                        <el-table-column
                                prop="stockRemarks"
                                sortable
                                label="操作备注">
                        </el-table-column>
                        <el-table-column
                                prop="stockCreateTime"
                                sortable
                                label="操作时间">
                        </el-table-column>
                        <el-table-column
                                prop="operatorName"
                                sortable
                                label="操作人">
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="warehousingClick(scope.row)" size="small">入库</el-button>
                                <el-button type="text" @click="withdrawClick(scope.row)" size="small">撤回</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                    prop="orderNumber"
                    sortable
                    label="订单号">
            </el-table-column>
            <el-table-column
                    prop="logisticsNumber"
                    sortable
                    label="快递单号">
            </el-table-column>
            <el-table-column
                    prop="deliveryTime"
                    sortable
                    label="发货时间">
            </el-table-column>
            <el-table-column
                    prop="statusId"
                    sortable
                    label="状态"
                    :formatter="analysisLogisticsStatus">
            </el-table-column>
            <el-table-column
                    prop="logisticsCompany"
                    sortable
                    label="物流公司">
            </el-table-column>
            <el-table-column
                    prop="totalPrice"
                    sortable
                    label="总价">
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" >
            <el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="tableLength" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增界面-->
        <el-dialog v-dialogDrag title="新增库存" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="状态" prop="statusId">
                    <el-select v-model="addForm.statusId" filterable placeholder="请选择" @change="statusIdChange">
                        <el-option
                                v-for="item in statusList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物品" prop="goodsId" :hidden="hidden">
                    <el-select v-model="addForm.goodsId" filterable placeholder="请选择" disabled>
                        <el-option
                                v-for="item in goodsList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库" prop="warehouseId" :hidden="hidden">
                    <el-select v-model="addForm.warehouseId" filterable placeholder="请选择">
                        <el-option
                                v-for="item in warehouseList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" prop="quantity" :hidden="hidden">
                    <el-input-number v-model="addForm.quantity" disabled auto-complete="off"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="reason">
                    <el-input type="textarea" v-model="addForm.reason" auto-complete="off" rows="2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{addLoading?'提交中...':'确定'}}</el-button>
            </div>
        </el-dialog>

        <!--撤回界面-->
        <el-dialog v-dialogDrag title="撤回库存" :visible.sync="withdrawFormVisible" :close-on-click-modal="false">
            <el-form :model="withdrawForm" label-width="100px" :rules="withdrawFormRules" ref="withdrawForm">
                <el-form-item label="备注" prop="reason">
                    <el-input type="textarea" v-model="withdrawForm.reason" auto-complete="off" rows="2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="withdrawFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="withdrawSubmit" :loading="withdrawLoading">{{withdrawLoading?'提交中...':'确定'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'
    export default {
        name: "Warehousing",

        data(){
            return {
                printObj: {
                    id: "printTest",
                    popTitle: '苏州中本硕机电工程有限公司'
                },
                page: 1,//当前页数
                pageSize:10,//一页显示几条
                listLoading: false,//table加载loading等待
                hidden:false,
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待页面
                withdrawFormVisible:false,//撤回界面是否显示
                withdrawLoading:false,//撤回界面提交等待
                //撤回界面数据对象
                withdrawForm:{
                   stockId:'',
                   quantity:'',
                   uuid:'',
                   reason:'',
                },
                //撤回界面规则
                withdrawFormRules:{
                    reason: [{required: true, message: '请输入备注', trigger: 'blur'},],
                },
                //新增界面数据
                addForm: {
                    statusId:'',
                    uuid:"",
                    goodsId: '',
                    warehouseId: '',
                    quantity: '',
                    reason: '',
                },
                statusList: [{
                    value: 1,
                    label: '入库'
                }, {
                    value: 2,
                    label: '占不入库'
                },],
                addFormRules: {
                    goodsId: [{required: true, message: '请选择物品', trigger: 'change'},],
                    warehouseId: [{required: true, message: '请选择仓库', trigger: 'change'},],
                    quantity: [{required: true, message: '请输入数量', trigger: 'blur'},],
                    reason: [{required: true, message: '请输入备注', trigger: 'blur'},],
                },
                //筛选条件
                filters: {
                    orderNumber:'',//订单号
                },
                warehousingData: [],//数据
                tableLength:0,//数据总个数
                // 更改表头样式
                tableHeaderColor ({ rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                currentRow:{},//行数据
                goodsList:[],//物品选择
                warehouseList:[],//仓库选择
            }
        },
        mounted(){
            this.search();
        },
        methods: {
            statusIdChange(row){
                if(row==1){
                    this.hidden = false;
                }else{
                    this.hidden = true;
                }
            },
            warehousingStatusId(row){
                if (row.statusId == 0) {
                    return "未处理";
                }else if(row.statusId == 1){
                    return "入库成功";
                }else if(row.statusId == 2){
                    return "占不入库";
                }else if(row.statusId == 3){
                    return "撤回入库";
                }
            },
            analysisLogisticsStatus(row) {
                if (row.statusId == 1) {
                    return "发货中";
                } else if (row.statusId == 2) {
                    return "退货";
                } else if (row.statusId == 3) {
                    return "入库成功";
                } else if (row.statusId == 4) {
                    return "入库失败";
                } else if (row.statusId == 5) {
                    return "取消";
                }else if (row.statusId == 6) {
                    return "部分入库";
                }
            },
            //改变行选择事件
            handleTableChange(val){
                let that = this;
                console.info("点击行的数据",val);
                if(val!=null){
                    that.currentRow = val;
                }

            },
            //查询全部仓库
            searchWarehouseList: function () {
                let that = this;
                let url = "/warehouse/searchAllWarehouses";
                let param = {};
                that.warehouseList = [];
                this.post_url(url, param, "查询全部仓库失败！", null).then(function (res) {
                    console.info("查询全部仓库返回体", res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.warehouseList = res.data;
                    }

                }).catch(() => {
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
                        that.goodsList = res.data;
                    }

                }).catch(()=>{
                    that.$message.error("服务器错误！")
                });
            },
            //查询库存信息
            search: function () {
                let that = this;
                let url = "/warehousing/searchLogistics";
                that.currentRow = {};
                let param = {
                    orderNumber:that.filters.orderNumber,//订单号
                    size: that.pageSize,// 每页的记录数（行数）
                    page: that.page//第几条开始
                };
                that.warehousingData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询入库信息失败！", null).then(function (res) {
                    that.listLoading = false;
                    console.info("查询入库信息返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.warehousingData = res.data.list;
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
            //点击撤回
            withdrawClick(row){
                let that= this
                if(row.statusId ==1){
                    that.withdrawFormVisible = true;
                    that.withdrawForm = {
                        stockId:row.stockId,
                        quantity:row.quantity,
                        uuid:row.uuid,
                        reason:""
                    }
                }else{
                    this.$alert('当前信息占未入库，无法撤回！', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }
            },
            //点击入库
            warehousingClick(row){
                console.info("点击入库信息",row);
                if(row.statusId ==1){
                    this.$alert('当前信息已经入库！', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }else{
                    let that = this;
                    that.searchGoodsList();
                    that.searchWarehouseList();
                    that.addFormVisible = true;//打开新增页面
                    that.addForm = {
                        logisticsId:row.logisticsId,
                        statusId:1,
                        uuid:row.uuid,
                        goodsId: row.goodsId,
                        warehouseId: '',
                        quantity: row.quantity,
                        reason: '',
                    };//重置form信息
                }
            },
            withdrawSubmit:function(){
                this.$refs.withdrawForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认撤回吗？', '提示', {}).then(() => {
                            this.withdrawLoading = true;
                            let that = this;
                            let url = "/stock/withdrawStock";//撤回库存
                            let param = that.withdrawForm;
                            this.post_url(url, param, "撤回失败！", null).then(function (res) {
                                that.withdrawLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("撤回成功");
                                    that.withdrawFormVisible = false;
                                    that.withdrawForm = {
                                        stockId:"",
                                        quantity:'',
                                        uuid:'',
                                        reason:""
                                    };
                                    that.search();
                                } else {
                                    that.$message.error("撤回失败");
                                }
                            }).catch(() => {
                                that.withdrawLoading = false;
                                that.$message.error("撤回失败");
                            });
                        });
                    }
                });
            },
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let that = this;
                            let url = "/stock/modifyWarehousingStock";//新增库存
                            let param = that.addForm;
                            this.post_url(url, param, "新增库存失败！", null).then(function (res) {
                                that.addLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增库存成功");
                                    that.addFormVisible = false;
                                    that.addForm = {
                                        uuid:'',
                                        goodsId: '',
                                        warehouseId: '',
                                        quantity: '',
                                        reason: ''
                                    };
                                    that.search();
                                } else {
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