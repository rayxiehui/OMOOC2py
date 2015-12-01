define(['common'], function(common) {

    var Utils = {

        /**
         * 乘法优化,避免浮点误差
         * @param createD
         * @returns {String}
         */
        multiplyOperation: function(arg1,arg2) {
            var m=0,s1=arg1.toString(),s2=arg2.toString();
            try{m+=s1.split(".")[1].length}catch(e){}
            try{m+=s2.split(".")[1].length}catch(e){}
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
        },

        /**
         * 格式化时间
         */
        timeFormat: function(createD) {
            //获的系统时间
            var xd=new Date();
            var xYear= xd.getFullYear();
            var xMonth= xd.getMonth();
            var xDate= xd.getDate();
            var xmd=xd.getTime();
            //当天发布的资讯时间显示格式：小时||分钟||秒
            var d=new Date(createD);
            var year= d.getFullYear();
            var month= d.getMonth();
            var date= d.getDate();
            if(year==xYear&&month==xMonth&&date==xDate){
                var showDate = this.dateFormat2(xmd-createD);
            }else{
                //隔天发布的资讯
                var showDate = this.dateFormat(createD);
            }
            return showDate;
        },

        /**
         * 将指定时间戳转为： HH||MM||ss
         * @param timestamp
         * @return {String}
         */
        dateFormat2:function(timestamp){
            var subTime=timestamp/1000;
            if(subTime/3600>=1){
                return parseInt(subTime/3600)+"小时前";
            }else if(subTime/3600<1&&subTime/60>=1){
                return parseInt(subTime/60)+"分钟前";
            }else if(subTime<60&&subTime>0){
                return parseInt(subTime)+"秒前";
            }else if(subTime<=0){
                return "1"+"秒前";
            }
        },
        /**
         * 将指定时间戳转为： yyyy-mm-dd
         * @param timestamp
         * @return {String}
         */
        dateFormat:function(timestamp,symbol,hour){
            function dateFm(n){ return (n < 10) ? '0'+n : n; }
            var date = new Date(parseInt(timestamp));
            if (symbol) {
                if(hour){
                    return date.getFullYear() +symbol+ dateFm(date.getMonth() + 1) +symbol+ dateFm(date.getDate()) + ' ' + dateFm(date.getHours()) + ':' + dateFm(date.getMinutes()) + ':' + dateFm(date.getSeconds());;
                }
                return date.getFullYear() +symbol+ dateFm(date.getMonth() + 1) +symbol+ dateFm(date.getDate());
            } else {
                if(hour){
                    return date.getFullYear() +'年'+ dateFm(date.getMonth() + 1) +'月'+ dateFm(date.getDate()) +'日 ' + dateFm(date.getHours()) + ':' + dateFm(date.getMinutes()) + ':' + dateFm(date.getSeconds());
                }
                return date.getFullYear() +'年'+ dateFm(date.getMonth() + 1) +'月'+ dateFm(date.getDate()) +'日';
            }
        },
        /**
         * 通过身份证解析生日
         * @param cardNo
         */
        cardNoToBirthday: function(cardNo) {
            var birthday;
            if (cardNo.length === 18) {
                birthday = cardNo.substr(6,4) + '-' + cardNo.substr(10,2)+
                    '-' + cardNo.substr(12,2);
            } else {
                birthday = '19' + cardNo.substr(6,2) + '-' + cardNo.substr(8,2) +
                '-' + cardNo.substr(12,2);
            }
            return birthday;
        },

        /**
         * 通过身份证解析性别
         * @param cardNo
         */
        cardNoToSex: function(cardNo) {
            var str = cardNo.substr(-2,1);
            if (str % 2 == 0) {
                return ' F';
            } else {
                return 'M';
            }
        },

        /**
         *  全角转半角
         * @param obj
         * @returns {boolean}
         */
        toDBC : function(obj) {
            var DBCStr = '';
            if(!obj || !obj.value) return true;
            for(var i=0; i<obj.value.length; i++){
                var c = obj.value.charCodeAt(i);
                if(c == 12288) {
                    DBCStr += String.fromCharCode(32);
                    continue;
                }
                if (c > 65280 && c < 65375) {
                    DBCStr += String.fromCharCode(c - 65248);
                    continue;
                }
                DBCStr += String.fromCharCode(c);
            }
            obj.value = DBCStr;
        },

        /**
         * 生成UUI，fromt raphael.js
         * @param  {[type]} uuidRegEx     [description]
         * @param  {[type]} uuidReplacer)
         * @return {[type]}               RFC4122, version 4 ID
         */
        createUUID : (function (uuidRegEx, uuidReplacer) {
            return function () {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
            };
        })(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == "x" ? r : (r & 3 | 8);
            return v.toString(16);
        }),

        /**
         * 倒记时
         * @param  {object} options         设置参数
         * @param.fresh_text {string}       倒计时结束要显示的文字，默认使用按钮最初的文字
         * @param.count {string}            倒计时的秒数
         * @param.btn {string}              一个input button对像
         * @param.ext_text {string}         在显示的秒数后面要附加的说明性文字
         * @param.callback {string}         倒计时结束要执行的函数，也可以不设置
         */
        doTimeoutCount: function(options) {

            if (typeof(options.fresh_text) === 'undefined'){
                options.fresh_text = options.btn.val();
            }
            options.btn.prop('disabled', false).val(options.count + options.ext_text);

            var handle = setInterval(count_down, 1000);

            // 在每个周期中要执行的操作
            function count_down() {
                if (--options.count > 0) {
                    options.btn.val(options.count + options.ext_text);
                } else {
                    clearInterval(handle);
                    options.btn.removeAttr('disabled').val(options.fresh_text);
                    if (typeof(options.callback) === 'function'){
                        options.callback();
                    }
                }
            }
        },

        /**
         * 格式化日期
         * 把形如 '2015/03/07'或2015-03-07 格式化成为 '2015年03月07日'
         * @param dateStr 需要格式化的日期字符串
         */
        formatDate: function(dateStr) {
            if (dateStr) {
                var newStr = dateStr.replace(/[/-]/,'年');
                return newStr.replace(/[/-]/,'月') + '日';
            }
        },

        /**
         * 格式化日期
         * remove不存在把形如 20150307 格式化成为 '2015年03月07日'
         * remove存在把形如2015-03-07 格式化成为 '20150307'
         * @param dateStr 需要格式化的日期字符串
         */
        formatDate2: function (dateStr, remove) {
            if (dateStr) {
                if (remove) {
                    return dateStr.replace(/[/-]/g, '');
                } else {
                    var year = dateStr.substr(0, 4),
                        month = dateStr.substr(4, 2),
                        day = dateStr.substr(6, 2);
                    var newStr = year + '年' + month + '月' + day + '日';
                    return newStr;
                }
            }

        },

        /**
         * 转千分位
         * loujian 小数位没有千分符
         * @param priceVal
         * @returns {string}
         */
        parseThousands: function(priceVal) {
            if(priceVal){
                priceVal = priceVal + "";
                if(priceVal.indexOf(".") > -1){
                    var numberInt = priceVal.substr(0,priceVal.indexOf("."));
                    numberInt = numberInt.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
                    numberInt = numberInt + priceVal.substr(priceVal.indexOf("."));
                    return numberInt;
                }else{
                    return priceVal.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
                }
            }else if(priceVal == "0"){
                return "0";
            }else {
                return "";
            }
        },
        /**
         * 从千分位还原成原始数值
         * @param priceVal
         * @returns {number}
         */
        decodeThousands: function(priceVal) {
            return Number(((priceVal||'')+'').replace(/,/g, ""));
        },

        /**
         * 公共方法 数字金额转大写
         * @param number 字符串或数字类型，如 9999 或 "9999" 或 "12,255.00"
         *                参数长度1-12位（单位：元，最大单位：千亿）
         * @return str 返回值 "xxxx元整" ，如果数据过长
         * @example C.parseUpperNumberMoney("12,255.00");  // 返回"壹万贰仟贰佰伍拾伍元整"
         */
        parseUpperNumberMoney: function (n) {
            if (isNaN(Number(n)) || !/^\d{1,13}(\.\d+)?$/.test(n))  // 判断是否符合规则
                return "";
            n = n + ""; // 转换为字符串
            n = n.replace(/\,/g, "").replace(/\.(\d{1,2})\d*?$/g, ".$1").replace(/\.[0]+$/, "").replace(/\.([^0]+)[0]+$/, ".$1");  // 替换掉千分位符号和小数点及后面的数

            var unit = "万仟佰拾亿仟佰拾万仟佰拾元", str = "";
            var rightMatch = n.match(/\.(\d*)$/);
            if (rightMatch && rightMatch.length == 2) {
                n = n.replace(rightMatch[0], rightMatch[1]);
                unit += ("角分".substring(0, rightMatch[1].length));
            }
            unit = unit.substr(unit.length - n.length);
            for (var i = 0; i < n.length; i++)
                str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
            return str.replace(/零(仟|佰|拾)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿)/g, "$1").replace(/(.+)零元/g,"$1元").replace(/(亿)万|元(拾)|角(拾)|/g, "$1$2").replace(/^元零?|零$/g, "").replace(/元$/g, "元整");
        },

        /**
         * 公共方法 数值格式转换 使用四舍五入的方式保留位数(不要千分位)
         *          当不是整数或浮点数是取自身值
         * @param number 1234567.128
         * @param median 保留的位数
         */
        numTransform: function(number) {
            number = number || 0;
            return this.parseThousands((Math.floor(Math.floor(number * 1000) / 10) / 100).toFixed(2) + '');
        },
        /** 转换日期格式
         * @param date : 日期格式|String类型 (如：'2012-12-12' | '2012年12月12日' | new Date())
         * @param format : String类型 （如: 'yyyy年MM月dd日'或'yyyy年MM月dd日 hh时mm分ss秒',默认'yyyy-MM-dd'）
         * @example C.parseDateFormat(new Date(), 'yyyy年MM月dd日') 输出："2014年04月29日"
         * @example C.parseDateFormat(new Date()) 输出："2014-04-29"
         * @exmaple C.parseDateFormat("2014-05-07 16:09:47","yyyy年MM月dd日 hh时mm分ss秒")
         *          输出："2014年05月07日 16时09分47秒"
         *          刘彬觉得C.RegexMap.parseDateFormat;正则没有,有问题可以先查查这个地方.
         **/
        parseDateFormat : function (date, format) {
            var addZero = function (val) {
                return /^\d{1}$/.test(val) ? '0' + val : val;
            };
            format = format || 'yyyy-MM-dd';
            var year = '', month = '', day = '', hours = "", minutes = "", seconds = "";
            if (typeof date == 'string') {
                var dateReg = C.RegexMap.parseDateFormat;
                var dateMatch = date.match(dateReg);
                if (dateMatch) {
                    year = dateMatch[1];
                    month = dateMatch[2];
                    day = dateMatch[3];
                    hours = dateMatch[5];
                    minutes = dateMatch[6];
                    seconds = dateMatch[7];
                }
            } else {
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                hours = date.getHours();
                minutes = date.getMinutes();
                seconds = date.getSeconds();
            }
            month = addZero(month);
            day = addZero(day);
            hours = addZero(hours);
            minutes = addZero(minutes);
            seconds = addZero(seconds);
            return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace("hh", hours).replace("mm", minutes).replace("ss", seconds);
        },

        ajax: function(options) {
            if (typeof options.data === 'string') return;
            //default属性为true时使用默认ajax请求
            if (options['default']) {
                delete options['default'];
                $.ajax(options);
            } else {
                // 接口全局参数
                var globalParam = {
                    _request_id : this.createUUID(),
                    // 01:iphone手机  02:android 03：PC客户端  04：微信
                    _channel_id : APP.Global.channelID, //stz 万一utils先加载，而common后加载的话，这个APP.Global.channelID就没值了。所以让它依赖了common
                    // 非加密方式
                    encFlag: 0
                };

                // 规范: data参数必须为json对象不能是字符串
                if (options.data && typeof options.data === 'object') {
                    for (var key in globalParam) {
                        if (options.data[key] === undefined) options.data[key] = globalParam[key];
                    }
                } else if (!options.data) {
                    options.data = globalParam;
                }

                options.data = JSON.stringify(options.data);

                return $.ajax(options); //stz return
            }

        },

        /**
         * 银行卡格式化四位一空格
         * @param [Object] value
         */
        cardNoFormat : function (value) {
            return value.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
        },

        /**
         * 判断参数是否为对象
         * @param [Object] value
         */
        isObject : function(value){
            return toString.call(value) === "[object Object]";
        },
        /**
         * 判断是否为电话号码
         * @param value
         * @returns {boolean}
         */
        isTel: function(value){
            return /^1[34587]\d{9}$/.test(value);
        }

    };

    return Utils;

});
