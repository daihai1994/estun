<template>
    <div>
        <!--工具条-->
        <el-col :span="24" style="padding-bottom: 0;">
            <el-form :inline="true" :model="filters">
                <el-form-item prop="goodsId">
                    <el-select v-model="filters.goodsId" filterable placeholder="请选择" @change="btnSearch">
                        <el-option
                                v-for="item in goodsListAll"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="warehouseId">
                    <el-select v-model="filters.warehouseId" filterable placeholder="请选择" @change="btnSearch">
                        <el-option
                                v-for="item in warehouseListAll"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
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
                ref="stock"
                :data="stockData"
                :header-cell-style="tableHeaderColor"
                border
                highlight-current-row
                @current-change="handleTableChange"
                style="width: 100%;" v-loading="listLoading">
            <el-table-column type="expand">
                <template slot-scope="date">
                    <el-table
                            :data="date.row.inventoryList"
                            :header-cell-style="tableHeaderColor"
                            border
                            highlight-current-row
                            style="width: 100%;">
                        <el-table-column
                                prop="quantity"
                                sortable
                                label="库存数量">
                        </el-table-column>
                        <el-table-column
                                prop="realityQuantity"
                                sortable
                                label="盘点数量">
                        </el-table-column>
                        <el-table-column
                                prop="inventoryTime"
                                sortable
                                label="盘点月份">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                sortable
                                label="状态">
                        </el-table-column>
                        <el-table-column
                                prop="remarks"
                                sortable
                                label="盘点备注">
                        </el-table-column>
                        <el-table-column
                                prop="operationName"
                                sortable
                                label="盘点人">
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="inventoryUpdate(scope.row)" size="small">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                    prop="goods.name"
                    sortable
                    label="物品名称">
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    sortable
                    label="物品数量">
            </el-table-column>
            <el-table-column
                    prop="warehouse.name"
                    sortable
                    label="仓库名称">
            </el-table-column>
            <el-table-column
                    prop="warehouse.address"
                    sortable
                    label="仓库地址">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="inventoryStock(scope.row)" size="small">当月盘点</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                           :total="tableLength" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增界面-->
        <el-dialog v-dialogDrag title="库存盘点" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="状态" prop="statusId">
                    <el-select v-model="addForm.statusId" filterable placeholder="请选择">
                        <el-option
                                v-for="item in statusList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" prop="quantity">
                    <el-input-number v-model="addForm.quantity" auto-complete="off"></el-input-number>
                </el-form-item>
                <el-form-item label="盘点数量" prop="realityQuantity">
                    <el-input-number :min="1" v-model="addForm.realityQuantity" auto-complete="off"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="addForm.remarks" auto-complete="off" rows="2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'
    import formatTime from '../utils/formatTime.js'

    export default {
        name: "Inventory",

        data() {
            return {
                page: 1,//当前页数
                pageSize: 10,//一页显示几条
                listLoading: false,//table加载loading等待
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待页面
                addFormRules: {
                    statusId: [{required: true, message: '请选择状态', trigger: 'change'},],
                    quantity: [{required: true, message: '请输入数量', trigger: 'blur'},],
                    remarks: [{required: true, message: '请输入备注', trigger: 'blur'},],
                    realityQuantity: [{required: true, message: '请输入盘点数量', trigger: 'blur'},],
                },
                //新增界面数据
                addForm: {
                    statusId: '',
                    quantity: '',
                    realityQuantity: '',
                    remarks:'',
                    stockId:'',
                },
                //筛选条件
                filters: {
                    goodsId: 0,
                    warehouseId: 0,
                },
                stockData: [],//数据
                tableLength: 0,//数据总个数
                // 更改表头样式
                tableHeaderColor({rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                currentRow: {},//行数据
                goodsList: [],//物品选择
                warehouseList: [],//仓库选择

                goodsListAll: [],//物品选择
                warehouseListAll: [],//仓库选择

                statusList:[
                    {
                     id:1,
                     name:'正常'
                    },
                    {
                        id:2,
                        name:'多余'
                    },
                    {
                        id:3,
                        name:'少于'
                    },
                ],//状态list
            }
        },
        mounted() {
            this.searchGoodsList();
            this.searchWarehouseList();
            this.search();
        },
        methods: {
            //对某一行展开或者关闭的时候触发
            // expandChange(row,expandedRows){
            //     debugger
            // },
            inventoryUpdate(row){
                console.info(row);
                if(row!=null){
                    this.addLoading = false;
                    this.addForm= {
                        statusId: row.statusId,
                        quantity: row.quantity,
                        realityQuantity: row.realityQuantity,
                        remarks:row.remarks,
                        id:row.id,
                        stockId:null,
                    }
                    this.addFormVisible = true;
                }
            },
            //当月盘点
            inventoryStock(row){
                console.info(row);
                if(row!=null){
                    let ym = formatTime.getDateYM();
                    console.info(ym);
                    let result = true;
                    let inventoryList = row.inventoryList;
                    for(let i = 0;i<inventoryList.length;i++){
                        if(inventoryList[i].inventoryTime==ym){
                            result = false;
                            break;
                        }
                    }
                    if(result){
                        this.addLoading = false;
                        this.addForm= {
                            id:null,
                            statusId: this.statusList[0].id,
                            quantity: row.quantity,
                            realityQuantity: '',
                            remarks:'',
                            stockId:row.id,
                        }
                        this.addFormVisible = true;
                    }else{
                        this.$message.warning("当前月份已盘点，无需再盘点！")
                    }

                }
            },
            //改变行选择事件
            handleTableChange(val) {
                let that = this;
                if (val != null) {
                    that.currentRow = val;
                }

            },
            //查询全部物品
            searchGoodsList: function () {
                let that = this;
                let url = "/goods/searchAllGoods";
                let param = {};
                that.goodsList = [];
                this.post_url(url, param, "查询全部物品失败！", null).then(function (res) {
                    console.info("查询全部物品返回体", res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.goodsList = res.data;
                        let allList = JSON.parse(JSON.stringify(res.data))
                        let all = {
                            id: 0,
                            name: '全部'
                        }
                        allList.unshift(all);
                        that.goodsListAll = allList;
                    }

                }).catch(() => {
                    that.listLoading = false;
                    that.$message.error("服务器错误！")
                });
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
                        let allList = JSON.parse(JSON.stringify(res.data))
                        let all = {
                            id: 0,
                            name: '全部'
                        }
                        allList.unshift(all);
                        that.warehouseListAll = allList;
                    }

                }).catch(() => {
                    that.listLoading = false;
                    that.$message.error("服务器错误！")
                });
            },
            //查询库存信息
            search: function () {
                let that = this;
                let url = "/stock/searchStock";
                let param = {
                    goodsId: that.filters.goodsId,
                    warehouseId: that.filters.warehouseId,
                    size: that.pageSize,// 每页的记录数（行数）
                    page: that.page//第几条开始
                };
                that.stockData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询库存信息失败！", null).then(function (res) {
                    that.listLoading = false;
                    console.info("查询库存信息返回体", res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.stockData = res.data.list;
                        that.tableLength = res.data.total;
                    }

                }).catch(() => {
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
                    warehouseId: 0,
                };
                this.search();
            },
            //新增
            btnNew() {
                let that = this;
                that.addFormVisible = true;//打开新增页面
                that.addForm = {
                    goodsId: '',
                    warehouseId: '',
                    quantity: '',
                    reason: '',
                };//重置form信息
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let that = this;
                            let url = "";
                            if(that.addForm.id==null||that.addForm.id==''){
                                 url = "/inventory/addInventory";//新增当月盘点
                            }else{
                                 url = "/inventory/updateInventory";//修改当月盘点
                            }

                            let param = that.addForm;
                            this.post_url(url, param, "操作失败！", null).then(function (res) {
                                that.addLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("操作成功");
                                    that.addFormVisible = false;
                                    that.search();
                                } else {
                                    that.$message.error("操作失败");
                                }
                            }).catch(() => {
                                that.addLoading = false;
                                that.$message.error("操作失败");
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
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 100px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 40%;
    }

    .el-carousel__item el-image {
        color: #475669;
        opacity: 0.75;
        margin: 0;
    }
</style>