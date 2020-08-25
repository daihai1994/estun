<template>
    <div>
        <!--工具条-->
        <el-col :span="24" style="padding-bottom: 0;">
            <el-form :inline="true" :model="filters">
                <el-form-item prop="type">
                    <el-select v-model="filters.type" placeholder="类型" @change="typeChange">
                        <el-option
                                v-for="item in optionsValue"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="userName" v-if="show1">
                    <el-input v-model="filters.userName" placeholder="使用人" prefix-icon="el-icon-search" @keyup.enter.native="keyEnter()"></el-input>
                </el-form-item>
                <el-form-item prop="department" v-if="show1">
                    <el-input v-model="filters.department" placeholder="使用部门" prefix-icon="el-icon-search" @keyup.enter.native="keyEnter()"></el-input>
                </el-form-item>
                <el-form-item prop="siteAddress" v-if="show1">
                    <el-input v-model="filters.siteAddress" placeholder="所在工地" prefix-icon="el-icon-search" @keyup.enter.native="keyEnter()"></el-input>
                </el-form-item>

                <el-form-item prop="noteTaler" v-if="show">
                    <el-input v-model="filters.noteTaler" placeholder="记录人" prefix-icon="el-icon-search" @keyup.enter.native="keyEnter()"></el-input>
                </el-form-item>
                <el-form-item prop="name" v-if="show">
                    <el-input v-model="filters.name" placeholder="名称" prefix-icon="el-icon-search" @keyup.enter.native="keyEnter()"></el-input>
                </el-form-item>
                <el-form-item prop="personLiable" v-if="show">
                    <el-input v-model="filters.personLiable" placeholder="责任人" prefix-icon="el-icon-search" @keyup.enter.native="keyEnter()"></el-input>
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
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form>
        </el-col>
        <el-table
                ref="property"
                :data="propertyData"
                :header-cell-style="tableHeaderColor"
                border
                highlight-current-row
                @current-change="handleTableChange"
                style="width: 100%;" v-loading="listLoading">
            <el-table-column type="expand">
                <template slot-scope="date">
                    <el-table
                            :data="date.row.propertyList"
                            :header-cell-style="tableHeaderColor"
                            border
                            highlight-current-row
                            style="width: 100%;">
                        <el-table-column
                                prop="type"
                                sortable
                                label="类型">
                        </el-table-column>
                        <el-table-column
                                prop="serialNumber"
                                sortable
                                label="序列号">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                sortable
                                label="名称">
                        </el-table-column>
                        <el-table-column
                                prop="brand"
                                sortable
                                label="品牌">
                        </el-table-column>
                        <el-table-column
                                prop="department"
                                sortable
                                label="使用部门" v-if="show1">
                        </el-table-column>
                        <el-table-column
                                prop="userName"
                                sortable
                                label="使用人" v-if="show1">
                        </el-table-column>
                        <el-table-column
                                prop="siteAddress"
                                sortable
                                label="所在地址" v-if="show1">
                        </el-table-column>
                        <el-table-column
                                prop="remarks"
                                sortable
                                label="备注">
                        </el-table-column>
                        <el-table-column
                                prop="mp"
                                sortable
                                label="MP" v-if="show1">
                        </el-table-column>
                        <el-table-column
                                prop="returnTime"
                                 sortable
                                 label="归还日期">
                        </el-table-column>
                        <el-table-column
                                prop="meterType"
                                label="仪表形式" v-if="show">
                        </el-table-column>
                        <el-table-column
                                prop="quantity"
                                label="数量" v-if="show">
                        </el-table-column>
                        <el-table-column
                                prop="meterSituation"
                                label="仪表情况" v-if="show">
                        </el-table-column>
                        <el-table-column
                                prop="usageStatus"
                                label="项目使用情况" v-if="show">
                        </el-table-column>
                        <el-table-column
                                prop="personLiable"
                                label="责任人" v-if="show">
                        </el-table-column>
                        <el-table-column
                                prop="noteTaler"
                                label="记录人" v-if="show">
                        </el-table-column>
                        <el-table-column
                                prop="meterStatus"
                                label="设备状态" v-if="show">
                        </el-table-column>
                        <el-table-column
                                prop="fault"
                                label="故障原因" v-if="show">
                        </el-table-column>
                        <el-table-column
                                prop="move"
                                label="移动说明" v-if="show">
                        </el-table-column>
                        <el-table-column
                                prop="updateTime"
                                label="更新时间" v-if="show">
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="date">
                                <el-button type="text" @click="operationPictureDetails(date.row)" size="small">查看图片</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                    prop="type"
                    sortable
                    label="类型" >
            </el-table-column>
            <el-table-column
                    prop="serialNumber"
                    sortable
                    label="序列号">
            </el-table-column>
            <el-table-column
                    prop="name"
                    sortable
                    label="名称">
            </el-table-column>
            <el-table-column
                    prop="brand"
                    sortable
                    label="品牌">
            </el-table-column>
            <el-table-column
                    prop="department"
                    sortable
                    label="使用部门" v-if="show1">
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="使用人" v-if="show1">
            </el-table-column>
            <el-table-column
                    prop="siteAddress"
                    label="所在地址" v-if="show1">
            </el-table-column>
            <el-table-column
                    prop="remarks"
                    label="备注">
            </el-table-column>
            <el-table-column
                    prop="mp"
                    label="MP" v-if="show1">
            </el-table-column>
            <el-table-column
                    prop="meterType"
                    label="仪表形式" v-if="show">
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    label="数量" v-if="show">
            </el-table-column>
            <el-table-column
                    prop="meterSituation"
                    label="仪表情况" v-if="show">
            </el-table-column>
            <el-table-column
                    prop="usageStatus"
                    label="项目使用情况" v-if="show">
            </el-table-column>
            <el-table-column
                    prop="personLiable"
                    label="责任人" v-if="show">
            </el-table-column>
            <el-table-column
                    prop="noteTaler"
                    label="记录人" v-if="show">
            </el-table-column>
            <el-table-column
                    prop="meterStatus"
                    label="设备状态" v-if="show">
            </el-table-column>
            <el-table-column
                    prop="fault"
                    label="故障原因" v-if="show">
            </el-table-column>
            <el-table-column
                    prop="move"
                    label="移动说明" v-if="show">
            </el-table-column>
            <el-table-column
                    prop="updateTime"
                    label="更新时间" v-if="show">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="date">
                    <el-button type="text" @click="operationPicture(date.row)" size="small">查看图片</el-button>
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
        <el-dialog v-dialog-drag title="新增财产" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px"  ref="addForm">
                <el-form-item label="类型" prop="type">
                    <el-select v-model="addForm.type" @change="typeChange1">
                        <el-option
                                v-for="item in optionsValue"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="序列号" prop="serialNumber">
                    <el-input v-model="addForm.serialNumber" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                    <el-input v-model="addForm.brand" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="使用部门" prop="department" v-if="show1Add">
                    <el-input v-model="addForm.department" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="使用人" prop="userName" v-if="show1Add">
                    <el-input v-model="addForm.userName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所在地址" prop="siteAddress" v-if="show1Add">
                    <el-input v-model="addForm.siteAddress" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="addForm.remarks" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="MP" prop="mp" v-if="show1Add">
                    <el-input v-model="addForm.mp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仪表形式" prop="meterType" v-if="showAdd">
                    <el-input v-model="addForm.meterType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="quantity" v-if="showAdd">
                    <el-input v-model="addForm.quantity" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仪表情况" prop="meterSituation" v-if="showAdd">
                    <el-input v-model="addForm.meterSituation" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目使用情况" prop="usageStatus" v-if="showAdd">
                    <el-input v-model="addForm.usageStatus" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="责任人" prop="personLiable" v-if="showAdd">
                    <el-input v-model="addForm.personLiable" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="记录人" prop="noteTaler" v-if="showAdd">
                    <el-input v-model="addForm.noteTaler" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="设备状态" prop="meterStatus" v-if="showAdd">
                    <el-input v-model="addForm.meterStatus" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="故障原因" prop="fault" v-if="showAdd">
                    <el-input v-model="addForm.fault" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="移动说明" prop="move" v-if="showAdd">
                    <el-input v-model="addForm.move" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="更新时间" prop="updateTime" v-if="showAdd">
                    <el-input v-model="addForm.updateTime" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{addLoading?'提交中...':'提交'}}</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog v-dialog-drag title="编辑财产" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px"  ref="editForm">
                <el-form-item label="序列号" prop="serialNumber">
                    <el-input v-model="editForm.serialNumber" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                    <el-input v-model="editForm.brand" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="使用部门" prop="department" v-if="show1Add">
                    <el-input v-model="editForm.department" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="使用人" prop="userName" v-if="show1Add">
                    <el-input v-model="editForm.userName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所在地址" prop="siteAddress" v-if="show1Add">
                    <el-input v-model="editForm.siteAddress" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="editForm.remarks" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="MP" prop="mp" v-if="show1Add">
                    <el-input v-model="editForm.mp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仪表形式" prop="meterType" v-if="showAdd">
                    <el-input v-model="editForm.meterType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="quantity" v-if="showAdd">
                    <el-input v-model="editForm.quantity" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="仪表情况" prop="meterSituation" v-if="showAdd">
                    <el-input v-model="editForm.meterSituation" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目使用情况" prop="usageStatus" v-if="showAdd">
                    <el-input v-model="editForm.usageStatus" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="责任人" prop="personLiable" v-if="showAdd">
                    <el-input v-model="editForm.personLiable" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="记录人" prop="noteTaler" v-if="showAdd">
                    <el-input v-model="editForm.noteTaler" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="设备状态" prop="meterStatus" v-if="showAdd">
                    <el-input v-model="editForm.meterStatus" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="故障原因" prop="fault" v-if="showAdd">
                    <el-input v-model="editForm.fault" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="移动说明" prop="move" v-if="showAdd">
                    <el-input v-model="editForm.move" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="更新时间" prop="updateTime" v-if="showAdd">
                    <el-input v-model="editForm.updateTime" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="归还日期" prop="returnTime">
                    <el-date-picker
                            v-model="editForm.returnTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:MM:SS"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload
                            ref="files"
                            action="#"
                            :auto-upload="false"
                            :http-request="uploadFile"
                            list-type="picture-card">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail"
                                 :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                            <i class="el-icon-zoom-in"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                              <i class="el-icon-delete"></i>
                            </span>
                         </span>
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{editLoading?'提交中...':'提交'}}</el-button>
            </div>
        </el-dialog>
        <!-- ************************************图片操作*************************************************** -->
        <el-dialog title="图片操作" center :visible.sync="editFormVisiblePicture"
                   :close-on-click-modal="false"
                   width="63%" style="align-items: center">
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="#"
                    :on-preview="handlePreview"
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    name="picture"
                    :http-request="uploadFile"
                    list-type="picture"
                    :data='picturePropertyId'
                    :on-success="onSuccess"
                    :on-error="imgUploadError"
                    :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M，最多有1张</div>
            </el-upload>
            <viewer :images="picturesList" style="">
                <div v-for="item in pictures"
                     style="width: 200px;height:200px;display: inline-block;margin-left: 5px">
                                <span class="el-image-viewer__btn"
                                      style="width: 30px;height: 30px;background: white;font-size: 30px;position:relative;right: -170px;top:30px"
                                      @click="deleteGoodsPicture(item.id)">
                                  <i class="el-icon-circle-close"></i>
                                </span>
                    <img :src="item.url" :key="item.url" style="width: 200px;height:200px">
                </div>
            </viewer>

        </el-dialog>

        <!-- ************************************文件操作*************************************************** -->
        <el-dialog title="文件操作" center :visible.sync="editFormVisibleFile"
                   :close-on-click-modal="false"
                   width="63%" style="align-items: center">
                <el-select v-model="fileType" placeholder="请选择" style="width: 300px;margin-bottom: 10px">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
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
                    :data='picturePropertyId'
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
        name: "property",

        data() {
            return {
                show:false,
                show1:true,
                showAdd:false,
                show1Add:false,
                fileType:0,
                options: [{
                    value: 0,
                    label: '电脑明细'
                }, {
                    value: 1,
                    label: '测试仪表'
                }],
                optionsValue: [{
                    value: '中本硕电脑明细',
                    label: '中本硕电脑明细'
                }, {
                    value: '测试仪表',
                    label: '测试仪表'
                }],
                editFormVisibleFile:false,
                selectType:false,
                //图片list
                pictures: [],
                picturesList: [],
                //要删除的照片ID
                pictureId: 0,
                //图片上传的参数
                picturePropertyId: {
                    propertyId: 0,
                },
                //图片个数限制
                limitSize: 1,
                //图片最多个数
                limitMaxSize: 1,
                //图片list
                fileList: [],
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                fileData: "",
                page: 1,//当前页数
                pageSize: 10,//一页显示几条
                listLoading: false,//table加载loading等待
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,//编辑提交等待页面
                editFormRules: {//编辑页面不能为空
                    serialNumber: [{required: true, message: '请输入序列号', trigger: 'blur'},],
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    brand: [{required: true, message: '请输入品牌', trigger: 'blur'}],
                    department: [{required: true, message: '请输入使用部门', trigger: 'blur'}],
                    userName: [{required: true, message: '请输入使用人', trigger: 'blur'}],
                    siteAddress: [{required: true, message: '请输入所在工地', trigger: 'blur'}],
                },
                //编辑界面数据
                editForm: {
                    type:'',
                    serialNumber: '',
                    name: '',
                    brand: '',
                    department: '',
                    userName: '',
                    siteAddress: '',
                    remarks: '',
                    mp: '',
                    id:'',
                    returnTime:'',
                    meterType: '',
                    quantity: '',
                    meterSituation: '',
                    usageStatus: '',
                    personLiable: '',
                    noteTaler: '',
                    meterStatus: '',
                    fault: '',
                    move:'',
                    updateTime:"",
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,//新增提交等待页面
                addFormRules: {
                    serialNumber: [{required: true, message: '请输入序列号', trigger: 'blur'},],
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    brand: [{required: true, message: '请输入品牌', trigger: 'blur'}],
                    department: [{required: true, message: '请输入使用部门', trigger: 'blur'}],
                    userName: [{required: true, message: '请输入使用人', trigger: 'blur'}],
                    siteAddress: [{required: true, message: '请输入所在工地', trigger: 'blur'}],
                },
                //新增界面数据
                addForm: {
                    type:'',
                    serialNumber: '',
                    name: '',
                    brand: '',
                    department: '',
                    userName: '',
                    siteAddress: '',
                    remarks: '',
                    mp: '',
                    meterType: '',
                    quantity: '',
                    meterSituation: '',
                    usageStatus: '',
                    personLiable: '',
                    noteTaler: '',
                    meterStatus: '',
                    fault: '',
                    move:'',
                    updateTime:'',
                },
                //筛选条件
                filters: {
                    userName: '',
                    department: '',
                    siteAddress:'',
                    type:'中本硕电脑明细',
                    noteTaler:"",
                    name:"",
                    personLiable:"",
                },
                propertyData: [],//数据
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
                currentRow: {},//行数据
                editFormVisiblePicture: false,
            }
        },
        methods: {
            typeChange(e){
                if(e=="测试仪表"){
                    this.show = true;
                    this.show1 = false;
                }else if(e=="中本硕电脑明细"){
                    this.show = false;
                    this.show1 = true;
                }
                this.search();
            },
            typeChange1(e){
                if(e=="测试仪表"){
                    this.showAdd = true;
                    this.show1Add = false;
                }else if(e=="中本硕电脑明细"){
                    this.showAdd = false;
                    this.show1Add = true;
                }
            },
            file(){
               this.editFormVisibleFile = true;
               this.fileList = [];
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
                    this.fileData.append('type', this.fileType);  // 添加物品类型
                    let url;
                        url = "/file/addPropertyExcel";

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
                        console.info("提交新增财产返回体", res)
                    }).catch(function (res) {
                        console.info("提交新增财产报错返回体", res)
                        that.$message.error('上传失败，请重新上传');
                    });
                }
            },
            //删除图片
            deleteGoodsPicture: function (id) {
                let that = this;
                this.$confirm('确认删除选中照片吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    that.visible = false;
                    let param = {
                        id: id //删除 财产的图片ID
                    }
                    let url ;//删除图片
                    if(this.selectType){
                        url = "/property/deletePicture";
                    }else{
                        url = "/property/deleteDetailsPicture";
                    }

                    this.post_url(url, param, "删除图片失败！", that.visible = false).then(function (res) {
                        that.visible = false;
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.$message.success("删除图片成功");
                            that.editFormVisiblePicture = false;//关闭图片页面
                            that.pictureId = 0;//清空选择的图片
                            that.propertySelect = {};//清空选择的物品信息
                            that.search();
                        }
                    }).catch(() => {
                        that.visible = false;
                        that.$message.warning("删除图片失败");
                    });
                })
            },
            //提交新增图片
            submitUpload() {
                let that = this;
                if (this.fileList.length === 0) {
                    this.$message({
                        message: '请先选择文件',
                        type: 'warning'
                    })
                } else {
                    this.fileData = new FormData();  // new formData对象
                    this.$refs.upload.submit();  // 提交调用uploadFile函数
                    this.fileData.append('propertyId', this.propertySelect.id);  // 添加物品ID
                    console.info("提交新增图片PropertyId", this.propertySelect.id)
                    console.info("提交新增图片List", this.fileList)
                    console.info("提交新增图片信息", this.fileData)
                    let url;
                    if(this.selectType){
                         url = "/file/addPropertyPicture";
                    }else{
                        url = "/file/addPropertyDetailsPicture";
                    }

                    let param = this.fileData;
                    this.postUpload(url, param, "上传图片失败！", null).then(function (res) {
                        if (res.data.code === Variable_global.errorCode.SUCCESS) {
                            that.$message({
                                message: res.data.data,
                                type: 'success'
                            });
                            that.$refs.upload.clearFiles();
                            that.editFormVisiblePicture = false;
                            that.search();
                        } else {
                            that.$message.error(res.data.data);
                        }
                        console.info("提交新增图片返回体", res)
                    }).catch(function (res) {
                        console.info("提交新增图片报错返回体", res)
                        that.$message.error('上传失败，请重新上传');
                    });
                }
            },
            operationPictureDetails:function(row){
                console.info("点击查看图片", row.icon_url);
                let that = this;
                that.propertySelect = row;

                that.pictures = [];
                that.picturesList = [];
                let size = 1;
                if (row.icon_url==null||row.icon_url=='') {
                    size = -1;
                }else{
                    let  object  = new Object();
                    object.url = 'http://localhost:8081'+row.icon_url;
                    //object.url = 'http://114.67.105.43:8081'+row.icon_url;
                    object.id = row.id;
                    that.pictures.push(object);
                    that.picturesList.push(that.getLocation+row.icon_url);
                }
                that.limitSize = size;
                console.info("当前图片个数", size);
                that.picturePropertyId.propertyId = row.id;
                that.editFormVisiblePicture = true;
                that.selectType = false;
            },
            //图片操作
            operationPicture: function (row) {
                console.info("点击查看图片", row.icon_url);
                let that = this;
                that.propertySelect = row;

                that.pictures = [];
                that.picturesList = [];
                let size = 1;
                if (row.icon_url==null||row.icon_url=='') {
                    size = -1;
                }else{
                    let  object  = new Object();
                    object.url = 'http://localhost:8081'+row.icon_url;
                    //object.url = 'http://114.67.105.43:8081'+row.icon_url;
                    object.id = row.id;
                    that.pictures.push(object);
                    that.picturesList.push(that.getLocation+row.icon_url);
                }
                that.limitSize = size;
                console.info("当前图片个数", size);
                that.picturePropertyId.propertyId = row.id;
                that.editFormVisiblePicture = true;
                that.selectType = true;
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
                this.$refs.upload.clearFiles();
                this.$message.error('上传图片失败!');
            },
            //点击图片
            handlePreview(file) {
                console.log(file);
            },
            //图片改变事件
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
                this.$refs.files.clearFiles();
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //上传文件
            uploadFile(file) {
                this.fileData.append('picture', file.file);  // append增加数据
            },
            //上传文件
            uploadFiles(file) {
                this.fileData.append('excelFile', file.file);  // append增加数据
            },
            //改变行选择事件
            handleTableChange(val) {
                let that = this;
                if (val != null) {
                    that.currentRow = val;
                }

            },
            //查询财产
            search: function () {
                let that = this;
                let url = "/property/searchProperty";
                let param = {
                };
                if(this.show){
                     param = {
                        userName: "",
                        department: "",
                        siteAddress:"",
                        size: that.pageSize,// 每页的记录数（行数）
                        page: that.page,//第几条开始
                        type:that.filters.type,
                        name:that.filters.name,
                        noteTaler:that.filters.noteTaler,
                        personLiable:that.filters.personLiable,
                    };
                }else{
                     param = {
                        userName: that.filters.userName,
                        department: that.filters.department,
                        siteAddress:that.filters.siteAddress,
                        size: that.pageSize,// 每页的记录数（行数）
                        page: that.page,//第几条开始
                        type:that.filters.type,
                        name:"",
                        noteTaler:"",
                        personLiable:"",
                    };
                }
                that.propertyData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询财产失败！", null).then(function (res) {
                    that.listLoading = false;
                    console.info("查询财产返回体", res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.propertyData = res.data.list;
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
            //检测键盘回车
            keyEnter(){
                this.search();
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
                if(that.filters.type=="测试仪表"){
                    this.showAdd = true;
                    this.show1Add = false;
                }else if(that.filters.type=="中本硕电脑明细"){
                    this.showAdd = false;
                    this.show1Add = true;
                }
                that.addForm = {
                    type:that.filters.type,
                    serialNumber: '',
                    name: '',
                    brand: '',
                    department: '',
                    userName: '',
                    siteAddress: '',
                    remarks: '',
                    mp: '',
                    meterType: '',
                    quantity: '',
                    meterSituation: '',
                    usageStatus: '',
                    personLiable: '',
                    noteTaler: '',
                    meterStatus: '',
                    fault: '',
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
                            id: this.currentRow.id//删除 财产ID
                        }
                        let url = "/property/deleteProperty";//删除财产
                        this.post_url(url, param, "删除财产失败！", null).then(function (res) {
                            that.listLoading = false;
                            console.info("删除财产返回体", res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除财产成功");
                                that.currentRow = {};
                                that.search();
                            }
                        }).catch(() => {
                            that.listLoading = false;
                            that.$message.error("删除财产失败");
                        });
                    }).catch(() => {
                        that.listLoading = false;
                        that.$message.error("删除财产失败");
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
                    that.editFormVisible = true;//打开编辑页面
                    if(this.currentRow.type=="测试仪表"){
                        this.showAdd = true;
                        this.show1Add = false;
                    }else if(this.currentRow.type=="中本硕电脑明细"){
                        this.showAdd = false;
                        this.show1Add = true;
                    }
                    that.editForm = {
                        type:this.currentRow.type,
                        serialNumber: this.currentRow.serialNumber,
                        name: this.currentRow.name,
                        brand: this.currentRow.brand,
                        department: this.currentRow.department,
                        userName: this.currentRow.userName,
                        siteAddress: this.currentRow.siteAddress,
                        remarks: this.currentRow.remarks,
                        mp: this.currentRow.mp,
                        id:this.currentRow.id,
                        meterType: this.currentRow.meterType,
                        quantity: this.currentRow.quantity,
                        meterSituation: this.currentRow.meterSituation,
                        usageStatus: this.currentRow.usageStatus,
                        personLiable: this.currentRow.personLiable,
                        noteTaler: this.currentRow.noteTaler,
                        meterStatus: this.currentRow.meterStatus,
                        fault: this.currentRow.fault,
                        move:this.currentRow.move,
                        updateTime:this.currentRow.updateTime,
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
                            let url = "/file/updateProperty";//编辑提交
                            let username = "";//用户名
                            if (JSON.parse(sessionStorage.getItem("user")) != null) {
                                username = JSON.parse(sessionStorage.getItem("user")).username
                            } else {
                                that.$message.error("账号过期，请重新登录!")
                                that.$router.push({
                                    path: '/login'
                                })
                                return;
                            }
                            this.fileData = new FormData();  // new formData对象
                            this.$refs.files.submit();  // 提交调用uploadFile函数
                            this.fileData.append('type', this.editForm.type);
                            this.fileData.append('serialNumber', this.editForm.serialNumber);
                            this.fileData.append('name', this.editForm.name);
                            this.fileData.append('brand', this.editForm.brand);
                            this.fileData.append('department', this.editForm.department);
                            this.fileData.append('userName', this.editForm.userName);
                            this.fileData.append('siteAddress', this.editForm.siteAddress);
                            this.fileData.append('remarks', this.editForm.remarks);
                            this.fileData.append('mp', this.editForm.mp);
                            this.fileData.append('id', this.editForm.id);
                            this.fileData.append('returnTime', this.editForm.returnTime);


                            this.fileData.append('meterType', this.editForm.meterType);
                            this.fileData.append('quantity', this.editForm.quantity);
                            this.fileData.append('meterSituation', this.editForm.meterSituation);
                            this.fileData.append('usageStatus', this.editForm.usageStatus);
                            this.fileData.append('personLiable', this.editForm.personLiable);
                            this.fileData.append('noteTaler', this.editForm.noteTaler);
                            this.fileData.append('meterStatus', this.editForm.meterStatus);
                            this.fileData.append('fault', this.editForm.fault);
                            this.fileData.append('move', this.editForm.move);
                            this.fileData.append('updateTime', this.editForm.updateTime);

                            this.fileData.append('username', username);  // 添加username
                            let param = this.fileData;
                            this.postUpload(url, param, "修改财产失败！", null).then(function (res) {
                                that.editLoading = false;
                                console.info(res);
                                if (res.data.code === Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改财产成功");
                                    that.editFormVisible = false;
                                    that.editForm = {};
                                    that.currentRow = {};
                                    that.$refs.files.clearFiles();
                                    that.search();
                                } else {
                                    that.$message.error("修改财产失败");
                                }
                            }).catch(() => {
                                that.editLoading = false;
                                that.$message.error("修改财产失败");
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
                            let url = "/property/addProperty";//新增财产
                            let param = that.addForm;
                            this.post_url(url, param, "新增财产失败！", null).then(function (res) {
                                that.addLoading = false;
                                console.info(res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增财产成功");
                                    that.addFormVisible = false;
                                    that.addForm = {};
                                    that.search();
                                } else {
                                    that.$message.error("新增财产失败");
                                }
                            }).catch(() => {
                                that.editLoading = false;
                                that.$message.error("新增财产失败");
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