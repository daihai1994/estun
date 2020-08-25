<template>
    <div>
        <!--工具条-->
        <el-col :span="24"  style="padding-bottom: 0;">
            <el-form :inline="true" :model="filters" >
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

                    <el-table
                            :data="date.row.logisticsList"
                            :header-cell-style="tableHeaderColor"
                            border
                            highlight-current-row
                            style="width: 100%;">
                        <el-table-column
                                prop="logisticsNumber"
                                label="快递单号">
                        </el-table-column>
                        <el-table-column
                                prop="deliveryTime"
                                label="发货时间">
                        </el-table-column>
                        <el-table-column
                                prop="statusId"
                                label="快递状态"
                                :formatter="analysisLogisticsStatus">
                        </el-table-column>
                        <el-table-column
                                prop="logisticsCompany"
                                label="物流公司">
                        </el-table-column>
                        <el-table-column
                                prop="totalPrice"
                                label="总价">
                        </el-table-column>
                        <el-table-column
                                prop="goodsPrice"
                                label="物品总价">
                        </el-table-column>
                        <el-table-column
                                prop="otherPrice"
                                label="其它价钱">
                        </el-table-column>
                        <el-table-column
                                prop="otherPriceReason"
                                label="价钱说明">
                        </el-table-column>
                        <el-table-column
                                prop="consignee"
                                label="收货人">
                        </el-table-column>
                        <el-table-column
                                prop="phone"
                                label="收货号码">
                        </el-table-column>
                        <el-table-column
                                prop="addressShipping"
                                label="收货地址">
                        </el-table-column>
<!--                        <el-table-column-->
<!--                                fixed="right"-->
<!--                                label="操作">-->
<!--                            <template slot-scope="scope">-->
<!--                                <el-button type="text" @click="logisticsClickUpdate(scope.row)" size="small">编辑</el-button>-->
<!--                                <el-button type="text" @click="deleteLogistics(scope.row)" size="small">删除</el-button>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                    </el-table>
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
                <template slot-scope="date">
                    <el-button type="text" @click="printingClick(date.row)" size="small">打印页面</el-button>
                    <el-button type="text" @click="logisticsClick(date.row)" size="small">物流信息</el-button>
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

                    <el-table
                            :data="printOrderList.logisticsList"
                            :header-cell-style="tableHeaderColor"
                            border
                            highlight-current-row
                            style="width: 100%;font-size: 10px;margin-top: 10px">
                        <el-table-column
                                prop="logisticsNumber"
                                label="快递单号">
                        </el-table-column>
                        <el-table-column
                                prop="deliveryTime"
                                label="发货时间">
                        </el-table-column>
                        <el-table-column
                                prop="statusId"
                                label="快递状态"
                                :formatter="analysisLogisticsStatus">
                        </el-table-column>
                        <el-table-column
                                prop="logisticsCompany"
                                label="物流公司">
                        </el-table-column>
                        <el-table-column
                                prop="totalPrice"
                                label="总价">
                        </el-table-column>
                        <el-table-column
                                prop="goodsPrice"
                                label="物品总价">
                        </el-table-column>
                        <el-table-column
                                prop="otherPrice"
                                label="其它价钱">
                        </el-table-column>
                        <el-table-column
                                prop="otherPriceReason"
                                label="价钱说明">
                        </el-table-column>
<!--                        <el-table-column-->
<!--                                prop="consignee"-->
<!--                                label="收货人">-->
<!--                        </el-table-column>-->
<!--                        <el-table-column-->
<!--                                prop="phone"-->
<!--                                label="收货号码">-->
<!--                        </el-table-column>-->
<!--                        <el-table-column-->
<!--                                prop="addressShipping"-->
<!--                                label="收货地址">-->
<!--                        </el-table-column>-->
                    </el-table>
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
        <!--物流信息界面-->
        <el-dialog title="物流信息" :visible.sync="logisticsFormVisible" :fullscreen="true" :close-on-click-modal="false">
            <el-form :model="logisticsForm" :rules="logisticsFormRules" label-width="100px"  ref="logisticsForm">
                <el-form-item label="订单号" >
                    <el-input v-model="logisticsForm.orderNumber"  style="width:217px;margin-right: 10px " disabled auto-complete="off" ></el-input>
                    <el-button type="primary" @click="openGoodsDrawer">新增物流</el-button>
                </el-form-item>

                <el-table
                        ref="orderPreview"
                        :data="logisticsForm.logisticsList"
                        :header-cell-style="tableHeaderColor"
                        border
                        highlight-current-row
                        style="width: 100%;">
                    <el-table-column
                            prop="logisticsNumber"
                            label="快递单号">
                    </el-table-column>
                    <el-table-column
                            prop="deliveryTime"
                            label="发货时间">
                    </el-table-column>
                    <el-table-column
                            prop="statusId"
                            label="快递状态"
                            :formatter="analysisLogisticsStatus">
                    </el-table-column>
                    <el-table-column
                            prop="logisticsCompany"
                            label="物流公司">
                    </el-table-column>
                    <el-table-column
                            prop="totalPrice"
                            label="总价">
                    </el-table-column>
                    <el-table-column
                            prop="goodsPrice"
                            label="物品总价">
                    </el-table-column>
                    <el-table-column
                            prop="otherPrice"
                            label="其它价钱">
                    </el-table-column>
                    <el-table-column
                            prop="otherPriceReason"
                            label="价钱说明">
                    </el-table-column>
                    <el-table-column
                            prop="consignee"
                            label="收货人">
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="收货号码">
                    </el-table-column>
                    <el-table-column
                            prop="addressShipping"
                            label="收货地址">
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="logisticsClickUpdate(scope.row)" size="small">编辑</el-button>
                            <el-button type="text" @click="deleteLogistics(scope.row)" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="logisticsFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">{{addLoading?'提交中...':'确定'}}</el-button>
            </div>
        </el-dialog>
        <el-drawer
                :visible.sync="drawerDialog"
                direction="rtl"
                size="52%"
                custom-class="demo-drawer"
                ref="drawer">
            <div style="width: 99%">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <span style="margin-left: 50px">物流信息</span>
                        <el-form :model="addFormDrawer" :rules="addFormDrawerRules" ref="addFormDrawer" label-width="100px" style="margin: 50px">
                            <el-form-item label="快递单号" prop="logisticsNumber">
                                <el-input v-model="addFormDrawer.logisticsNumber" style="width:217px " auto-complete="off" ></el-input>
                            </el-form-item>
                            <el-form-item label="物流公司" prop="logisticsCompany">
                                <el-input  v-model="addFormDrawer.logisticsCompany" style="width:217px " auto-complete="off" ></el-input>
                            </el-form-item>
                            <el-form-item label="总价" prop="totalPrice">
                                <el-input  v-model="addFormDrawer.totalPrice" style="width:217px " auto-complete="off" ></el-input>
                            </el-form-item>
                            <el-form-item label="物品总价" prop="goodsPrice">
                                <el-input  v-model="addFormDrawer.goodsPrice" style="width:217px " auto-complete="off" ></el-input>
                            </el-form-item>
                            <el-form-item label="其它价钱" prop="otherPrice">
                                <el-input  v-model="addFormDrawer.otherPrice" style="width:217px " auto-complete="off" ></el-input>
                            </el-form-item>
                            <el-form-item label="价钱说明" prop="otherPriceReason">
                                <el-input  v-model="addFormDrawer.otherPriceReason" style="width:217px " auto-complete="off" ></el-input>
                            </el-form-item>
                            <el-form-item label="收货人" prop="consignee">
                                <el-input  v-model="addFormDrawer.consignee" style="width:217px " auto-complete="off" ></el-input>
                            </el-form-item>
                            <el-form-item label="收货人号码" prop="phone">
                                <el-input  v-model="addFormDrawer.phone" style="width:217px " auto-complete="off" ></el-input>
                            </el-form-item>
                            <el-form-item label="收货人地址" prop="addressShipping">
                                <el-input  v-model="addFormDrawer.addressShipping" style="width:217px " auto-complete="off" ></el-input>
                            </el-form-item>
                            <el-form-item label="发货时间" prop="deliveryTime">
                                <el-date-picker  v-model="addFormDrawer.deliveryTime" value-format="yyyy-MM-dd HH:mm:ss"  type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="12">
                        <span style="margin-left: 50px">物品信息</span>
                        <el-form :model="addFormDrawerGoods" :rules="addFormDrawerGoodsRules" ref="addFormDrawerGoods" label-width="100px" style="margin: 50px">
                            <el-form-item label="物品" prop="goodsId">
                                <el-select v-model="addFormDrawerGoods.goodsId"  filterable placeholder="请选择">
                                    <el-option
                                            v-for="item in goodsList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数量" prop="quantity">
                                <el-input-number :min="0"  v-model="addFormDrawerGoods.quantity" style="width:217px " auto-complete="off" ></el-input-number>
                            </el-form-item>
                            <el-form-item label="单价" prop="unitPrice">
                                <el-input-number :min="0"  v-model="addFormDrawerGoods.unitPrice" style="width:217px " auto-complete="off" ></el-input-number>
                            </el-form-item>
                            <el-form-item label="实收单价" prop="realPrice">
                                <el-input-number :min="0"  v-model="addFormDrawerGoods.realPrice" style="width:217px " auto-complete="off" ></el-input-number>
                            </el-form-item>
                            <el-form-item label="总价" prop="totalPrice">
                                <el-input-number :min="0"  v-model="addFormDrawerGoods.totalPrice" style="width:217px " auto-complete="off" ></el-input-number>
                            </el-form-item>
                            <el-form-item label="备注" prop="remarks">
                                <el-input type="textarea"  rows="2" v-model="addFormDrawerGoods.remarks" style="width:217px " auto-complete="off" ></el-input>
                            </el-form-item>
                        </el-form>
                        <div style="margin-right: 50px;float: right" >
                            <el-button @click="reset()">重置</el-button>
                            <el-button type="primary" @click="submitGoodsDrawer()" :loading="addFormGoodsLoading">{{ addFormGoodsLoading ? '提交中 ...' : '确 定' }}</el-button>
                        </div>
                    </el-col>
                </el-row>
                <div style="margin: 0 50px">
                    <el-table
                            ref="goodsLogistics"
                            :data="addFormDrawer.goodsList"
                            :header-cell-style="tableHeaderColor"
                            border
                            highlight-current-row
                            style="width: 100%;">
                        <el-table-column
                                prop="goods"
                                label="物品">
                        </el-table-column>
                        <el-table-column
                                prop="quantity"
                                label="数量">
                        </el-table-column>
                        <el-table-column
                                prop="unitPrice"
                                label="单价">
                        </el-table-column>
                        <el-table-column
                                prop="realPrice"
                                label="实收单价">
                        </el-table-column>
                        <el-table-column
                                prop="totalPrice"
                                label="总价">
                        </el-table-column>
                        <el-table-column
                                prop="remarks"
                                label="备注">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="goodsClick(scope.row)" size="small">编辑</el-button>
                                <el-button type="text" @click="deleteGoods(scope.row)" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div  style="float: right;margin-right: 50px;margin-top: 50px">
                    <el-button @click="drawerDialog=false">取 消</el-button>
                    <el-button type="primary" @click="submitDrawer()" :loading="drawerLoading">{{ drawerLoading ? '提交中 ...' : '确 定' }}</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    import Variable_global from '../global_variable.js'
    export default {
        name: "Logistics",

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
                drawerDialog:false,
                addFormGoodsLoading:false,
                drawerLoading:false,
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
                    statusId:2,//状态
                },
                logisticsForm:{
                    orderNumber:'',
                    logisticsList:[],
                },
                logisticsFormRules: {
                    orderNumber: [{ required: true, message: '订单号不能为空', trigger: 'change' },],
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
                logisticsFormVisible:false,
                addFormDrawer:{
                    uuid:'',
                    logisticsNumber:'',
                    logisticsCompany:'',
                    totalPrice:'',
                    goodsPrice:'',
                    otherPrice:'',
                    otherPriceReason:'',
                    consignee:'',
                    phone:'',
                    addressShipping:'',
                    deliveryTime:'',
                    goodsList:[],
                },
                addFormDrawerGoods:{
                    uuid:'',
                    goodsId:'',
                    quantity:'',
                    unitPrice:'',
                    realPrice:'',
                    totalPrice:'',
                    remarks:'',
                    goods:'',
                },
                addFormDrawerGoodsRules:{
                    goodsId: [{ required: true, message: '请选择商品', trigger: 'change' },],
                    quantity: [{ required: true, message: '请输入数量', trigger: 'blur' },],
                    unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' },],
                    realPrice: [{ required: true, message: '请输入实收单价', trigger: 'blur' },],
                    totalPrice: [{ required: true, message: '请输入总价', trigger: 'blur' },],
                },
                addFormDrawerRules:{
                    logisticsNumber:[{ required: true, message: '请输入快递单号', trigger: 'blur' },],
                    logisticsCompany:[{ required: true, message: '请输入物流公司', trigger: 'blur' },],
                    totalPrice:[{ required: true, message: '请输入总价', trigger: 'blur' },],
                    goodsPrice:[{ required: true, message: '请输入物品总价', trigger: 'blur' },],
                    otherPrice:[{ required: true, message: '请输入其它总价', trigger: 'blur' },],
                    otherPriceReason:[{ required: true, message: '请输入价钱说明', trigger: 'blur' },],
                    consignee:[{ required: true, message: '请输入收货人', trigger: 'blur' },],
                    phone:[{ required: true, message: '请输入收货人号码', trigger: 'blur' },],
                    addressShipping:[{ required: true, message: '请输入收货人地址', trigger: 'blur' },],
                    deliveryTime: [{ required: true, message: '请选择发货时间', trigger: 'change' },],
                },
                goodsList:[],//物品选择
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
                }
            },
                    //物流信息点击编辑
            logisticsClickUpdate(row){
                console.info("物流信息点击编辑",row);
                this.drawerDialog = true;
                this.addFormDrawer = row;
                this.searchGoodsList();
            },
            //删除物流信息
            deleteLogistics(row){
                console.info("删除物流信息",row);
                let that = this;
                that.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    for(let i = 0;i<that.logisticsForm.logisticsList.length;i++){
                        if(that.addFormDrawer.uuid==that.logisticsForm.logisticsList[i].uuid){
                            that.logisticsForm.logisticsList.splice(i,1)
                            break;
                        }
                    }
                })

            },
            //编辑物品
            goodsClick(row){
                console.info(row);
                this.addFormDrawerGoods = JSON.parse(JSON.stringify(row));
            },
            //删除物品
            deleteGoods(row){
                let that = this;
                that.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    for(let i = 0;i<that.addFormDrawer.goodsList.length;i++){
                        if(that.addFormDrawer.goodsList[i].uuid==row.uuid){
                            that.addFormDrawer.goodsList.splice(i,1)
                            break;
                        }
                    }
                })

            },
            //物流信息提交
            submitDrawer(){
                let that = this;
                that.drawerLoading = true;
                that.$refs.addFormDrawer.validate((valid) => {
                    if(valid){
                        if(that.addFormDrawer.goodsList.length<0){
                            that.$alert('请填写物品信息，如有多个可以填写多个物品', '提示', {
                                dangerouslyUseHTMLString: true
                            });
                        }else{
                            if(that.addFormDrawer.uuid!=null&&that.addFormDrawer.uuid!==''){
                                for(let i = 0;i<that.logisticsForm.logisticsList.length;i++){
                                    if(that.addFormDrawer.uuid==that.logisticsForm.logisticsList[i].uuid){
                                        that.logisticsForm.logisticsList[i] = that.addFormDrawer;
                                        break;
                                    }
                                }
                            }else{
                                that.addFormDrawer.uuid = that.getUuid();
                                that.logisticsForm.logisticsList.unshift(that.addFormDrawer);
                            }
                            console.info("提交物流信息",that.logisticsForm.logisticsList);
                        }

                    }
                    that.drawerLoading = false;
                });
            },
            //物品信息提交
            submitGoodsDrawer(){
                let that = this;
                that.$refs.addFormDrawerGoods.validate((valid) => {
                    if(valid) {
                        that.addFormGoodsLoading = true;
                        let obj = {};
                        for(let i = 0;i<that.goodsList.length;i++){
                            if(that.goodsList[i].id ==that.addFormDrawerGoods.goodsId){
                                obj = that.goodsList[i];
                                break;
                            }
                        }
                        that.addFormDrawerGoods.goods = obj.name;
                        let index = 0;
                        if(that.addFormDrawerGoods.uuid!=null&&that.addFormDrawerGoods.uuid!==''){
                            for(let i = 0;i<that.addFormDrawer.goodsList.length;i++){
                                if(that.addFormDrawer.goodsList[i].uuid==this.addFormDrawerGoods.uuid){
                                    index = i;
                                    that.addFormDrawer.goodsList.splice(i,1)
                                    break;
                                }
                            }
                        }else{
                            that.addFormDrawerGoods.uuid = that.getUuid();
                        }
                        that.addFormDrawer.goodsList.splice(index,0,JSON.parse(JSON.stringify(that.addFormDrawerGoods)));
                        that.addFormGoodsLoading = false;
                         that.reset();
                    }
                })
            },
            //form表单重置
            reset(){
                this.$nextTick(()=>{
                    this.$refs.addFormDrawerGoods.resetFields();
                    this.addFormDrawerGoods.uuid = '';
                    this.addFormDrawerGoods.goods = '';
                })
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
            //新增商品按钮
            openGoodsDrawer(){
                this.drawerDialog = true;
                this.addFormDrawer={
                    uuid:'',
                        logisticsNumber:'',
                        logisticsCompany:'',
                        totalPrice:'',
                        goodsPrice:'',
                        otherPrice:'',
                        otherPriceReason:'',
                        consignee:'',
                        phone:'',
                        addressShipping:'',
                        goodsList:[],
                };
                this.searchGoodsList();

            },
            //物流信息新增提交
            addSubmit(){
                let that = this;
                that.addLoading = true;
                let url = "/logistics/logisticsForOrder";
                if(that.logisticsForm.logisticsList.length<=0){
                    that.$alert('请新增物流信息！', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                    return;
                }
                let param = that.logisticsForm;
                this.post_url(url, param, "物流信息新增失败！", null).then(function (res) {
                    that.addLoading = false;
                    console.info("物流信息新增返回体",res);
                    if (res.headers.code == Variable_global.errorCode.SUCCESS) {
                        that.logisticsFormVisible = false;
                        that.search();
                        that.$message.success("提交成功")
                    }

                }).catch(()=>{
                    that.addLoading = false;
                    that.$message.error("服务器错误！")
                });
            },
            //物流信息按钮
            logisticsClick(row){
                this.logisticsFormVisible = true;
                let list = [];
                if(row.logisticsList!=null){
                    list = row.logisticsList;
                }
                this.logisticsForm={
                    orderNumber:row.orderNumber,
                    logisticsList:list,
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
                this.search();
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
            //查询物流操作
            search: function () {
                let that = this;
                let url = "/logistics/searchLogistics";
                that.currentRow = {};
                let param = {
                    goodsId:that.filters.goodsId,//物品ID
                    applicantId:that.filters.applicantId,//申请人
                    logisticsrId:that.filters.logisticsrId,//审批人
                    startTime:that.filters.startTime,//开始时间
                    endTime:that.filters.endTime,//结束时间
                    consignee:that.filters.consignee,//收货人
                    statusId:that.filters.statusId,//审批状态
                    size: that.pageSize,// 每页的记录数（行数）
                    page: that.page//第几条开始
                };
                that.orderData = [];
                that.listLoading = true;
                this.post_url(url, param, "查询物流信息失败！", null).then(function (res) {
                    that.listLoading = false;
                    console.info("查询物流信息返回体",res);
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

<style >
    /*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
    .el-drawer__body {
        overflow: auto;
    }
    /*2.隐藏滚动条，太丑了*/
    .el-drawer__container ::-webkit-scrollbar{
        display: none;
    }
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