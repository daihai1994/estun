<template>
    <div style="width: 774px;height: auto;margin: 0 auto;min-height:500px;padding-top: 50px;font-size:20px;">
        <i class="el-icon-warning" style="color:#68B5E2" title="提示"></i><span style="margin-left: 5px;color:#6c6c6c">
        请输入你需要找回登录密码的账号</span>
        <el-form :model="retrieveForm" :rules="retrieveRules" ref="retrieveCode" style="font-size:20px;margin-top:20px"
                 label-position="left">
            <el-form-item prop="username" style="zoom:1;padding:50px 5px 10px 190px;">
                <el-input v-model="retrieveForm.username" placeholder="请输入手机号" style="width: 350px"></el-input>
            </el-form-item>
        </el-form>
        <el-form :model="retrieveForm" :rules="retrieveRules" ref="retrieve" style="font-size:20px;margin-top:20px"
                 label-position="left">
            <el-form-item prop="code" style="zoom:1;padding:0 5px 10px 190px;">
                <el-input v-model="retrieveForm.code" placeholder="短信验证码" style="width: 220px"></el-input>
                <el-button type="primary" style="height: 40px;width: 125px;margin-left: 5px;"
                           :disabled="disabledOperation"
                           @click="getSmsCode">{{buttonText}}
                </el-button>
            </el-form-item>
            <el-form-item prop="password" style="zoom:1;padding:0 5px 10px 190px;">
                <el-input v-model="retrieveForm.password" placeholder="请输入新密码" style="width: 350px"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword" style="zoom:1;padding:0 5px 10px 190px;">
                <el-input v-model="retrieveForm.confirmPassword" placeholder="请输入再次输入新密码"
                          style="width: 350px"></el-input>
            </el-form-item>
            <el-form-item style="zoom:1;padding:0 5px 0 190px;margin:0;color:#6c6c6c">
                <span :style="{'color':dragColor}">{{dragText}}</span>
            </el-form-item>
            <el-form-item style="zoom:1;padding:0 5px 0 190px;width: 350px">
                <DragDiv ref="getDragDiv" v-on:getDrag="updateDrag($event)"></DragDiv>
            </el-form-item>
            <el-form-item style="zoom:1;padding:0 5px 0 190px;">
                <el-button type="primary" style="width: 350px;height: 45px;font-size: 16px;" @click="submit">确 定
                </el-button>
            </el-form-item>
        </el-form>
        <Footer></Footer>
    </div>

</template>

<script>
    import Variable_global from "@/global_variable";
    import Footer from "../views/layout/rightMain/Footer";
    import DragDiv from "../views/DragDiv";

    export default {
        name: "RetrievePassword",
        components: {
            Footer,
            DragDiv
        },
        data() {
            let username = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error("请输入手机号"))
                } else {
                    callback()
                }
            };
            let password = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error("请输入新密码"))
                } else {
                    callback()
                }

            };
            let confirmPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error("请再次输入新密码"))
                } else if (value !== this.retrieveForm.password) {
                    callback(new Error("两次密码不相同！"))
                } else {
                    callback()
                }

            };
            let code = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error("请输入验证码"))
                } else {
                    callback()
                }
            }
            return {
                buttonText: "获取验证码",
                disabledOperation: false,
                retrieveForm: {
                    code: "",
                    password: "",
                    username: "",
                    confirmPassword: ""
                },
                dragText: "为了您的账户安全，请进行安全校验",
                dragColor: "#6c6c6c",
                retrieveRules: {
                    username: [{validator: username, trigger: 'blur'}],
                    code: [{validator: code, trigger: 'blur'}],
                    password: [{validator: password, trigger: 'blur'}],
                    confirmPassword: [{validator: confirmPassword, trigger: 'blur'}],
                },
            }
        },
        methods: {
            updateDrag(params) {
                console.info("进入方法")
                if (params) {
                    this.dragText = "滑动验证成功";
                    this.dragColor = "#00FF7F";
                }
            },
            submit() {
                console.info(this.$refs.getDragDiv.confirmSuccess);
                let drag = this.$refs.getDragDiv.confirmSuccess;
                let that = this;
                if (drag) {
                    const rule1 = new Promise((resolve, reject) => {
                        that.$refs.retrieveCode.validate(sta => {
                            if (sta) {
                                resolve();
                            } else {
                                console.info("表单一验证不通过");
                                return false;
                            }
                        });
                    })
                    const rule2 = new Promise((resolve, reject) => {
                        that.$refs.retrieve.validate(sta => {
                            if (sta) {
                                resolve();
                            } else {
                                console.info("表单二验证不通过");
                                return false;
                            }
                        });
                    })
                    Promise.all([rule1, rule2]).then(() => {
                        let url = "user/recoverPassword";
                        let param = that.retrieveForm;
                        this.post_url_notEncryption(url, param, "重置密码失败！").then(function (res) {
                            console.info("重置密码返回体", res);
                            if (res.data.code == Variable_global.errorCode.SUCCESS) {
                                that.retrieveForm = {
                                    code: "",
                                    password: "",
                                    username: "",
                                    confirmPassword: ""
                                };
                                location.href = that.getLocationHref();
                            } else {
                                that.$message.error("重置密码失败！");
                            }
                        }).catch(function (res) {
                            that.$message.error("服务器繁忙！");
                        });
                    })


                } else {
                    this.dragText = "滑动验证失败";
                    this.dragColor = "red";
                }
            },
            getSmsCode() {
                let that = this;
                that.$refs.retrieveCode.validate(state => {
                    if (state) {
                        let url = "sms/getSmsCode";
                        let param = {
                            username: that.retrieveForm.username
                        }
                        that.disabledOperation = true;
                        that.buttonText = 60;
                        let interval = setInterval(function () {
                            that.buttonText = that.buttonText - 1;
                        }, 1000)
                        setTimeout(function () {
                            that.disabledOperation = false;
                            that.buttonText = "获取验证码";
                            clearInterval(interval);
                        }, 60000)
                        this.post_url_notEncryption(url, param, "获取短信验证码失败！").then(function (res) {
                            console.info(res)
                            if (res.data.code == Variable_global.errorCode.SUCCESS) {
                                // that.retrieveForm.code = res.data.verifyCode;
                            } else {
                                that.$message.error("获取短信验证码失败！");
                            }
                        }).catch(function (res) {
                            that.$message.error("服务器繁忙！");
                        });
                    }
                });

            }
        }

    }
</script>

<style scoped>

</style>