<template>
    <div>
        <!--工具条-->
        <el-col :span="24" style="padding-bottom: 0;">
            <el-form :inline="true" :model="filters">
                <el-form-item prop="name">
                    <el-input v-model="filters.name" placeholder="供应商名称" prefix-icon="el-icon-search" @keyup.enter.native="btnSearch()"></el-input>
                </el-form-item>
                <el-form-item prop="effective" style="margin-right: 10px">
                    <el-select v-model="filters.effective" placeholder="请选择" style="width: 100px" @change="btnSearch()">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-dropdown split-button type="primary" @click="btnSearch" trigger="click" style="margin-right: 10px">
                    搜索
                    <el-dropdown-menu slot="dropdown" trigger="click">
                        <el-dropdown-item @click.native="btnReset">重置</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown split-button type="primary" @click="btnNew" trigger="click" style="margin-right: 10px">
                    新增
                    <el-dropdown-menu slot="dropdown" trigger="click">
                        <el-dropdown-item @click.native="btnEdit">编辑</el-dropdown-item>
                        <el-dropdown-item @click.native="btnDelete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown split-button type="primary" @click="file" trigger="click" style="margin-right: 10px">
                    文件上传
                    <el-dropdown-menu slot="dropdown" trigger="click">
                        <el-dropdown-item @click.native="addSupplierExcelTemplate">下载导入模板</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown split-button type="primary" @click="exportAll" trigger="click" style="margin-right: 10px">
                    全部导出
                    <el-dropdown-menu slot="dropdown" trigger="click">
                        <el-dropdown-item @click.native="filterExport">条件导出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form>
        </el-col>
        <el-table
                ref="supplier"
                :data="supplierData"
                :header-cell-style="tableHeaderColor"
                border
                highlight-current-row
                @current-change="handleTableChange"
                style="width: 100%;" v-loading="listLoading">
            <el-table-column
                    prop="name"
                    sortable
                    label="名称">
            </el-table-column>
            <el-table-column
                    prop="address"
                    sortable
                    label="地址">
            </el-table-column>
            <el-table-column
                    prop="contact"
                    sortable
                    label="联系人">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    sortable
                    label="联系电话">
            </el-table-column>
            <el-table-column
                    prop="effective"
                    label="状态"
                    :formatter="effectiveHandle">
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
        <el-dialog title="新增供货商" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="供应商名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="供应商地址" prop="address">
                    <el-input v-model="addForm.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="addForm.contact" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="addForm.phone" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑供货商" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="供应商名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="供应商地址" prop="address">
                    <el-input v-model="editForm.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="editForm.contact" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="editForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否有效" prop="effective">
                    <el-select v-model="editForm.effective" placeholder="请选择">
                        <el-option
                                v-for="item in effectiveList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <!-- ************************************文件操作*************************************************** -->
        <el-dialog title="文件操作" center :visible.sync="editFormVisibleFile"
                   :close-on-click-modal="false"
                   width="63%" style="align-items: center">
            <el-upload
                    class="upload-demo"
                    ref="uploadFile"
                    action="#"
                    :on-preview="handlePreview"
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    name="excelFile"
                    :http-request="uploadFiles"
                    :on-success="onSuccess"
                    :on-error="imgUploadError"
                    :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadFile">上传到服务器
                </el-button>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'

    export default {
        name: "supplier",

        data() {
            return {
                page: 1,//当前页数
                pageSize: 10,//一页显示几条
                listLoading: false,//table加载loading等待
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,//编辑提交等待页面
                editFormRules: {//编辑页面不能为空
                    name: [{required: true, message: '请输入名称', trigger: 'blur'},],
                    effective: [{required: true, message: '请选择是否有效', trigger: 'change'}],
                },
                //编辑界面数据
                editForm: {
                    name: '',
                    address: '',
                    contact: '',
                    phone: '',
                    effective: 1,
                    id: 0,
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待页面
                addFormRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'},],
                },
                //新增界面数据
                addForm: {
                    name: '',
                    address: '',
                    contact: '',
                    phone: '',
                },
                //筛选条件
                filters: {
                    name: '',
                    effective: 2
                },
                supplierData: [],//数据
                tableLength: 0,//数据总个数
                // 更改表头样式
                tableHeaderColor({rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                //编辑页面是否有效
                effectiveList: [{
                    value: 0,
                    label: '无效'
                }, {
                    value: 1,
                    label: '有效'
                },],
                //有效，无效，全部select
                options: [{
                    value: 0,
                    label: '无效'
                }, {
                    value: 1,
                    label: '有效'
                }, {
                    value: 2,
                    label: '全部'
                }],
                currentRow: {},//行数据
                editFormVisibleFile:false,//文件上传界面
                fileList:[],//文件list
            }
        },
        methods: {
            //文件上传
            file(){
                this.editFormVisibleFile = true;
                this.fileList = [];
            },
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
                let url = "/supplier/searchSuppliers";
                let param = {
                    name: that.filters.name,
                    effective: that.filters.effective,
                    size: that.pageSize,// 每页的记录数（行数）
                    page: that.page//第几条开始
                };
                that.supplierData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询供应商失败！", null).then(function (res) {
                    that.listLoading = false;
                    console.info("查询供应商返回体", res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.supplierData = res.data.list;
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
                    effective: 2
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
                    contact: '',
                    phone: '',
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
                            id: this.currentRow.id//删除 供应商ID
                        }
                        let url = "/supplier/deleteSupplier";//删除供应商
                        this.post_url(url, param, "删除供应商失败！", null).then(function (res) {
                            that.listLoading = false;
                            console.info("删除供应商返回体", res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除供应商成功");
                                that.currentRow = {};
                                that.search();
                            }
                        }).catch(() => {
                            that.listLoading = false;
                            that.$message.error("删除供应商失败");
                        });
                    }).catch(() => {
                        that.listLoading = false;
                        that.$message.error("删除供应商失败");
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
                        effective: this.currentRow.effective,//是否有效
                        id: this.currentRow.id,
                        contact: this.currentRow.contact,//联系人
                        phone: this.currentRow.phone,//联系电话
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
                            let url = "/supplier/updateSupplier";//编辑提交
                            let param = that.editForm;
                            this.post_url(url, param, "修改供应商失败！", null).then(function (res) {
                                that.editLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改供应商成功");
                                    that.editFormVisible = false;
                                    that.editForm = {};
                                    that.currentRow = {};
                                    that.search();
                                } else {
                                    that.$message.error("修改供应商失败");
                                }
                            }).catch(() => {
                                that.editLoading = false;
                                that.$message.error("修改供应商失败");
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
                            let url = "/supplier/addSupplier";//新增供应商
                            let param = that.addForm;
                            this.post_url(url, param, "新增供应商失败！", null).then(function (res) {
                                that.addLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增供应商成功");
                                    that.addFormVisible = false;
                                    that.addForm = {};
                                    that.search();
                                } else {
                                    that.$message.error("新增供应商失败");
                                }
                            }).catch(() => {
                                that.editLoading = false;
                                that.$message.error("新增供应商失败");
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
            //点击文件
            handlePreview(file) {
                console.log(file);
            },
            //文件改变事件
            handleChange(file, fileList) {
                let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
                if (existFile) {
                    this.$message.error('当前文件已经存在!');
                    fileList.pop();
                }
                this.fileList = fileList;
            },
            handleExceed(files, fileList) {
                // this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共存在了 ${this.picturesList.length} 个文件`);
            },
            handleRemove(file) {
                this.dialogImageUrl = "";
                this.dialogVisible = false;
                this.$refs.uploadFile.clearFiles();
            },
            //上传文件
            uploadFiles(file) {
                this.fileData.append('excelFile', file.file);  // append增加数据
            },
            // 图片上传成功后，后台返回图片的路径
            onSuccess: function (res) {
                if (res.code == 1001) {
                    this.$message({
                        message: '恭喜你，上传成功',
                        type: 'success'
                    });
                } else {
                    this.$message.error('上传失败，请重新上传');
                }
            },
            //图片上传失败调用
            imgUploadError(err, file, fileList) {
                console.log(err)
                this.$refs.uploadFile.clearFiles();
                this.$message.error('上传图片失败!');
            },
            addSupplierExcelTemplate(){
                let url;
                url = "/file/addSupplierExcelTemplate";
                let param = {};
                this.postExport(url, param).then(function (res) {
                    if (!res) {
                        return
                    }
                    const link = document.createElement('a')

                    let blob = new Blob([res.data], { type: 'application/octer-stream' });

                    link.style.display = 'none'

                    link.href = URL.createObjectURL(blob);

                    link.setAttribute('download', '供应商导入模板.xlsx');

                    document.body.appendChild(link);

                    link.click();

                    document.body.removeChild(link);
                }).catch(function (res) {
                    console.info("提交新增供应商报错返回体", res)
                    that.$message.error('上传失败，请重新上传');
                });
            },
            submitUploadFile(){
                let that = this;
                if (this.fileList.length === 0) {
                    this.$message({
                        message: '请先选择文件',
                        type: 'warning'
                    })
                } else {
                    this.fileData = new FormData();  // new formData对象
                    this.$refs.uploadFile.submit();  // 提交调用uploadFile函数
                    let url;
                    url = "/file/addSupplierExcel";

                    let param = this.fileData;
                    this.postUpload(url, param, "上传文件失败！", null).then(function (res) {
                        if (res.data.code === Variable_global.errorCode.SUCCESS) {
                            that.$message({
                                message: res.data.data,
                                type: 'success'
                            });
                            that.$refs.uploadFile.clearFiles();
                            that.editFormVisibleFile = false;
                            that.search();
                        } else {
                            that.$message.error(res.data.data);
                        }
                        console.info("提交新增供应商返回体", res)
                    }).catch(function (res) {
                        console.info("提交新增供应商报错返回体", res)
                        that.$message.error('上传失败，请重新上传');
                    });
                }
            },
            //条件导出
            filterExport(){
                let that = this;
                let url;
                url = "/file/filterExport_Supplier";
                let param = {
                        name: that.filters.name,
                        effective: that.filters.effective,
                        size: that.pageSize,// 每页的记录数（行数）
                        page: that.page//第几条开始
                        };
                this.postExport(url, param).then(function (res) {
                    if (!res) {
                        return
                    }
                    const link = document.createElement('a')

                    let blob = new Blob([res.data], { type: 'application/octer-stream' });

                    link.style.display = 'none'

                    link.href = URL.createObjectURL(blob);

                    link.setAttribute('download', '供应商导出.xlsx');

                    document.body.appendChild(link);

                    link.click();

                    document.body.removeChild(link);
                }).catch(function (res) {
                    console.info("提交新增供应商报错返回体", res)
                    that.$message.error('上传失败，请重新上传');
                });

            },
            //全部导出
            exportAll(){
                let url;
                url = "/file/exportAll_Supplier";
                let param = {};
                this.postExport(url, param).then(function (res) {
                    if (!res) {
                        return
                    }
                    const link = document.createElement('a')

                    let blob = new Blob([res.data], {type: 'application/octer-stream'});

                    link.style.display = 'none'

                    link.href = URL.createObjectURL(blob);

                    link.setAttribute('download', '供应商导出.xlsx');

                    document.body.appendChild(link);

                    link.click();

                    document.body.removeChild(link);
                })
            }

        },
        mounted() {
            this.search();
        }
    }
</script>

<style scoped>
</style>