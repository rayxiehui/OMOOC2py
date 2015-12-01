define(function () {

    var Validator = {

        Regex: {
            money : /^(0|[1-9]\d*)(\.\d{1,2})?$/
        },

        validateName: function (objValue, obj) {
            if (obj.attr("type") == "text") {
                objValue = $.trim();
                obj.val(objValue.replace(/\s+/g, ' '));
            }
            if (objValue == '') return '姓名不能为空';
            var totalLength = objValue.length;

            var cnArray = objValue.match(/[\u4e00-\u9fa5\u4dae\uE863]/g);
            if (cnArray) totalLength += cnArray.length;
            for (var i = 0; i < objValue.length; i++) {
                if (objValue.charCodeAt(i) == 183) {
                    if (i == 0 || i == objValue.length - 1)return "姓名格式不正确";
                    if (objValue.charCodeAt(i + 1) == 183)
                        return "姓名格式不正确";
                }
            }
            var space = objValue.match(/([a-zA-Z]\s{2,}[a-zA-Z])/g);
            if (space) return "姓名格式不正确，请重新输入";
            if (!obj.attr('isgroup')) {
                var filterArr = ['公司', '有限', '集团', '股份', '大学'],
                    filterLen = filterArr.length;
                while (filterLen--) {
                    if (objValue.indexOf(filterArr[filterLen]) > -1) {
                        return "抱歉，请不要输入企业名称";
                    }
                }
            }
            var filterArr2 = ['不详', '不祥', '不知道', '未知'],
                filterLen2 = filterArr2.length;
            while (filterLen2--) {
                if (objValue.indexOf(filterArr2[filterLen2]) > -1) {
                    return "姓名格式不正确，请重新输入";
                }
            }
            var maxle = !obj.attr('isgroup') ? 30 : 50;
            if (totalLength > maxle || totalLength < 4) {
                return "姓名需为2~" + (maxle / 2) + "个中文字符（英文4-" + maxle + "）";
            }
            return true;
        },
        //验证用户名
        checkUserName: function(name) {
            if (!name) {
                return {result: false,msg: '用户名不能为空'};
            } else {
                //验证规则
            }
            return {result: true,msg: '用户名验证通过'};
        },

        //验证身份证号码
        checkIdcard: function (objValue) {
            var msg = '',
                idCardLength = objValue.length;
            if (idCardLength == 18) {
                if (objValue.slice(-1) == 'x') {
                    objValue = objValue.slice(0, 17) + 'X';
                }
                var sBirthday = objValue.substr(6, 4) + "-" + Number(objValue.substr(10, 2)) + "-" + Number(objValue.substr(12, 2));
                var d = new Date(sBirthday.replace(/-/g, "/"));
                if (d.getFullYear() < 1900) {
                    return {result: false,msg: "身份证号输入不正确,请您重新检查"};
                }
                if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
                    return {result: false,msg: "身份证号输入不正确,请您重新检查"};
                }

            } else if (idCardLength == 15) {
                var sBirthday = "19" + objValue.substr(6, 2) + "-" + Number(objValue.substr(8, 2)) + "-" + Number(objValue.substr(10, 2));
                var d = new Date(sBirthday.replace(/-/g, "/"))
                if (d.getFullYear() < 1900) {
                    return {result: false,msg: "身份证号输入不正确,请您重新检查"};
                }
                if (sBirthday != (d.getFullYear().toString() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
                    return {result: false,msg: "身份证号输入不正确,请您重新检查"};
                }
            } else if (!idCardLength){
                return {result: false,msg: "身份证号不能为空,请输入身份证号"};
            } else {
                return {result: false,msg: "身份证号输入不正确,请您重新检查"};
            }
            return  {result: true,msg: "身份证号验证通过"};;
        },

        /*
         验证证件号码
         1: 居民身份证
         2: 护照
         3: 军官证或士兵证
         6: 港澳通行证或台胞证
         0: 其他
         */
        checkIdNo: function (idNo, idType) {
            var self = this;
            var idReg = /^\d{17}([0-9]|X)$/gi;
            var checkResult = {result: true};
            var formatErrorResult = {result: false, error: "证件号码格式错误，请重新输入"};

            if (idNo == "") {
                checkResult = {result: false, error: "请输入您的证件号码"};
            } else {
                switch (idType) {
                    // 身份证：15或18位字符
                    case "1" :
                        if(idNo.length == 15){
                            checkResult = {result: false, error: "请输入18位身份证号"};
                        }
                        else if (!(idReg.test(idNo) && self.strDateTime(idNo.substr(6,8)))) {
                            checkResult = formatErrorResult;
                        }
                        break;
                    // 护照 2
                    // 军官证：6-50位字符(可输中文)
                    case '3' :
                        if (!/^[\u4e00-\u9fa5a-zA-Z\d]{6,50}$/.test(idNo)) {
                            checkResult = formatErrorResult;
                        }
                        break;
                    // 港澳台回乡证或台胞证: 5-50位字符，只允许大写字母和数字，最多输入50位
                    case "6" :
                        if (!/^[A-Z\d]{5,50}$/.test(idNo)) {
                            checkResult = formatErrorResult;
                        }
                        break;
                    default :
                        // 其他：3-50位字符，最多输入50位
                        if (!/^[a-zA-Z\d]{3,50}$/.test(idNo)) {
                            checkResult = formatErrorResult;
                        }
                        break;
                }
            }
            return checkResult;
        },

        strDateTime: function (str) {
            var r = str.match(/^(\d{1,4})(-|\/)?(\d{1,2})\2(\d{1,2})$/);
            if(r==null)return false;
            var d= new Date(r[1], r[3]-1, r[4]);
            var now = new Date();
            var minDate = new Date("1900-01-01"), maxDate = new Date(now.getFullYear(),now.getMonth(),now.getDate());
            // 如果不符合最大当前日期，最小1900年1月1日，则不通过日期校验
            if(d < minDate || d > maxDate){
                return false;
            }
            return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
        }
    };

    return Validator
});