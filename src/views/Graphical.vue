<template>
    <el-container>
        <el-aside style="width: auto;position: fixed;z-index: 120;height: 100%;" >
            <el-tree :data="treeList" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-aside>
        <el-container class="container-aside" :style="{paddingLeft: '100px'}">
            <el-main >
                <div class="MyAchievement">
                    <div class="MyAchievement-echart">
                        <div class="echart-title">{{title}}</div>
                        <div class="echart-content">
                            <div id="myChart" :style="{width: '1500px', height: '460px'}"></div>
                        </div>
                    </div>
                </div>
                <div style="padding: 0px 90px;margin-top: 50px;margin-bottom: 10px" >
                    <el-radio v-model="radio" label="date" border @change="radioChange">日</el-radio>
                    <el-radio v-model="radio" label="month" border @change="radioChange">月</el-radio>
                    <el-date-picker
                            v-model="value1"
                            :type="type"
                            :value-format="format"
                            placeholder="选择日期">
                    </el-date-picker>
                    <el-dropdown split-button type="primary" @click="searchAll" trigger="click"
                                 style="width:100px;margin-left: 20px ">
                        查询
                        <el-dropdown-menu slot="dropdown" trigger="click">
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="MyAchievement" >
                    <div class="MyAchievement-echart">
                        <div class="echart-title">{{title}}</div>
                        <div class="echart-content">
                            <div id="myChart1" :style="{width: '1500px', height: '460px'}"></div>
                        </div>
                    </div>
                </div>
            </el-main>
            <!--            <Footer></Footer>-->
        </el-container>
    </el-container>
</template>

<script>
    import variable_global from "../global_variable";

    export default {
        name:'graphical',
        data() {
            return {
                format:'yyyy-MM-dd',
                treeId:'',
                value1:'',
                type:'date',
                radio: 'date',
                treeList:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                title:'请点击树层级',
                title1:'选择日期查询数据',
                //点击tree显示数据
                legendData:[],
                xAxisData:[],
                seriesData:[],
                myChart:'',
                //根据日期查询数据
                legendData1:[],
                xAxisData1:[],
                seriesData1:[],
                myChart1:'',
            }
        },
        mounted(){
            this.getTree();
        },
        methods: {
            //查询全部数据
            searchAll(){
                let that = this;
                let url = "/graphical/getAllDraw";
                let param = {
                    type:that.radio,
                    time:that.value1,
                    treeId:that.treeId,
                };
                this.legendData1=[];
                this.xAxisData1=[];
                this.seriesData1=[];
                try {
                    that.clearLine1();
                }catch (e) {

                }
                this.post_url(url, param, "获取全部图形数据！", null).then(function (res) {
                    console.info("全部图形数据返回体", res);
                    if (res.headers.code == variable_global.errorCode.SUCCESS) {
                        let data = res.data;

                        let seriesObject =that.seriesObjectInit();
                        seriesObject.data = [];
                        seriesObject.name='入库';
                        seriesObject.label = that.labelOption();
                        for(let i = 0;i<data.length;i++){
                            that.xAxisData1.push(data[i].goodsName);
                            seriesObject.data.push(data[i].inQuantity);
                        }
                        that.seriesData1.push(seriesObject);

                        seriesObject =that.seriesObjectInit();
                        seriesObject.data = [];
                        seriesObject.name='出库';
                        seriesObject.label = that.labelOption();
                        for(let i = 0;i<data.length;i++){
                            seriesObject.data.push(data[i].outQuantity);
                        }
                        that.seriesData1.push(seriesObject);
                        that.drawLine1("myChart1");
                    }

                }).catch((error) => {
                    console.info(error);
                    that.$message.error("服务器错误！")
                });
            },
            //改变radio事件
            radioChange(data){
                console.info(data);
                this.type = data;
                this.value1 = '';
                if(data=='date'){
                    this.format = 'yyyy-MM-dd';
                }else {
                    this.format = 'yyyy-MM';
                }

            },
            labelOption(){
                let labelOption = {
                    show: true,
                    position: 'insideBottom',
                    distance: 15,
                    align: 'left',
                    verticalAlign: 'middle',
                    rotate: 90,
                    formatter: '{c}  {name|{a}}',
                    fontSize: 16,
                    rich: {
                        name: {
                            textBorderColor: '#fff'
                        }
                    }
                }
                return labelOption;
            },
            seriesObjectInit(){
                let seriesObject = {};
                seriesObject.type = 'bar';
                seriesObject.barWidth = 20;
                seriesObject.itemStyle = {
                    normal: {
                        color: '#00abf7',//设置柱子颜色
                        label: {
                            show: true,//柱子上显示值
                            position: 'top',//值在柱子上方显示
                            textStyle: {
                                color: '#00abf7',//值的颜色
                                fontSize:16,
                            }
                        }
                    }
                };
                return seriesObject;
            },
            //点击tree事件
            handleNodeClick(data) {
                console.log(data);
                this.title=data.label;
                let id = data.id;
                if(data.level==1){
                    this.treeId = id;
                    this.getWarehouseDraw(id);
                }else{
                    this.treeId = '';
                    this.getGoodsDraw(id);
                }

            },
            //获取点击仓库图形数据
            getWarehouseDraw(id){
                let that = this;
                let url = "/graphical/getWarehouseDraw";
                let param = {
                    id:id
                };
                this.legendData=[];
                this.xAxisData=[];
                this.seriesData=[];
                try {
                    that.clearLine();
                }catch (e) {

                }

                this.post_url(url, param, "获取点击仓库图形数据！", null).then(function (res) {
                    console.info("仓库图形数据返回体", res);
                    if (res.headers.code == variable_global.errorCode.SUCCESS) {
                        let data = res.data;
                        let seriesObject = {};
                        seriesObject.type = 'bar';
                        seriesObject.barWidth = 20;
                        seriesObject.itemStyle = {
                            normal: {
                                color: '#00abf7',//设置柱子颜色
                                label: {
                                    show: true,//柱子上显示值
                                    position: 'top',//值在柱子上方显示
                                    textStyle: {
                                        color: '#00abf7',//值的颜色
                                        fontSize:16,
                                    }
                                }
                            }
                        };
                        seriesObject.data = [];
                        for(let i = 0;i<data.length;i++){
                            that.legendData.push(data[i].name);
                            that.xAxisData.push(data[i].name);
                            seriesObject.data.push(data[i].quantity);
                        }
                        that.seriesData.push(seriesObject);
                        that.drawLine("myChart");
                    }

                }).catch((error) => {
                    console.info(error);
                    that.$message.error("服务器错误！")
                });
            },
            //获取点击物品图形数据
            getGoodsDraw(id){
                let that = this;
                let url = "/graphical/getGoodsDraw";
                let param = {
                    id:id
                };
                this.legendData=[];
                this.xAxisData=[];
                this.seriesData=[];
                try {
                    that.clearLine();
                }catch (e) {

                }

                this.post_url(url, param, "获取点击物品图形数据！", null).then(function (res) {
                    console.info("物品图形数据返回体", res);
                    if (res.headers.code == variable_global.errorCode.SUCCESS) {
                        let data = res.data;
                        let seriesObject = {};
                        seriesObject.type = 'bar';
                        seriesObject.barWidth = 20;
                        seriesObject.itemStyle = {
                            normal: {
                                color: '#00abf7',//设置柱子颜色
                                label: {
                                    show: true,//柱子上显示值
                                    position: 'top',//值在柱子上方显示
                                    textStyle: {
                                        color: '#00abf7',//值的颜色
                                        fontSize:16,
                                    }
                                }
                            }
                        };
                        seriesObject.data = [];
                        for(let i = 0;i<data.length;i++){
                            that.legendData.push(data[i].name);
                            that.xAxisData.push(data[i].name);
                            seriesObject.data.push(data[i].quantity);
                        }
                        that.seriesData.push(seriesObject);
                        that.drawLine("myChart");
                    }

                }).catch((error) => {
                    console.info(error);
                    that.$message.error("服务器错误！")
                });
            },
            //获取tree数据
            getTree(){
                let that = this;
                let url = "/graphical/getTree";
                let param = {};
                that.treeList = [];
                this.post_url(url, param, "查询仓库物品层级！", null).then(function (res) {
                    console.info("仓库物品层级返回体", res);
                    if (res.headers.code == variable_global.errorCode.SUCCESS) {
                        that.treeList = res.data;
                    }

                }).catch(() => {
                    that.$message.error("服务器错误！")
                });
            },
            clearLine(){
                this.myChart.clear();
            },
            clearLine1(){
                this.myChart1.clear();
            },
            //绘制echarts
            drawLine(id){
                let myChart = this.$echarts.init(document.getElementById(id));//获取容器元素
                let option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '6%',
                        right: '6%',
                        bottom: '6%',
                        containLabel: true
                    },
                    legend: {
                        data:this.legendData,
                        left: '6%',
                        top: 'top',
                        itemWidth: 15,//图例图标的宽
                        itemHeight: 15,//图例图标的高
                        textStyle: {
                            color: '#3a6186',
                            fontSize:20,
                        }
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            magicType : {show: true, type: ['line', 'bar']},
                        },
                        right: '6%',
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : this.xAxisData,
                            splitLine: {show: false},//去除网格分割线
                            axisTick: {//刻度
                                show: false//不显示刻度线
                            },
                            axisLine: {//坐标线
                                lineStyle: {
                                    type: 'solid',
                                    color: '#e7e7e7',//轴线的颜色
                                    width:'2'//坐标线的宽度
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#3a6186',//坐标值的具体的颜色
                                }
                            },
                            splitLine: {
                                show: false//去掉分割线
                            },
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLine: {//线
                                show: false
                            },
                            axisTick: {//刻度
                                show: false
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#3a6186',//坐标值的具体的颜色
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: ['#e7e7e7'],//分割线的颜色
                                }
                            }
                        }
                    ],
                    series : this.seriesData
                };
                //防止越界，重绘canvas
                window.onresize = myChart.resize;
                myChart.setOption(option);//设置option
                console.info("echarts数据")
                console.info(myChart.getOption())
                this.myChart = myChart;
            },
            //绘制echarts
            drawLine1(id){
                let myChart = this.$echarts.init(document.getElementById(id));//获取容器元素
                let option = {
                    color: ['#003366', '#006699', '#4cabce', '#e5323e'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data:['入库','出库']
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type: 'category',
                            axisTick: {show: false},
                            data : this.xAxisData1,
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLine: {//线
                                show: false
                            },
                            axisTick: {//刻度
                                show: false
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#3a6186',//坐标值的具体的颜色
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: ['#e7e7e7'],//分割线的颜色
                                }
                            }
                        }
                    ],
                    series : this.seriesData1
                };
                //防止越界，重绘canvas
                window.onresize = myChart.resize;
                myChart.setOption(option);//设置option
                console.info("echarts数据")
                console.info(myChart.getOption())
                this.myChart1 = myChart;
            }
        }
    }
</script>

<style  >
    .MyAchievement{
        display: flex;
        flex-direction: column;
        padding:0px 90px;
    }
    .MyAchievement .MyAchievement-echart{
        width: 100%;
        height: 570px;
        border-radius: 10px;
        border:1px solid #d3d9e9;
        box-shadow: 4px 6px 10px -2px #d3d9e9;
        background-color: #fff;
        display: flex;
        flex-direction: column;
    }
    .MyAchievement-echart .echart-title{
        width: 100%;
        height: 70px;
        background-color: #00abf7;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-size: 26px;
        color: #fff;
        text-align: center;
        line-height: 75px;
    }
    .MyAchievement-echart .echart-content{
        width: 100%;
        height: 500px;
        display: flex;
        justify-content: center;
    }
    .echart-content #myChart{
        margin-top: 35px;
    }
</style>