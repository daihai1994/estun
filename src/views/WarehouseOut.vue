<template>
    <div>
        <!--工具条-->
        <el-col :span="24"  style="padding-bottom: 0;">
            <el-form :inline="true" :model="filters" >
                <el-form-item prop="orderNumber">
                    <el-input v-model="filters.applicant" placeholder="申请人"  prefix-icon="el-icon-search" style="width: 150px" @keyup.enter.native="btnSearch()"></el-input>
                </el-form-item>
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
                        <el-dropdown-item @click.native="btnEdit">编辑</el-dropdown-item>
                        <el-dropdown-item @click.native="btnDelete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form>
        </el-col>
        <el-table
                ref="warehouseOut"
                :data="warehouseOutData"
                :header-cell-style="tableHeaderColor"
                border
                highlight-current-row
                @current-change="handleTableChange"
                style="width: 100%;" v-loading="listLoading">
            <el-table-column
                    prop="applicant"
                    sortable
                    label="申请人">
            </el-table-column>
            <el-table-column
                    prop="applicantTime"
                    sortable
                    label="申请时间">
            </el-table-column>
            <el-table-column
                    prop="goodsName"
                    sortable
                    label="物品">
            </el-table-column>
            <el-table-column
                    prop="warehouseName"
                    sortable
                    label="仓库">
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    sortable
                    label="个数">
            </el-table-column>
            <el-table-column
                    prop="remarks"
                    sortable
                    label="备注">
            </el-table-column>
            <el-table-column
                    prop="operatorName"
                    sortable
                    label="操作人">
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" >
            <el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="tableLength" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增界面-->
        <el-dialog v-dialogDrag title="新增出库信息" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="申请人" prop="applicant">
                    <el-input  v-model="addForm.applicant" auto-complete="off" style="width: 217px" placeholder="清输入申请人"></el-input>
                </el-form-item>
                <el-form-item label="仓库" prop="warehouseId" >
                    <el-select v-model="addForm.warehouseId" filterable placeholder="请选择" @change="warehouseChange">
                        <el-option
                                v-for="item in warehouseList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物品" prop="goodsId" >
                    <el-select v-model="addForm.goodsId" filterable placeholder="请选择">
                        <el-option
                                v-for="item in goodsList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" prop="quantity" >
                    <el-input-number v-model="addForm.quantity" style="width: 217px" auto-complete="off"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="addForm.remarks"  auto-complete="off" rows="2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{addLoading?'提交中...':'确定'}}</el-button>
            </div>
        </el-dialog>

        <!--修改界面-->
        <el-dialog v-dialogDrag title="修改出库信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="申请人" prop="applicant">
                    <el-input  v-model="editForm.applicant" auto-complete="off" style="width: 217px" placeholder="清输入申请人"></el-input>
                </el-form-item>
                <el-form-item label="仓库" prop="warehouseId" >
                    <el-select v-model="editForm.warehouseId" filterable placeholder="请选择" @change="warehouseChange">
                        <el-option
                                v-for="item in warehouseList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物品" prop="goodsId" >
                    <el-select v-model="editForm.goodsId" filterable placeholder="请选择">
                        <el-option
                                v-for="item in goodsList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" prop="quantity" >
                    <el-input-number v-model="editForm.quantity" style="width: 217px" auto-complete="off"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="editForm.remarks"  auto-complete="off" rows="2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{editLoading?'提交中...':'确定'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'
    export default {
        name: "WarehouseOut",

        data(){
            return {
                printObj: {
                    id: "printTest",
                    popTitle: '苏州中本硕机电工程有限公司'
                },
                page: 1,//当前页数
                pageSize:10,//一页显示几条
                listLoading: false,//table加载loading等待
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待页面

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,//编辑提交等待页面
                //新增界面数据
                addForm: {
                    applicant:'',
                    goodsId:"",
                    warehouseId: '',
                    quantity: '',
                    remarks: '',
                },
                //编辑界面数据
                editForm: {
                    applicant:'',
                    goodsId:"",
                    warehouseId: '',
                    quantity: '',
                    remarks: '',
                    id:'',
                    oldGoodsId:'',
                    oldWarehouseId:'',
                    oldQuantity:''
                },
                addFormRules: {
                    applicant: [{required: true, message: '请输入申请人', trigger: 'blur'},],
                    goodsId: [{required: true, message: '请选择物品', trigger: 'change'},],
                    warehouseId: [{required: true, message: '请选择仓库', trigger: 'change'},],
                    quantity: [{required: true, message: '请输入数量', trigger: 'blur'},],
                    remarks: [{required: true, message: '请输入备注', trigger: 'blur'},],
                },
                editFormRules: {
                    applicant: [{required: true, message: '请输入申请人', trigger: 'blur'},],
                    goodsId: [{required: true, message: '请选择物品', trigger: 'change'},],
                    warehouseId: [{required: true, message: '请选择仓库', trigger: 'change'},],
                    quantity: [{required: true, message: '请输入数量', trigger: 'blur'},],
                    remarks: [{required: true, message: '请输入备注', trigger: 'blur'},],
                },
                //筛选条件
                filters: {
                    applicant:'',//申请人
                    goodsId:0,
                    warehouseId:0,
                    times:[],
                    bt:"",
                    et:"",

                },
                warehouseOutData: [],//数据
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
                goodsListAll:[],//物品选择
                warehouseListAll:[],//仓库选择
            }
        },
        mounted(){
            let timestampBt = this.defaultTime(new Date(),-30);
            let timestampEt = new Date().getTime();
            this.filters.startTime = this.timestampToTime(timestampBt);
            this.filters.endTime = this.timestampToTime(timestampEt);
            this.filters.times.push(timestampBt);
            this.filters.times.push(timestampEt);
            this.searchGoodsList();
            this.searchWarehouseList();
            this.search();
        },
        methods: {
            //新增页面的打开
            btnNew(){
               let that = this;
                that.addFormVisible = true;
                that.addForm = {
                        applicant:'',
                        goodsId:"",
                        warehouseId: '',
                        quantity: '',
                        remarks: '',
                };
                this.searchWarehouseList();
            },
            //编辑页面打开
            btnEdit(){
                let that = this;
                if (this.currentRow.id == null) {
                    this.$alert('请选择要编辑的数据', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    that.editFormVisible = true;//打开新增页面
                    that.editForm = {
                        applicant:this.currentRow.applicant,
                        goodsId:this.currentRow.goodsId,
                        warehouseId: this.currentRow.warehouseId,
                        quantity: this.currentRow.quantity,
                        remarks: this.currentRow.remarks,
                        id:this.currentRow.id,
                        oldGoodsId:this.currentRow.goodsId,
                        oldWarehouseId:this.currentRow.warehouseId,
                        oldQuantity:this.currentRow.quantity,
                    };
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
            /*时间段输入框值发生改变时触发 value：当前输入框值*/
            timeChange(value) {
                let that = this;
                if(value==null){
                    that.filters.bt = '';
                    that.filters.et = '';
                }else {
                    let articleNum = ''
                    let type = ''
                    if (type !== " ") {
                        type = this.type
                    }
                    if (this.articleNum !== " ") {
                        articleNum = this.articleNum
                    }
                    let bt = ''
                    let et = ''
                    if (this.times != null) {
                        bt = value[0]
                        et = value[1]
                    }
                    that.filters.bt = this.timestampToTime(value[0]);
                    that.filters.et = this.timestampToTime(value[1]);
                    console.info("开始时间",that.filters.bt);
                    console.info("结束时间",that.filters.et);
                    this.btnSearch();
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
                        let allList = JSON.parse(JSON.stringify(res.data))
                        let all = {
                            id: 0,
                            name: '全部'
                        }
                        allList.unshift(all);
                        that.warehouseListAll = allList;
                    }

                }).catch(() => {
                    that.$message.error("服务器错误！")
                });
            },
            warehouseChange(row){
                console.info("改变仓库选择事件",row);
                let that = this;
                let url = "/goods/searchAllGoodsWarehouse";
                let param = {
                    warehouseId:row
                };
                if(that.addFormVisible){
                    that.addForm.goodsId = "";
                }else{
                    that.editForm.goodsId = "";
                }

                that.goodsList = [];
                this.post_url(url, param, "根据仓库查询全部物品失败！", null).then(function (res) {
                    console.info("根据仓库查询全部物品返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.goodsList = res.data;
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
                        that.goodsList = res.data;
                        let allList = JSON.parse(JSON.stringify(res.data))
                        let all = {
                            id: 0,
                            name: '全部'
                        }
                        allList.unshift(all);
                        that.goodsListAll = allList;

                    }

                }).catch(()=>{
                    that.$message.error("服务器错误！")
                });
            },
            //查询库存信息
            search: function () {
                let that = this;
                let url = "/warehouseOut/searchWarehouseOut";
                that.currentRow = {};
                let param = {
                    applicant:that.filters.applicant,
                    goodsId:that.filters.goodsId,
                    warehouseId:that.filters.warehouseId,
                    bt:that.filters.bt,
                    et:that.filters.et,
                    size: that.pageSize,// 每页的记录数（行数）
                    page: that.page//第几条开始
                };
                that.warehouseOutData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询出库信息失败！", null).then(function (res) {
                    that.listLoading = false;
                    console.info("查询出库信息返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.warehouseOutData = res.data.list;
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
                    applicant:'',//申请人
                    goodsId:0,
                    warehouseId:0,
                    times:[],
                    bt:"",
                    et:"",
                };
                this.search();
            },
            /**
             * 搜索
             */
            btnSearch: function () {
                this.search();
            },
            //提交编辑
            editSubmit:function(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let that = this;
                            let url = "/warehouseOut/updateWarehouseOut";//编辑出库信息
                            let param = that.editForm;
                            this.post_url(url, param, "编辑出库信息失败！", null).then(function (res) {
                                that.addLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("编辑出库信息成功");
                                    that.editFormVisible = false;
                                    that.editForm = {
                                        applicant:'',
                                        goodsId:"",
                                        warehouseId: '',
                                        quantity: '',
                                        remarks: '',
                                        id:'',
                                        oldGoodsId:'',
                                        oldWarehouseId:'',
                                        oldQuantity:''
                                    };
                                    that.search();
                                } else {
                                    that.$message.error("编辑出库信息失败");
                                }
                            }).catch(() => {
                                that.addLoading = false;
                                that.$message.error("编辑出库信息失败");
                            });
                        });
                    }
                });
            },
            //提交新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let that = this;
                            let url = "/warehouseOut/addWarehouseOut";//新增出库信息
                            let param = that.addForm;
                            this.post_url(url, param, "新增出库信息失败！", null).then(function (res) {
                                that.addLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增出库信息成功");
                                    that.addFormVisible = false;
                                    that.addForm = {
                                        applicant:'',
                                        goodsId:"",
                                        warehouseId: '',
                                        quantity: '',
                                        remarks: '',
                                    };
                                    that.search();
                                } else {
                                    that.$message.error("新增出库信息失败");
                                }
                            }).catch(() => {
                                that.addLoading = false;
                                that.$message.error("新增出库信息失败");
                            });
                        });
                    }
                });
            },
            btnDelete(){
                let that = this;
                let ids = this.currentRow.id;
                if (ids == '' || ids == null) {
                    this.$alert('请选择要删除的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        that.listLoading = true;
                        let param = {
                            id: this.currentRow.id,//删除 出库ID
                            oldGoodsId:this.currentRow.goodsId,
                            oldWarehouseId:this.currentRow.warehouseId,
                            oldQuantity:this.currentRow.quantity,
                        }
                        let url = "/warehouseOut/deleteWarehouseOut";//删除收货地址
                        this.post_url(url, param, "删除出库信息失败！", null).then(function (res) {
                            that.listLoading = false;
                            console.info("删除出库信息返回体", res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除出库信息成功");
                                that.currentRow = {};
                                that.search();
                            }
                        }).catch(() => {
                            that.listLoading = false;
                            that.$message.error("删除出库信息失败");
                        });
                    }).catch(() => {
                        that.listLoading = false;
                        that.$message.error("删除出库信息失败");
                    });
                }
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