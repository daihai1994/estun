<template>
    <div>
        <!--工具条-->
        <el-col :span="24" style="padding-bottom: 0;">
            <el-form :inline="true" :model="filters">
                <el-form-item prop="name">
                    <el-input v-model="filters.name" placeholder="收货人" prefix-icon="el-icon-search" @keyup.enter.native="btnSearch()"></el-input>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="filters.addressLabel" placeholder="地址标签" prefix-icon="el-icon-search" @keyup.enter.native="btnSearch()"></el-input>
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
                ref="consigneeInfo"
                :data="consigneeInfoData"
                :header-cell-style="tableHeaderColor"
                border
                highlight-current-row
                @current-change="handleTableChange"
                style="width: 100%;" v-loading="listLoading">
            <el-table-column
                    prop="addressLabel"
                    sortable
                    label="地址标签">
            </el-table-column>
            <el-table-column
                    prop="name"
                    sortable
                    label="收货人">
            </el-table-column>
            <el-table-column
                    prop="address"
                    sortable
                    label="收货地址">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    sortable
                    label="收货号码">
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
        <el-dialog title="新增收货地址" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="收货人" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收货地址" prop="address">
                    <el-input v-model="addForm.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收货人号码" prop="phone">
                    <el-input v-model="addForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址标签" prop="addressLabel">
                    <el-input v-model="addForm.addressLabel" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑收货地址" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="收货人" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收货地址" prop="address">
                    <el-input v-model="editForm.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收货人号码" prop="phone">
                    <el-input v-model="editForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址标签" prop="addressLabel">
                    <el-input v-model="editForm.addressLabel" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'

    export default {
        name: "ConsigneeInfo",

        data() {
            return {
                page: 1,//当前页数
                pageSize: 10,//一页显示几条
                listLoading: false,//table加载loading等待
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,//编辑提交等待页面
                editFormRules: {//编辑页面不能为空
                    name: [{required: true, message: '请输入名称', trigger: 'blur'},],
                    address: [{required: true, message: '请输入收货地址', trigger: 'blur'},],
                    phone: [{required: true, message: '请输入收货人号码', trigger: 'blur'},],
                },
                //编辑界面数据
                editForm: {
                    name: '',
                    address: '',
                    phone: '',
                    addressLabel: '',
                    id: 0,
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待页面
                addFormRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'},],
                    address: [{required: true, message: '请输入收货地址', trigger: 'blur'},],
                    phone: [{required: true, message: '请输入收货人号码', trigger: 'blur'},],
                },
                //新增界面数据
                addForm: {
                    name: '',
                    address: '',
                    phone: '',
                    addressLabel: '',
                },
                //筛选条件
                filters: {
                    name: '',
                    addressLabel: '',
                },
                consigneeInfoData: [],//数据
                tableLength: 0,//数据总个数
                // 更改表头样式
                tableHeaderColor({rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                currentRow: {},//行数据
            }
        },
        methods: {
            //改变行选择事件
            handleTableChange(val) {
                let that = this;
                if (val != null) {
                    that.currentRow = val;
                }

            },
            //对是否失效处理
            effectiveHandle(row) {
                if (row.effective == 1) {
                    return '有效'
                } else {
                    return '无效'
                }
            },
            //查询供应商
            search: function () {
                let that = this;
                that.currentRow = {};
                let url = "/consigneeInfo/searchConsigneeInfos";
                let param = {
                    name: that.filters.name,
                    addressLabel: that.filters.addressLabel,
                    size: that.pageSize,// 每页的记录数（行数）
                    page: that.page//第几条开始
                };
                that.consigneeInfoData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询收货地址报错！", null).then(function (res) {
                    that.listLoading = false;
                    console.info("查询收货地址返回体", res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.consigneeInfoData = res.data.list;
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
                    name: "",
                    addressLabel: ""
                };
                this.search();
            },
            //新增
            btnNew() {
                let that = this;
                that.addFormVisible = true;//打开新增页面
                that.addForm = {
                    name: '',
                    address: '',
                    phone: '',
                    addressLabel: '',
                };//重置form信息
            },
            //删除
            btnDelete() {
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
                            id: this.currentRow.id//删除 收货地址ID
                        }
                        let url = "/consigneeInfo/deleteConsigneeInfo";//删除收货地址
                        this.post_url(url, param, "删除收货地址失败！", null).then(function (res) {
                            that.listLoading = false;
                            console.info("删除收货地址返回体", res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除收货地址成功");
                                that.currentRow = {};
                                that.search();
                            }
                        }).catch(() => {
                            that.listLoading = false;
                            that.$message.error("删除收货地址失败");
                        });
                    }).catch(() => {
                        that.listLoading = false;
                        that.$message.error("删除收货地址失败");
                    });
                }
            },
            //打开编辑页面
            btnEdit: function () {
                let that = this;
                if (this.currentRow.id == null) {
                    this.$alert('请选择要编辑的数据', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    that.editFormVisible = true;//打开新增页面
                    that.editForm = {
                        name: this.currentRow.name,//名称
                        address: this.currentRow.address,//地址
                        phone: this.currentRow.phone,
                        id: this.currentRow.id,
                        addressLabel: this.currentRow.addressLabel,
                    };
                }
            },
            //提交编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let that = this;
                            let url = "/consigneeInfo/updateConsigneeInfo";//编辑提交
                            let param = that.editForm;
                            this.post_url(url, param, "修改收货地址失败！", null).then(function (res) {
                                that.editLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改收货地址成功");
                                    that.editFormVisible = false;
                                    that.editForm = {};
                                    that.currentRow = {};
                                    that.search();
                                } else {
                                    that.$message.error("修改收货地址失败");
                                }
                            }).catch(() => {
                                that.editLoading = false;
                                that.$message.error("修改收货地址失败");
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let that = this;
                            let url = "/consigneeInfo/addConsigneeInfo";//新增收货地址
                            let param = that.addForm;
                            this.post_url(url, param, "新增收货地址败！", null).then(function (res) {
                                that.addLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增收货地址成功");
                                    that.addFormVisible = false;
                                    that.addForm = {};
                                    that.search();
                                } else {
                                    that.$message.error("新增收货地址失败");
                                }
                            }).catch(() => {
                                that.editLoading = false;
                                that.$message.error("新增收货地址失败");
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
        mounted() {
            this.search();
        }
    }
</script>

<style scoped>
</style>