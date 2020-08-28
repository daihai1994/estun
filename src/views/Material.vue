<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="7">
                <!-- ************************************物品大类*************************************************** -->

                <span style="font-size: 20px;">物品大类</span>
                <!--工具条-->
                <el-col :span="24" style="padding-bottom: 0;margin-top: 15px;padding-left: 0;padding-right: 0">
                    <el-form :inline="true" :model="materialCategory">
                        <el-form-item prop="name" style="margin-right: 10px">
                            <el-input v-model="materialCategory.name" placeholder="名称" style="width: 150px"
                                      prefix-icon="el-icon-search" @keyup.enter.native="btnSearchMaterialCategory"></el-input>
                        </el-form-item>
                        <el-form-item prop="effective" style="margin-right: 10px">
                            <el-select v-model="materialCategory.effective" placeholder="请选择" style="width: 100px" @change="btnSearchMaterialCategory">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="margin-right: 5px">
                            <el-button type="primary" @click.native="btnSearchMaterialCategory" :loading="false"
                                       style="margin-right: 10px;">搜索
                            </el-button>
                            <el-dropdown split-button type="primary" @click="btnNewMaterialCategory" trigger="click"
                                         style="width:100px ">
                                新增
                                <el-dropdown-menu slot="dropdown" trigger="click">
                                    <el-dropdown-item @click.native="btnEditMaterialCategory">编辑</el-dropdown-item>
                                    <el-dropdown-item @click.native="btnDeleteMaterialCategory">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-table
                        ref="materialCategory"
                        :data="materialCategoryData"
                        :header-cell-style="tableHeaderColor"
                        border
                        highlight-current-row
                        @current-change="rowChangeMaterialCategoryData"
                        style="width: 100%;" :v-loading="materialCategoryLoading">
                    <el-table-column
                            prop="name"
                            sortable
                            label="名称">
                    </el-table-column>
                    <el-table-column
                            prop="effective"
                            label="状态"
                            :formatter="effectiveHandle">
                    </el-table-column>
                </el-table>
                <!--分页工具条-->
                <el-col :span="24">
                    <el-pagination small layout="total, sizes, prev, pager, next, jumper"
                                   @size-change="handleSizeChangeMaterialCategory"
                                   @current-change="handleCurrentChangeMaterialCategory"
                                   :page-sizes="[10, 20, 50, 100]"
                                   :page-size="pageSizeMaterialCategory"
                                   :total="tableLengthMaterialCategory" style="float:right;">
                    </el-pagination>
                </el-col>
            </el-col>
            <!-- ************************************物品大类新增*************************************************** -->
            <el-dialog title="新增物品大类" :visible.sync="addFormVisibleMaterialCategory" :close-on-click-modal="false">
                <el-form :model="addFormMaterialCategory" label-width="100px" :rules="addFormMaterialCategoryRules"
                         ref="addFormMaterialCategory">
                    <el-form-item label="类别名称" prop="name">
                        <el-input v-model="addFormMaterialCategory.name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisibleMaterialCategory = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmitMaterialCategory" :loading="addLoadingMaterialCategory">
                        提交
                    </el-button>
                </div>
            </el-dialog>
            <!-- ************************************物品大类编辑*************************************************** -->
            <el-dialog title="编辑物品大类" :visible.sync="editFormVisibleMaterialCategory" :close-on-click-modal="false">
                <el-form :model="editFormMaterialCategory" label-width="100px" :rules="editFormMaterialCategoryRules"
                         ref="editFormMaterialCategory">
                    <el-form-item label="类别名称" prop="name">
                        <el-input v-model="editFormMaterialCategory.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否有效" prop="role_id">
                        <el-select v-model="editFormMaterialCategory.effective" placeholder="请选择">
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
                    <el-button @click.native="editFormVisibleMaterialCategory = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmitMaterialCategory"
                               :loading="editLoadingMaterialCategory">
                        提交
                    </el-button>
                </div>
            </el-dialog>
            <el-col :span="7">
                <!-- ************************************物品子类*************************************************** -->
                <span style="font-size: 20px;">物品子类</span>
                <el-col :span="24" style="padding-bottom: 0;margin-top: 15px;padding-left: 0;padding-right: 0">
                    <el-form :inline="true" :model="materialSubCategory">
                        <el-form-item prop="name" style="margin-right: 10px">
                            <el-input v-model="materialSubCategory.name" placeholder="名称" style="width: 150px"
                                      prefix-icon="el-icon-search" @keyup.enter.native="btnSearchMaterialSubCategory"></el-input>
                        </el-form-item>
                        <el-form-item prop="effective" style="margin-right: 10px">
                            <el-select v-model="materialSubCategory.effective" placeholder="请选择" style="width: 100px" @change="btnSearchMaterialSubCategory">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="margin-right: 5px">
                            <el-button type="primary" @click.native="btnSearchMaterialSubCategory" :loading="false"
                                       style="margin-right: 10px">搜索
                            </el-button>
                            <el-dropdown split-button type="primary" @click="btnNewMaterialSubCategory" trigger="click">
                                新增
                                <el-dropdown-menu slot="dropdown" trigger="click">
                                    <el-dropdown-item @click.native="btnEditMaterialSubCategory">编辑</el-dropdown-item>
                                    <el-dropdown-item @click.native="btnDeleteMaterialSubCategory">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-table
                        ref="materialSubCategory"
                        :data="materialSubCategoryData"
                        :header-cell-style="tableHeaderColor"
                        border
                        highlight-current-row
                        @current-change="rowChangeMaterialSubCategoryData"
                        style="width: 100%;" v-loading="materialSubCategoryLoading">
                    <el-table-column
                            prop="name"
                            sortable
                            label="名称">
                    </el-table-column>
                    <el-table-column
                            prop="effective"
                            label="状态"
                            :formatter="effectiveHandle">
                    </el-table-column>
                </el-table>
                <!--分页工具条-->
                <el-col :span="24">
                    <el-pagination small layout="total, sizes, prev, pager, next, jumper"
                                   @size-change="handleSizeChangeMaterialSubCategory"
                                   @current-change="handleCurrentChangeMaterialSubCategory"
                                   :page-sizes="[10, 20, 50, 100]"
                                   :page-size="pageSizeMaterialSubCategory"
                                   :total="tableLengthMaterialSubCategory" style="float:right;">
                    </el-pagination>
                </el-col>
                <!-- ************************************物品子类新增*************************************************** -->
                <el-dialog title="新增物品子类" :visible.sync="addFormVisibleMaterialSubCategory" :close-on-click-modal="false">
                    <el-form :model="addFormMaterialSubCategory" label-width="100px" :rules="addFormMaterialSubCategoryRules"
                             ref="addFormMaterialSubCategory">
                        <el-form-item label="选择大类" prop="materialCategoryId">
                            <el-select v-model="addFormMaterialSubCategory.materialCategoryId" filterable placeholder="请选择">
                                <el-option
                                        v-for="item in materialCategoryList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="子类名称" prop="name">
                            <el-input v-model="addFormMaterialSubCategory.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addFormVisibleMaterialSubCategory = false">取消</el-button>
                        <el-button type="primary" @click.native="addSubmitMaterialSubCategory"
                                   :loading="addLoadingMaterialSubCategory">提交
                        </el-button>
                    </div>
                </el-dialog>
                <!-- ************************************物品子类编辑*************************************************** -->
                <el-dialog title="编辑物品子类" :visible.sync="editFormVisibleMaterialSubCategory" :close-on-click-modal="false">
                    <el-form :model="editFormMaterialSubCategory" label-width="100px"
                             :rules="editFormMaterialSubCategoryRules"
                             ref="editFormMaterialSubCategory">
                        <el-form-item label="选择大类" prop="materialCategoryId">
                            <el-select v-model="editFormMaterialSubCategory.materialCategoryId" filterable placeholder="请选择">
                                <el-option
                                        v-for="item in materialCategoryList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="子类名称" prop="name">
                            <el-input v-model="editFormMaterialSubCategory.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="是否有效" prop="role_id">
                            <el-select v-model="editFormMaterialSubCategory.effective" placeholder="请选择">
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
                        <el-button @click.native="editFormVisibleMaterialSubCategory = false">取消</el-button>
                        <el-button type="primary" @click.native="editSubmitMaterialSubCategory"
                                   :loading="editLoadingMaterialSubCategory">提交
                        </el-button>
                    </div>
                </el-dialog>
            </el-col>
            <el-col :span="10">
                <!-- ************************************物品*************************************************** -->
                <span style="font-size: 20px;">物品</span>
                <el-col :span="24" style="padding-bottom: 0;margin-top: 15px;padding-left: 0;padding-right: 0">
                    <el-form :inline="true" :model="material" class="user_form">
                        <el-form-item prop="name" style="margin-right: 10px">
                            <el-input v-model="material.name" placeholder="名称" style="width: 150px"
                                      prefix-icon="el-icon-search" @keyup.enter.native="btnSearchMaterial"></el-input>
                        </el-form-item>
                        <el-form-item prop="abbreviation" style="margin-right: 10px">
                            <el-input v-model="material.abbreviation" placeholder="简称" style="width: 150px"
                                      prefix-icon="el-icon-search" @keyup.enter.native="btnSearchMaterial"></el-input>
                        </el-form-item>
                        <el-form-item prop="effective" style="margin-right: 10px">
                            <el-select v-model="material.effective" placeholder="请选择" style="width: 100px" @change="btnSearchMaterial">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="margin-right: 10px">
                            <el-button type="primary" @click.native="btnSearchMaterial" :loading="false"
                                       style="margin-right: 10px">搜索
                            </el-button>
                            <el-dropdown split-button type="primary" @click="btnNewMaterial" trigger="click">
                                新增
                                <el-dropdown-menu slot="dropdown" trigger="click">
                                    <el-dropdown-item @click.native="btnEditMaterial">编辑</el-dropdown-item>
                                    <el-dropdown-item @click.native="btnDeleteMaterial">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-table
                        :data="materialData"
                        :header-cell-style="tableHeaderColor"
                        border
                        highlight-current-row
                        @current-change="rowChangeMaterialData"
                        style="width: 100%;" v-loading="materialLoading">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="计量单位">
                                    <span>{{ props.row.unit }}</span>
                                </el-form-item>
                                <el-form-item label="规格型号">
                                    <span>{{ props.row.type }}</span>
                                </el-form-item>
                                <el-form-item label="尺寸">
                                    <span>{{ props.row.size }}</span>
                                </el-form-item>
                                <el-form-item label="质量">
                                    <span>{{ props.row.weight }}</span>
                                </el-form-item>
                                <el-form-item label="保存温度">
                                    <span>{{ props.row.temperature }}</span>
                                </el-form-item>
                                <el-form-item label="参考价钱(元)">
                                    <span>{{ props.row.price }}</span>
                                </el-form-item>
                                <el-form-item label="物品描述">
                                    <span>{{ props.row.description }}</span>
                                </el-form-item>
                                <el-form-item label="登记时间">
                                    <span>{{ props.row.registerTime }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            sortable
                            label="名称">
                    </el-table-column>
                    <el-table-column
                            prop="abbreviation"
                            sortable
                            label="简称">
                    </el-table-column>
                    <el-table-column
                            prop="price"
                            sortable
                            label="价钱">
                    </el-table-column>
                    <el-table-column
                            prop="effective"
                            label="状态"
                            :formatter="effectiveHandle">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="operationPicture(scope.row)" type="text" size="small">图片操作</el-button>
                            <el-button @click="operationPicture(scope.row)" type="text" size="small">价格操作</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页工具条-->
                <el-col :span="24">
                    <el-pagination small layout="total, sizes, prev, pager, next, jumper"
                                   @size-change="handleSizeChangeMaterial"
                                   @current-change="handleCurrentChangeMaterial"
                                   :page-sizes="[10, 20, 50, 100]"
                                   :page-size="pageSizeMaterial"
                                   :total="tableLengthMaterial" style="float:right;">
                    </el-pagination>
                </el-col>
                <!-- ************************************物品新增*************************************************** -->
                <el-dialog title="新增物品" :visible.sync="addFormVisibleMaterial" :close-on-click-modal="false">
                    <el-form :model="addFormMaterial" label-width="100px" :rules="addFormMaterialRules" ref="addFormMaterial">
                        <el-form-item label="选择大类" prop="materialCategoryId">
                            <el-select v-model="addFormMaterial.materialCategoryId" filterable placeholder="请选择"
                                       @change="materialCategoryChange">
                                <el-option
                                        v-for="item in materialCategoryList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择子类" prop="materialSubCategoryId">
                            <el-select v-model="addFormMaterial.materialSubCategoryId" filterable placeholder="请选择">
                                <el-option
                                        v-for="item in materialSubCategoryList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物品全称" prop="name">
                            <el-input v-model="addFormMaterial.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="物品简称" prop="abbreviation">
                            <el-input v-model="addFormMaterial.abbreviation" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="计量单位" prop="unit">
                            <el-input v-model="addFormMaterial.unit" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="规格型号" prop="type">
                            <el-input v-model="addFormMaterial.type" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="尺寸" prop="size">
                            <el-input v-model="addFormMaterial.size" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="质量" prop="weight">
                            <el-input type="number" v-model.number="addFormMaterial.weight" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="保存温度" prop="temperature">
                            <el-input type="number" v-model.number="addFormMaterial.temperature"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="参考报价" prop="price">
                            <el-input type="number" v-model.number="addFormMaterial.price" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="物品描述" prop="description">
                            <el-input v-model="addFormMaterial.description" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addFormVisibleMaterial = false">取消</el-button>
                        <el-button type="primary" @click.native="addSubmitMaterial" :loading="addLoadingMaterial">提交
                        </el-button>
                    </div>
                </el-dialog>
                <!-- ************************************物品编辑*************************************************** -->
                <el-dialog title="编辑物品" :visible.sync="editFormVisibleMaterial" :close-on-click-modal="false">
                    <el-form :model="editFormMaterial" label-width="100px" :rules="editFormMaterialRules" ref="editFormMaterial">
                        <el-form-item label="是否有效" prop="role_id">
                            <el-select v-model="editFormMaterial.effective" placeholder="请选择">
                                <el-option
                                        v-for="item in effectiveList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择大类" prop="materialCategoryId">
                            <el-select v-model="editFormMaterial.materialCategoryId" filterable placeholder="请选择"
                                       @change="materialCategoryChangeUpdate">
                                <el-option
                                        v-for="item in materialCategoryList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择子类" prop="materialSubCategoryId">
                            <el-select v-model="editFormMaterial.materialSubCategoryId" filterable placeholder="请选择">
                                <el-option
                                        v-for="item in materialSubCategoryList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物品全称" prop="name">
                            <el-input v-model="editFormMaterial.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="物品简称" prop="abbreviation">
                            <el-input v-model="editFormMaterial.abbreviation" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="计量单位" prop="unit">
                            <el-input v-model="editFormMaterial.unit" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="规格型号" prop="type">
                            <el-input v-model="editFormMaterial.type" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="尺寸" prop="size">
                            <el-input v-model="editFormMaterial.size" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="质量" prop="weight">
                            <el-input type="number" v-model.number="editFormMaterial.weight"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="保存温度" prop="temperature">
                            <el-input type="number" v-model.number="editFormMaterial.temperature"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="参考报价" prop="price">
                            <el-input type="number" v-model.number="editFormMaterial.price" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="物品描述" prop="description">
                            <el-input v-model="editFormMaterial.description" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="editFormVisibleMaterial = false">取消</el-button>
                        <el-button type="primary" @click.native="editSubmitMaterial" :loading="editLoadingMaterial">提交
                        </el-button>
                    </div>
                </el-dialog>
                <!-- ************************************物品图片操作*************************************************** -->
                <el-dialog title="物品图片操作" center :visible.sync="editFormVisibleMaterialPicture"
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
                            multiple
                            :limit="limitSize"
                            :data='pictureMaterialId'
                            :on-success="onSuccess"
                            :on-error="imgUploadError"
                            :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                        </el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M，最多有5张</div>
                    </el-upload>
                    <viewer :images="picturesList" style="">
                        <div v-for="item in pictures"
                             style="width: 200px;height:200px;display: inline-block;margin-left: 5px">
                                <span class="el-image-viewer__btn"
                                      style="width: 30px;height: 30px;background: white;font-size: 30px;position:relative;right: -170px;top:30px"
                                      @click="deleteMaterialPicture(item.id)">
                                  <i class="el-icon-circle-close"></i>
                                </span>
                            <img :src="item.url" :key="item.url" style="width: 200px;height:200px">
                        </div>
                    </viewer>

                </el-dialog>
                <!--                                :preview-src-list="picturesList"-->

            </el-col>
        </el-row>
    </div>
</template>
<style>
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
        width: 70%;
    }

    .el-carousel__item el-image {
        color: #475669;
        opacity: 0.75;
        margin: 0;
    }
</style>
<script>
    import Variable_global from "@/global_variable";
    import Viewer from 'v-viewer'

    export default {
        name: "Material",
        data() {
            return {
                /************************物品大类**********************************/
                //物品大类筛选类 effective 0无效 1有效 2全部
                materialCategory: {
                    name: '',
                    effective: 2
                },
                //物品大类数据
                materialCategoryData: [],
                //物品大类数据一共多少条
                tableLengthMaterialCategory: 0,
                //物品大类table加载等待
                materialCategoryLoading: false,
                //物品大类table默认一页行数
                pageSizeMaterialCategory: 10,
                //物品大类table默认显示第几页
                pageMaterialCategory: 1,
                //物品大类选中行
                materialCategorySelect: {},
                //新增物品大类页面是否打开
                addFormVisibleMaterialCategory: false,
                //新增物品大类对象
                addFormMaterialCategory: {
                    name: ""
                },
                //新增物品大类的规则
                addFormMaterialCategoryRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}]
                },
                //提交新增物品大类等待状态
                addLoadingMaterialCategory: false,
                //修改物品大类页面是否打开
                editFormVisibleMaterialCategory: false,
                //修改物品大类对象
                editFormMaterialCategory: {
                    name: "",
                    id: 0,
                    effective: 0
                },
                //修改物品大类的规则
                editFormMaterialCategoryRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}]
                },
                //提交修改物品大类等待状态
                editLoadingMaterialCategory: false,
                /************************物品子类**********************************/
                //物品子类筛选类 effective 0无效 1有效 2全部
                materialSubCategory: {
                    name: '',
                    effective: 2,
                    materialCategoryId: 0
                },
                materialCategoryList: [],//物品大类，全部信息
                //物品子类数据
                materialSubCategoryData: [],
                //物品子类数据一共多少条
                tableLengthMaterialSubCategory: 0,
                //物品子类table加载等待
                materialSubCategoryLoading: false,
                //物品子类table默认一页行数
                pageSizeMaterialSubCategory: 10,
                //物品子类table默认显示第几页
                pageMaterialSubCategory: 1,
                //物品子类选中行
                materialSubCategorySelect: {},
                //新增物品子类页面是否打开
                addFormVisibleMaterialSubCategory: false,
                //新增物品子类对象
                addFormMaterialSubCategory: {
                    name: "",
                    materialCategoryId: 0
                },
                //新增物品子类的规则
                addFormMaterialSubCategoryRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}]
                },
                //提交新增物品子类等待状态
                addLoadingMaterialSubCategory: false,
                //修改物品子类页面是否打开
                editFormVisibleMaterialSubCategory: false,
                //修改物品子类对象
                editFormMaterialSubCategory: {
                    name: "",
                    id: 0,
                    effective: 0,
                    materialCategory: 0
                },
                //修改物品子类的规则
                editFormMaterialSubCategoryRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}]
                },
                //提交修改物品子类等待状态
                editLoadingMaterialSubCategory: false,
                /************************物品**********************************/
                //物品子类全部信息
                materialSubCategoryList: [],
                //物品筛选类 effective 0无效 1有效 2全部
                material: {
                    name: '',
                    abbreviation: '',//简称
                    effective: 2,
                    materialSubCategoryId: 0
                },
                //物品数据
                materialData: [],
                //物品数据一共多少条
                tableLengthMaterial: 0,
                //物品table加载等待
                materialLoading: false,
                //物品table默认一页行数
                pageSizeMaterial: 10,
                //物品table默认显示第几页
                pageMaterial: 1,
                //物品选中行
                materialSelect: {},
                //新增物品页面是否打开
                addFormVisibleMaterial: false,
                //物品图片操作
                editFormVisibleMaterialPicture: false,
                //新增物品对象
                addFormMaterial: {
                    name: "",
                    materialCategoryId: 0,
                    materialSubCategoryId: 0,
                    abbreviation: "",
                    unit: "",
                    type: "",
                    size: "",
                    weight: 0,
                    temperature: 0,
                    price: 0,
                    description: "",
                },
                //新增物品的规则
                addFormMaterialRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    materialCategoryId: [{required: true, message: '请选择大类', trigger: 'change'}],
                    materialSubCategoryId: [{required: true, message: '请选择子类', trigger: 'change'}],
                    abbreviation: [{required: true, message: '请输入简称', trigger: 'blur'}],
                    unit: [{required: true, message: '请输入计量单位', trigger: 'blur'}],
                    type: [{required: true, message: '请输入规格型号', trigger: 'blur'}],
                    size: [{required: true, message: '请输入尺寸', trigger: 'blur'}],
                    weight: [{required: true, message: '请输入质量', trigger: 'blur'}],
                    temperature: [{required: true, message: '请输入保存温度', trigger: 'blur'}],
                    price: [{required: true, message: '请输入参考价钱', trigger: 'blur'}],
                    description: [{required: true, message: '请输入物品描述', trigger: 'blur'}],

                },
                //提交新增物品等待状态
                addLoadingMaterial: false,
                //修改物品页面是否打开
                editFormVisibleMaterial: false,
                //修改物品对象
                editFormMaterial: {
                    id: 0,
                    name: "",
                    materialCategoryId: 0,
                    materialSubCategoryId: 0,
                    abbreviation: "",
                    unit: "",
                    type: "",
                    size: "",
                    weight: 0,
                    temperature: 0,
                    price: 0,
                    description: "",
                    effective: 0,
                },
                //修改物品的规则
                editFormMaterialRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    materialCategoryId: [{required: true, message: '请选择大类', trigger: 'change'}],
                    materialSubCategoryId: [{required: true, message: '请选择子类', trigger: 'change'}],
                    abbreviation: [{required: true, message: '请输入简称', trigger: 'blur'}],
                    unit: [{required: true, message: '请输入计量单位', trigger: 'blur'}],
                    type: [{required: true, message: '请输入规格型号', trigger: 'blur'}],
                    size: [{required: true, message: '请输入尺寸', trigger: 'blur'}],
                    weight: [{required: true, message: '请输入质量', trigger: 'blur'}],
                    temperature: [{required: true, message: '请输入保存温度', trigger: 'blur'}],
                    price: [{required: true, message: '请输入参考价钱', trigger: 'blur'}],
                    description: [{required: true, message: '请输入物品描述', trigger: 'blur'}],
                },
                //提交修改物品等待状态
                editLoadingMaterial: false,
                /**********************************公共信息***************************************************/
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
                //编辑页面是否有效
                effectiveList: [{
                    value: 0,
                    label: '无效'
                }, {
                    value: 1,
                    label: '有效'
                },],
                // 更改表头样式
                tableHeaderColor({rowIndex}) {
                    if (rowIndex === 0) {
                        return 'background-color: #F5F7FA;'
                    }
                },
                //图片删除
                visible: false,
                //图片list
                pictures: [],
                //图片urllist
                picturesList: [],
                //要删除的照片ID
                pictureId: 0,
                //新增图片按钮等待
                addLoadingMaterialPicture: false,
                //图片list
                fileList: [],
                fileData: '',  // 文件上传数据（多文件合一）
                //图片上传头
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                //图片上传的参数
                pictureMaterialId: {
                    materialId: 0,
                },
                //图片个数限制
                limitSize: 5,
                //图片最多个数
                limitMaxSize: 5,
            }
        },
        mounted() {
            this.btnSearchMaterialCategory();
        },
        methods: {
            // aaa(item){
            //     let viewer = new Viewer(document.getElementById(item.url), {
            //
            //         url: item.url,
            //
            //     });
            // },
            //对是否失效处理
            effectiveHandle(row) {
                if (row.effective == 1) {
                    return '有效'
                } else {
                    return '无效'
                }
            },
            /************************物品大类**********************************/
            //查询物品大类信息
            btnSearchMaterialCategory: function () {
                let that = this;
                //清理物品信息
                that.material = {
                    name: '',
                    abbreviation: '',//简称
                    effective: 2,
                    materialSubCategoryId: 0
                }
                that.materialData = [];
                that.tableLengthMaterial = 0;
                //清理物品子类信息
                that.materialSubCategory = {
                    name: '',
                    effective: 2,
                    materialCategoryId: 0
                }
                that.materialSubCategoryData = [];
                that.tableLengthMaterialSubCategory = 0;
                //清理物品大类
                that.materialCategoryData = [];
                that.tableLengthMaterialCategory = 0;
                that.materialCategoryLoading = true;
                let url = "/material/searchMaterialCategory";
                let param = {
                    name: that.materialCategory.name,
                    effective: that.materialCategory.effective,
                    size: that.pageSizeMaterialCategory,// 每页的记录数（行数）
                    page: that.pageMaterialCategory//第几条开始
                }
                this.post_url(url, param, "物品大类查询失败！", null).then(function (res) {
                    that.materialCategoryLoading = false;
                    console.info("查询物品大类返回体", res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.materialCategoryData = res.data.list;
                        that.tableLengthMaterialCategory = res.data.total;
                        if (res.data.total > 0) {
                            that.$refs.materialCategory.setCurrentRow(res.data.list[0]);
                        }
                    }
                }).catch(res => {
                    console.info("查询物品大类返回体报错", res);
                    that.materialCategoryLoading = false;
                });
            },
            //打开物品大类信息新增页面
            btnNewMaterialCategory: function () {
                let that = this;
                that.addFormVisibleMaterialCategory = true;//打开新增页面
                that.addFormMaterialCategory = {
                    name: ""
                };//重置form信息
            },
            //提交新增物品大类信息
            addSubmitMaterialCategory: function () {
                this.$refs.addFormMaterialCategory.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoadingMaterialCategory = true;
                            let that = this;
                            let url = "/material/addMaterialCategory";//新增物品大类
                            let param = that.addFormMaterialCategory;
                            this.post_url(url, param, "新增物品大类失败！", null).then(function (res) {
                                that.addLoadingMaterialCategory = false;
                                console.info("新增物品大类返回体", res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增物品大类成功");
                                    that.addFormVisibleMaterialCategory = false;
                                    that.btnSearchMaterialCategory();
                                } else {
                                    that.$message.error("新增物品大类失败");
                                }
                            }).catch(() => {
                                that.addLoadingMaterialCategory = false
                            });
                        });
                    }
                });
            },
            //打开物品大类信息编辑页面
            btnEditMaterialCategory: function () {
                let that = this;
                if (this.materialCategorySelect.name == null) {
                    this.$alert('请选择要编辑的数据', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    console.info("是否有效", this.materialCategorySelect.effective)
                    that.editFormVisibleMaterialCategory = true;//打开编辑页面
                    that.editFormMaterialCategory = {
                        name: this.materialCategorySelect.name,//名称
                        id: this.materialCategorySelect.id,//主键
                        effective: this.materialCategorySelect.effective,//是否有效
                    };//重置form信息
                }
            },
            //提交修改物品大类信息
            editSubmitMaterialCategory: function () {
                this.$refs.editFormMaterialCategory.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoadingMaterialCategory = true;
                            let that = this;
                            let url = "/material/updateMaterialCategory";//修改物品大类
                            let param = that.editFormMaterialCategory;
                            this.post_url(url, param, "修改物品大类失败！", null).then(function (res) {
                                that.editLoadingMaterialCategory = false;
                                console.info("修改物品大类返回体", res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改物品大类成功");
                                    that.editFormVisibleMaterialCategory = false;
                                    that.btnSearchMaterialCategory();
                                } else {
                                    that.$message.error("新增物品大类失败");
                                }
                            }).catch(() => {
                                that.editLoadingMaterialCategory = false
                            });
                        });
                    }
                });
            },
            //删除物品大类信息
            btnDeleteMaterialCategory: function () {
                let that = this;
                let ids = this.materialCategorySelect.id;
                if (ids == '' || ids == null) {
                    this.$alert('请选择要删除的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        that.materialCategoryLoading = true;
                        let param = {
                            id: this.materialCategorySelect.id//删除 物品大类
                        }
                        let url = "/material/deleteMaterialCategory";//删除物品大类
                        this.post_url(url, param, "删除物品大类失败！", null).then(function (res) {
                            that.materialCategoryLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除物品大类成功");
                                that.btnSearchMaterialCategory();
                            }
                        }).catch(() => {
                            that.materialCategoryLoading = false;
                            that.$message.warning("删除物品大类失败");
                        });
                    }).catch(() => {
                        that.materialCategoryLoading = false;
                        that.$message.warning("删除物品大类失败");
                    });
                }
            },
            //点击物品大类row触发事件
            rowChangeMaterialCategoryData: function (row) {
                if (row != null && row.id != null) {
                    this.materialCategorySelect = row;
                    this.materialSubCategory.materialCategoryId = row.id;
                    this.btnSearchMaterialSubCategory();
                }
            },
            //物品大类table改变一页多少行触发事件
            handleSizeChangeMaterialCategory: function (size) {
                if (size != this.pageSizeMaterialCategory) {
                    this.pageSizeMaterialCategory = size;
                    this.btnSearchMaterialCategory();
                }
            },
            //物品大类改变页面触发事件
            handleCurrentChangeMaterialCategory: function (page) {
                if (page != this.pageMaterialCategory) {
                    this.pageMaterialCategory = page;
                    this.btnSearchMaterialCategory();
                }
            },
            /************************物品子类**********************************/
            //物品子类的查询
            btnSearchMaterialSubCategory: function () {
                let that = this;
                // 查询子类默认把物品删除
                that.materialData = [];
                that.tableLengthMaterial = 0;

                that.materialSubCategoryData = [];
                that.tableLengthMaterialSubCategory = 0;
                that.materialSubCategoryLoading = true;
                let url = "/material/searchMaterialSubCategory";
                let param = {
                    name: that.materialSubCategory.name,
                    effective: that.materialSubCategory.effective,
                    size: that.pageSizeMaterialSubCategory,// 每页的记录数（行数）
                    page: that.pageMaterialSubCategory,//第几条开始
                    materialCategoryId: that.materialSubCategory.materialCategoryId
                }
                this.post_url(url, param, "物品子类查询失败！", null).then(function (res) {
                    that.materialSubCategoryLoading = false;
                    console.info("查询物品子类返回体", res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.materialSubCategoryData = res.data.list;
                        that.tableLengthMaterialSubCategory = res.data.total;
                        if (res.data.total > 0) {
                            that.$refs.materialSubCategory.setCurrentRow(res.data.list[0]);
                        }
                    }
                }).catch(res => {
                    console.info("查询物品子类返回体报错", res);
                    that.materialSubCategoryLoading = false;
                });
            },
            //打开物品子类信息新增页面
            btnNewMaterialSubCategory: function () {
                let that = this;
                if (that.materialCategorySelect.name == null) {
                    that.$alert('请先选择物品大类', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    that.materialCategoryList = [];
                    that.addFormVisibleMaterialSubCategory = true;//打开新增页面
                    that.addFormMaterialSubCategory = {
                        name: "",
                        materialCategoryId: that.materialCategorySelect.id,
                    };//重置form信息
                    let url = "/material/searchAllMaterialCategory";//查询全部角色
                    let param = {};
                    this.post_url(url, param, "物品大类查询全部失败！").then(function (res) {
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.materialCategoryList = res.data;//物品大类List
                        } else {
                            that.$message.error("物品大类查询全部失败！");
                        }
                    }).catch(res => {
                        console.info("物品大类查询全部失败", res);
                    });

                }
            },
            //物品子类新增的提交
            addSubmitMaterialSubCategory: function () {
                this.$refs.addFormMaterialSubCategory.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoadingMaterialSubCategory = true;
                            let that = this;
                            let url = "/material/addMaterialSubCategory";//新增物品子类
                            let param = that.addFormMaterialSubCategory;
                            this.post_url(url, param, "新增物品子类失败！", null).then(function (res) {
                                that.addLoadingMaterialSubCategory = false;
                                console.info("新增物品子类返回体", res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增物品子类成功");
                                    that.addFormVisibleMaterialSubCategory = false;
                                    that.btnSearchMaterialSubCategory();
                                } else {
                                    that.$message.error("新增物品子类失败");
                                }
                            }).catch(() => {
                                that.addLoadingMaterialSubCategory = false
                            });
                        });
                    }
                });
            },
            //打开物品子类信息编辑页面
            btnEditMaterialSubCategory: function () {
                let that = this;
                if (this.materialSubCategorySelect.name == null) {
                    this.$alert('请选择要编辑的数据', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    console.info("是否有效", this.materialSubCategorySelect.effective)
                    that.editFormVisibleMaterialSubCategory = true;//打开编辑页面
                    that.editFormMaterialSubCategory = {
                        name: this.materialSubCategorySelect.name,//名称
                        id: this.materialSubCategorySelect.id,//主键
                        effective: this.materialSubCategorySelect.effective,//是否有效
                        materialCategoryId: this.materialSubCategorySelect.materialCategoryId,//大类Id
                    };//重置form信息
                    let url = "/material/searchAllMaterialCategory";//查询全部角色
                    let param = {};
                    this.post_url(url, param, "物品大类查询全部失败！").then(function (res) {
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.materialCategoryList = res.data;//物品大类List
                        } else {
                            that.$message.error("物品大类查询全部失败！");
                        }
                    }).catch(res => {
                        console.info("物品大类查询全部失败", res);
                    });
                }
            },
            //物品子类修改提交
            editSubmitMaterialSubCategory: function () {
                this.$refs.editFormMaterialSubCategory.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoadingMaterialSubCategory = true;
                            let that = this;
                            let url = "/material/updateMaterialSubCategory";//修改物品子类
                            let param = that.editFormMaterialSubCategory;
                            this.post_url(url, param, "修改物品子类失败！", null).then(function (res) {
                                that.editLoadingMaterialSubCategory = false;
                                console.info("修改物品子类返回体", res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改物品子类成功");
                                    that.editFormVisibleMaterialSubCategory = false;
                                    that.btnSearchMaterialSubCategory();
                                } else {
                                    that.$message.error("新增物品子类失败");
                                }
                            }).catch(() => {
                                that.editLoadingMaterialSubCategory = false
                            });
                        });
                    }
                });
            },
            //删除物品子类信息
            btnDeleteMaterialSubCategory: function () {
                let that = this;
                let ids = this.materialSubCategorySelect.id;
                if (ids == '' || ids == null) {
                    this.$alert('请选择要删除的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        that.materialSubCategoryLoading = true;
                        let param = {
                            id: this.materialSubCategorySelect.id//删除 物品子类
                        }
                        let url = "/material/deleteMaterialSubCategory";//删除物品子类
                        this.post_url(url, param, "删除物品子类失败！", null).then(function (res) {
                            that.materialSubCategoryLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除物品子类成功");
                                that.btnSearchMaterialSubCategory();
                            }
                        }).catch(() => {
                            that.materialSubCategoryLoading = false;
                            that.$message.warning("删除物品子类失败");
                        });
                    }).catch(() => {
                        that.materialSubCategoryLoading = false;
                        that.$message.warning("删除物品子类失败");
                    });
                }
            },
            //点击物品子类row触发事件
            rowChangeMaterialSubCategoryData: function (row) {
                if (row != null && row.id != null) {
                    this.materialSubCategorySelect = row;
                    this.material.materialSubCategoryId = row.id;
                    this.materialSelect = {};
                    this.btnSearchMaterial();
                }
            },
            //物品子类table改变一页多少行触发事件
            handleSizeChangeMaterialSubCategory: function (size) {
                if (size != this.pageSizeMaterialSubCategory) {
                    this.pageSizeMaterialSubCategory = size;
                    this.btnSearchMaterialSubCategory();
                }
            },
            //物品子类改变页面触发事件
            handleCurrentChangeMaterialSubCategory: function (page) {
                if (page != this.pageMaterialSubCategory) {
                    this.pageMaterialSubCategory = page;
                    this.btnSearchMaterialSubCategory();
                }
            },
            /************************物品**********************************/
            //改变物品大类触发事件
            materialCategoryChange: function (row) {
                let that = this;
                that.materialSubCategoryList = [];
                that.addFormMaterial.materialSubCategoryId = "";
                console.info("物品大类触发改变事件", row)
                let url = "/material/searchAllMaterialSubCategory";//查询全部子类
                let param = {
                    materialCategoryId: row
                };
                this.post_url(url, param, "物品子类查询全部失败！").then(function (res) {
                    console.info("物品子类查询全部", res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.materialSubCategoryList = res.data;//物品子类List
                        if (res.data.length > 0) {
                            that.addFormMaterial.materialSubCategoryId = res.data[0].id;
                        }
                    } else {
                        that.$message.error("物品子类查询全部失败！");
                    }
                }).catch(res => {
                    console.info("物品子类查询全部失败", res);
                });
            },
            //改变物品大类触发事件
            materialCategoryChangeUpdate: function (row) {
                let that = this;
                that.materialSubCategoryList = [];
                that.editFormMaterial.materialSubCategoryId = "";
                console.info("物品大类触发改变事件", row)
                let url = "/material/searchAllMaterialSubCategory";//查询全部子类
                let param = {
                    materialCategoryId: row
                };
                this.post_url(url, param, "物品子类查询全部失败！").then(function (res) {
                    console.info("物品子类查询全部", res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.materialSubCategoryList = res.data;//物品子类List
                        if (res.data.length > 0) {
                            that.editFormMaterial.materialSubCategoryId = res.data[0].id;
                        }
                    } else {
                        that.$message.error("物品子类查询全部失败！");
                    }
                }).catch(res => {
                    console.info("物品子类查询全部失败", res);
                });
            },
            //物品的查询
            btnSearchMaterial: function () {
                let that = this;
                that.materialData = [];
                that.tableLengthMaterial = 0;
                that.materialLoading = true;
                let url = "/material/searchMaterialByCategory";
                let param = {
                    name: that.material.name,
                    abbreviation: that.material.abbreviation,
                    effective: that.material.effective,
                    size: that.pageSizeMaterial,// 每页的记录数（行数）
                    page: that.pageMaterial,//第几条开始
                    materialSubCategoryId: that.material.materialSubCategoryId
                }
                this.post_url(url, param, "物品查询失败！", null).then(function (res) {
                    that.materialLoading = false;

                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        if (res.data.list != null && res.data.list.length > 0) {
                            for (let i = 0; i < res.data.list.length; i++) {
                                let pictures = res.data.list[i].pictures;
                                for (let j = 0; j < pictures.length; j++) {
                                    let picture = pictures[j].url;
                                    picture = that.getPath() + ":" + that.getPort() + picture;
                                    pictures[j].url = picture;
                                }
                            }
                        }
                        that.materialData = res.data.list;
                        that.tableLengthMaterial = res.data.total;
                    }
                    console.info("查询物品返回体", res);
                }).catch(res => {
                    console.info("查询物品返回体报错", res);
                    that.materialLoading = false;
                });
            },
            //打开物品信息新增页面
            btnNewMaterial: function () {
                let that = this;
                if (that.materialSubCategorySelect.name == null) {
                    that.$alert('请先选择物品', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    that.materialCategoryList = [];
                    that.materialSubCategoryList = [];
                    that.addFormVisibleMaterial = true;//打开新增页面
                    that.addFormMaterial = {
                        name: "",
                        materialCategoryId: that.materialCategorySelect.id,
                        materialSubCategoryId: that.materialSubCategorySelect.id,
                        abbreviation: "",
                        unit: "",
                        type: "",
                        size: "",
                        weight: 0,
                        temperature: 0,
                        price: 0,
                        description: "",
                    };//重置form信息
                    let url = "/material/searchAllMaterialCategory";//查询全部大类
                    let param = {};
                    this.post_url(url, param, "物品大类查询全部失败！").then(function (res) {
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.materialCategoryList = res.data;//物品大类List
                        } else {
                            that.$message.error("物品大类查询全部失败！");
                        }
                    }).catch(res => {
                        console.info("物品大类查询全部失败", res);
                    });
                    url = "/material/searchAllMaterialSubCategory";//查询全部子类
                    param = {
                        materialCategoryId: that.materialCategorySelect.id
                    };
                    this.post_url(url, param, "物品子类查询全部失败！").then(function (res) {
                        console.info("物品子类查询全部", res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.materialSubCategoryList = res.data;//物品子类List
                        } else {
                            that.$message.error("物品子类查询全部失败！");
                        }
                    }).catch(res => {
                        console.info("物品子类查询全部失败", res);
                    });

                }
            },
            //提交物品新增
            addSubmitMaterial: function () {
                this.$refs.addFormMaterial.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoadingMaterial = true;
                            let that = this;
                            let url = "/material/addMaterial";//新增物品
                            let param = that.addFormMaterial;
                            this.post_url(url, param, "新增物品失败！", null).then(function (res) {
                                that.addLoadingMaterial = false;
                                console.info("新增物品返回体", res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("新增物品成功");
                                    that.addFormVisibleMaterial = false;
                                    that.btnSearchMaterial();
                                } else {
                                    that.$message.error("新增物品失败");
                                }
                            }).catch(() => {
                                that.addLoadingMaterial = false
                                that.$message.error("新增物品失败");
                            });
                        });
                    }
                });
            },
            //打开物品信息编辑页面
            btnEditMaterial: function () {
                let that = this;
                if (that.materialSelect.name == null) {
                    that.$alert('请先选择物品', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    that.materialCategoryList = [];
                    that.materialSubCategoryList = [];
                    that.editFormVisibleMaterial = true;//打开新增页面
                    that.editFormMaterial = {
                        id: that.materialSelect.id,
                        effective: that.materialSelect.effective,
                        name: that.materialSelect.name,
                        materialCategoryId: that.materialSelect.materialCategoryId,
                        materialSubCategoryId: that.materialSelect.materialSubCategoryId,
                        abbreviation: that.materialSelect.abbreviation,
                        unit: that.materialSelect.unit,
                        type: that.materialSelect.type,
                        size: that.materialSelect.size,
                        weight: that.materialSelect.weight,
                        temperature: that.materialSelect.temperature,
                        price: that.materialSelect.price,
                        description: that.materialSelect.description,
                    };//重置form信息
                    let url = "/material/searchAllMaterialCategory";//查询全部大类
                    let param = {};
                    this.post_url(url, param, "物品大类查询全部失败！").then(function (res) {
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.materialCategoryList = res.data;//物品大类List
                        } else {
                            that.$message.error("物品大类查询全部失败！");
                        }
                    }).catch(res => {
                        console.info("物品大类查询全部失败", res);
                    });
                    url = "/material/searchAllMaterialSubCategory";//查询全部子类
                    param = {
                        materialCategoryId: that.materialSelect.materialCategoryId
                    };
                    this.post_url(url, param, "物品子类查询全部失败！").then(function (res) {
                        console.info("物品子类查询全部", res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.materialSubCategoryList = res.data;//物品子类List
                        } else {
                            that.$message.error("物品子类查询全部失败！");
                        }
                    }).catch(res => {
                        console.info("物品子类查询全部失败", res);
                    });

                }
            },
            //提交物品编辑
            editSubmitMaterial: function () {
                this.$refs.editFormMaterial.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoadingMaterial = true;
                            let that = this;
                            let url = "/material/updateMaterial";//修改物品
                            let param = that.editFormMaterial;
                            this.post_url(url, param, "修改物品失败！", null).then(function (res) {
                                that.editLoadingMaterial = false;
                                console.info("修改物品返回体", res);
                                if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                    that.$message.success("修改物品成功");
                                    that.editFormVisibleMaterial = false;
                                    that.btnSearchMaterial();
                                } else {
                                    that.$message.error("修改物品失败");
                                }
                            }).catch(() => {
                                that.editLoadingMaterial = false
                                that.$message.error("修改物品失败");
                            });
                        });
                    }
                });
            },
            //删除物品信息
            btnDeleteMaterial: function () {
                let that = this;
                let ids = this.materialSelect.id;
                if (ids == '' || ids == null) {
                    this.$alert('请选择要删除的记录', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        that.materialLoading = true;
                        let param = {
                            id: this.materialSelect.id//删除 物品
                        }
                        let url = "/material/deleteMaterial";//删除物品
                        this.post_url(url, param, "删除物品失败！", null).then(function (res) {
                            that.materialLoading = false;
                            console.info(res);
                            if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                                that.$message.success("删除物品成功");
                                that.btnSearchMaterial();
                            }
                        }).catch(() => {
                            that.materialLoading = false;
                            that.$message.warning("删除物品失败");
                        });
                    }).catch(() => {
                        that.materialLoading = false;
                        that.$message.warning("删除物品失败");
                    });
                }
            },
            //物品图片操作
            operationPicture: function (row) {
                console.info("点击查看图片", row.pictures);
                let that = this;
                that.materialSelect = row;

                that.pictures = row.pictures;
                that.picturesList = [];
                for (let i = 0; i < row.pictures.length; i++) {
                    that.picturesList.push(row.pictures[i].url)
                }
                let size = 5;
                size = that.limitMaxSize - row.pictures.length;
                if (size == 0) {
                    size = -1;
                }
                that.limitSize = size;
                console.info("当前图片个数", size);
                that.pictureMaterialId.materialId = row.id;
                that.editFormVisibleMaterialPicture = true;
            },
            //点击图片
            pictureClick: function (res) {
                console.info("当前点击的图片", res);
                let that = this;
                that.pictureId = res
            },
            //删除图片
            deleteMaterialPicture: function (id) {
                let that = this;
                this.$confirm('确认删除选中照片吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    that.visible = false;
                    let param = {
                        id: id //删除 物品的图片ID
                    }
                    let url = "/material/deleteMaterialPicture";//删除物品的图片
                    this.post_url(url, param, "删除图片失败！", that.visible = false).then(function (res) {
                        that.visible = false;
                        console.info(res);
                        if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                            that.$message.success("删除图片成功");
                            that.editFormVisibleMaterialPicture = false;//关闭图片页面
                            that.pictureId = 0;//清空选择的图片
                            that.materialSelect = {};//清空选择的物品信息
                            that.btnSearchMaterial();
                        }
                    }).catch(() => {
                        that.visible = false;
                        that.$message.warning("删除图片失败");
                    });
                })
            },
            //上传文件
            uploadFile(file) {
                this.fileData.append('picture', file.file);  // append增加数据
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
                    this.fileData.append('materialId', this.materialSelect.id);  // 添加物品ID
                    console.info("提交新增图片materialId", this.materialSelect.id)
                    console.info("提交新增图片List", this.fileList)
                    console.info("提交新增图片信息", this.fileData)
                    let url = "/file/addMaterialPicture";
                    let param = this.fileData;
                    this.postUpload(url, param, "上传图片失败！", null).then(function (res) {
                        if (res.data.code === Variable_global.errorCode.SUCCESS) {
                            that.$message({
                                message: res.data.data,
                                type: 'success'
                            });
                            that.$refs.upload.clearFiles();
                            that.editFormVisibleMaterialPicture = false;
                            that.btnSearchMaterial();
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
            //移除
            handleRemove(file, fileList) {
                this.fileList = fileList;
                // return this.$confirm(`确定移除 ${ file.name }？`);
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
                this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共存在了 ${this.picturesList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            //点击物品row触发事件
            rowChangeMaterialData: function (row) {
                if (row != null && row.id != null) {
                    this.materialSelect = row;
                }
            },
            //物品table改变一页多少行触发事件
            handleSizeChangeMaterial: function (size) {
                if (size != this.pageSizeMaterial) {
                    this.pageSizeMaterial = size;
                    this.btnSearchMaterial();
                }
            },
            //物品改变页面触发事件
            handleCurrentChangeMaterial: function (page) {
                if (page != this.pageMaterial) {
                    this.pageMaterial = page;
                    this.btnSearchMaterial();
                }
            },
        }
    }
</script>

<style>
    .row_el {
        margin-left: 0;
        margin-right: 0
    }
</style>