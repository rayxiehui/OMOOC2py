/**
 * 公共模块配置
 * @auth wanglin576
 */
define(['jquery', 'underscore', 'store', './utils', 'iScroll'], function($, _, store, utils) {
    /**
     * evaluate        {{ JavaScript code}}
     * interpolate     {{= variable }}
     * escape          {{- variable }}
     */
    _.templateSettings = {
        evaluate:    /\{\{([\s\S]+?)\}\}/g,
        interpolate: /\{\{=(.+?)\}\}/g,
        escape:      /\{\{-(.+?)\}\}/g

    };
    window.logonOut= function() {
        //var sessionid=document.cookie.substring(document.cookie.indexOf("WE_SESSION_ID=")+14,document.cookie.indexOf("WE_SESSION_ID=")+46);
        $.ajax({
            url: APP.config.baseURI + "/esa/nts_cfb_admin.userLogonOut", //?WE_SESSION_ID="+sessionid
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if(res.responseCode=="000000"){
                    self.location='/manage/pages/public/login.html';
                }
            }
        });
    };
    var common = C ={
        RegexMap : {
            MobileNo: /^1[34587]\d{9}$/,
            // 只匹配数字
            Number: /^\d+$/,
            // 匹配中文输入
            NameInput: /[\u4e00-\u9fa5]/,
            // 一位小数
            OneNumber: /^\d+\.\d$/,
            // 两位小数
            TwoNumber: /^\d+\.\d\d$/,
            //千分位正则
            parseThousands: /(\d{1,3})(?=(\d{3})+(?:$|\.))/g,
            //制表符
            table: /\t/g,
            //换行符
            line: /\n/g,
            //正负整数或浮点数
            intOrFloat: /^(-)?\d+(\.\d+)?$/,
            // 银行卡号（大于或等于16位的数字）
            CardNo: /^\d{16,}$/,
            // 短验证码（6位数字以上）
            MobileCode: /^\d{6,}$/,
            // 交易密码(6-16位数字或字母)
            OrderPassword: /^\S{6,16}$/,
            //每4位字符用空格隔开
            bankCardNo: /(\d{4})(?=\d)/g,
            //金额检测
            moneyTest: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
            //卡号屏蔽
            parseToStarNumber: /^(\d{4})(\d+)(\d{4})$/,
            // 后四位屏蔽
            parseRightFourStar: /^(\w+)(\w{4})$/,
            //日期格式检测
            parseDateFormat: /\b(\d{4})\b[^\d]+(\d{1,2})\b[^\d]+(\d{1,2})\b(\s(\d{1,2})\:(\d{1,2})\:(\d{1,2}))?[^\d]?/,
            // 出生日期掩码，显示格式（"19**年**月*2日")
            userBirthdayStarRegex: /(\d{2})\d{2}([^\d]+)\d+([^\d]+)\d?(\d)([^\d]+)?/,
            //金额转换
            moneyReplace: /[^0-9\.]/g,
            //金额判断
            money : /^(0|[1-9]\d*)(\.\d{1,2})?$/,
            // 金额
            numberZeroToTwo: /^\d+\.?\d{0,2}$/,
            // 把电话号码中间4位变成掩码
            parsePhone: /(\d{3}).*(\d{4})/,
            // 字母，数字 下划线
            userName: /^\w{3,30}$/,
            // 旧交易密码
            oldTradePwd: /(^[a-zA-Z0-9]{6,16}$)/,
            // 新交易密码
            newTradePwd: /^[0-9]{6}$/,
            // 验证登录密码
            pwdReg : /(^[/a-zA-Z0-9]{6,16}$)/

        },
        RegexReplacement : {
            parseThousands: '$1,',
            parseToStarNumber: function ($0, $1, $2, $3) {
                return $1 + $2.replace(/\d/g, "*") + $3;
            },
            parseRightFourStar: function ($0, $1, $2) {
                return $1.replace(/\w/g, "*") + $2;
            }
        },
        /**
         * 公共方法 每四位字符后面加一个空格
         * @param cardNo : 123456789asdfg -> 1234 5678 9asd fg
         */
        cardNoTransform : function (cardNo) {
            cardNo = cardNo || '';
            return (cardNo + '').replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
        },
        /**
         * 公共方法 转千分位
         * Params:
         */
        parseThousands:function (priceVal) {
            return ((priceVal || '0') + '').replace(C.RegexMap.parseThousands, C.RegexReplacement.parseThousands);
        },

        /**
         * 跳转至错误页面
         * @param data 错误信息
         */
        errorPage: function(data) {
            var params = data || {};
            window.location.href = '/member/error.shtml?'+$.param(params);
        },

        /**
         * 获取URL参数值
         * @param  {[type]} paramName [要获取的参数名]
         * @return {[type]}           [参数值]
         */
        getParamVal:  function(paramName) {
            var typeMatch = location.search.match(new RegExp("\\b"+ paramName +"=([^&=]+)"));
            return typeMatch ? typeMatch[1] : '';
        },

        /**
         * 获取URL全部参数值
         * 对中文参数自动解码
         */
        getParamVals:  function() {
            var item,value,obj = {},
                href = location.href,
                str = href.substr(href.lastIndexOf('?')+1),
                arr = str.split('&');
            $.each(arr,function(k,v){
                item = v.split('=');
                obj[item[0]] = item[1];
            });
            return obj;
        },
        /**
         * 动态创建loading
         */
        addLoading: function (msg) {
            var text = msg || '加载中...';
            var html = '<div id="J-loading"><div class="loading-warp"></div><div class="new-loading"><div class="loading-icon"><div class="loading-circle">' +
                '</div><div class="loading-cai"></div></div><p class="loading-text">' + text + '</p></div></div>';
            $('body').prepend(html);
        },

        /**
         * 移除loading节点
         */
        removeLoading: function () {
            $('#J-loading').remove();
        },
        /**
         * 设置全局AJAX默认选项
         */
        ajaxSettings: function() {

            $.extend($.ajaxSettings, {
                cache: false,
                timeout: 20000,
                dataType: 'json',
                type:'POST',
                contentType: 'application/json; charset=utf-8'
            });

            $.ajaxSettings.beforeSend = function (xhr, settings) {
                var  path= settings.url;
                //stz 去掉 请求中的WE_SESSION_ID= 的值. 现在开始都不允许带了
                var typeMatch = path.match(new RegExp("\\b"+ 'WE_SESSION_ID' +"=([^&=]+)"));
                typeMatch = typeMatch ? typeMatch[1] : '';
                var WE_SESSION_ID = '', strBefore = '', strAfter = '';
                if(typeMatch){
                    alert('请去掉 请求中的 WE_SESSION_ID 参数！');
                    throw new Error('请去掉 请求中的 WE_SESSION_ID 参数！');
                    WE_SESSION_ID = typeMatch,  WE_SESSION_ID_pos = path.indexOf('WE_SESSION_ID=');
                    strBefore = path.substring(0, WE_SESSION_ID_pos+'WE_SESSION_ID='.length);
                    strAfter = path.substring(WE_SESSION_ID_pos, path.length);
                    if(strAfter.indexOf('&')>0){
                        strAfter = strAfter.substring(strAfter.indexOf('&'), strAfter.length);
                    }else{
                        strAfter = '';
                    }
                    path = strBefore+strAfter;
                }
                if(APP.environment=='statics'){
                    strBefore = path.substring(0, path.indexOf('?'));
                    if(strBefore){
                        strAfter = path.substring(path.indexOf('?'), path.length);
                        path = strBefore + '.json' + strAfter;
                    }else{
                        path+='.json';
                    }
                    settings.type = 'get';
                }
                //var beforeESAStr = path.substring(0,path.indexOf('/esa/')), afterESAStr = path.substring(path.indexOf('/esa/')+4, path.length);
                //path = beforeESAStr + afterESAStr;
                if(APP.environment!='dev' && APP.environment!='statics'){
                    path = path.replace('/esa','');
                }
                settings.url = path;
                var param = settings.data ? JSON.parse(settings.data) : {};
                param.refreshTimeStamp = param.refreshTimeStamp ? param.refreshTimeStamp : (new Date()).getTime();
                settings.data = JSON.stringify(param);
                $('#J-loading').show();
                setTimeout(function(){
                    $('#J-loading').hide();
                },8000)
            };

            $.ajaxSettings.error = function (xhr) {
                alert('请求异常，请稍候再试！');
            };

            $.ajaxSettings.complete = function (xhr, status) {
                $('#J-loading').hide();
                xhr.url = null;
                var response = eval('(' + xhr.responseText + ')');
                if (response) {
                    var code = response.responseCode;
                    // 登录超时
                    if (code == 'AD|700000'||code=="000002"){
                        alert('登录超时, 请重新登录。  状态('+code+')');
                        location.href = '/manage/pages/public/login.html'
                    }
                }

            };
        },

        /**
         * 事件绑定函数
         * @param container 选择器,非必须
         * @param events 要进行绑定的事件对象
         */
        bindEvent: function(events,obj,container) {
            var $contain = $(container||'body');
            for(var ev in events) {
                var index = ev.lastIndexOf(' '),
                    ele = ev.substr(0,index),
                    evType = ev.substr(index+1,ev.length);
                try {
                    $contain.delegate(ele,evType, $.proxy(obj[events[ev]],obj));
                } catch (e) {
                    throw new Error('function '+events[ev]+' undefined');
                }
            }
        },

        /**
         * 日志输出
         * @param msg 日志内容
         */
        logs: function (msg) {
            window.console && console.log && console.log(msg);
        },

        sendLog: function() {

        },

        onError: function() {

            // 非开发环境时
            //if (APP.environment != 'dev') {
            //    window.onerror = function () {
            //        return true;
            //    };
            //
            //}
        },

        /**
         * 动态创建loading
         * @param msg
         */
        generatedLoading: function(msg) {
            var text = msg || '加载中...';
            var html = '<div id="J-loading" style="display: none"><div class="loading-warp"></div><div class="new-loading"><div class="loading-icon"><div class="loading-circle">' +
                '</div><div class="loading-cai"></div></div><p class="loading-text">' + text + '</p></div></div>';
            $('body').prepend(html);
        },

        /**
         * 根据字符串获取对象. 自动补全子对象. 防止因中间某个对象没有定义而报错（很难定位这种错）
         * @param [String] objPath es: 'APP.config.interface.base',
         * ('self.model.productData.investPrdCode', self)
         * 还有个作用就是不用自己写很长的判断去判断中间对象是否存在 如 if(self){ if(self.model){ ... } }. 直接拿最终属性判断是否存在即可,如 if(getObjectByPathAces('a.b.c'))
         */
        getObjectByPathAces: function(objPath, context) {
            var objs = objPath.split('.'), len = objs.length, i;
            if(!context){
                if(!utils.isObject(window[objs[0]])){
                    objs[0] = window[objs[0]] = {};
                }else{
                    objs[0] = window[objs[0]];
                }
            }else{
                objs[0] = context;
            }

            for(i=1; i<len; i++){
                if(!utils.isObject(objs[i-1][objs[i]])){
                    objs[i] = objs[i-1][objs[i]] = {};
                }else{
                    objs[i] = objs[i-1][objs[i]];
                }
            }
            return objs[0];
        },
        initMenu: function(){
            if(!$('#slideWrapper').size()  || common.initMenu.hadInited){
                //login.html 等没有这些菜单的页面不要初始化 菜单 .   hadInited初始化过一次就不要再初始化了
                return;
            }

            var Menu = {
                init: function(){
                    this.leftMenuAffect();
                    //本地开发直接拿菜单   从缓存中拿了[菜单在登陆时 就请求到了( longin.js 里有这个请求)]
                    //if(1||store.get('has_init_dev_menu') && /127|localhost/.test(location.hostname) && (APP.environment=='dev' || APP.environment=='statics')){
                    if(store.get('has_init_dev_menu') && /127|localhost/.test(location.hostname) && (APP.environment=='dev' || APP.environment=='statics')){
                        $.ajax({
                            url: APP.config.baseURI + '/esa/nts_cfb_admin.umAuthenticate',
                            type: 'POST',
                            dataType: 'json',
                            async:false,
                            success: function (res) {
                                if(res.responseCode=="000000"){
                                    if(res.menuList){
                                        store.set('Menus', res.menuList);
                                        store.set('has_init_dev_menu', true);
                                    }else{
                                        alert('此账号没有菜单，请更换账号登陆');
                                    }
                                }
                            }
                        });
                    }
                    this.renderMenu();
                    this.bindMenuEvent();
                },
                //整体菜单收缩展开效果
                leftMenuAffect : function(){
                    var self = this;
                    self.shrinked = false;
                    var slideWrapper = $('#slideWrapper'),  slideOldSpreadWidth = slideWrapper.outerWidth(), slideOldShrinkWidth;
                    slideWrapper.addClass('side-off');
                    //读取缩起菜单时菜单的宽度
                    slideOldShrinkWidth = slideWrapper.outerWidth();
                    slideWrapper.removeClass('side-off');
                    slideWrapper.prop('expend',true);
                    var contentWrapper = $('#contentWrapper'), oldContentMarginLeft = contentWrapper.css('marginLeft');
                    $('.header .logo-l3').click(function(){
                        if(slideWrapper.prop('expend')){
                            slideWrapper.removeProp('expend');
                            slideWrapper.addClass('side-off');
                            //slideWrapper.animate({ width: slideOldShrinkWidth }, "quick", null, function(){
                            //    $(this).addClass('side-off');
                            //});
                            slideWrapper.addClass('side-off');
                            slideWrapper.width(slideOldShrinkWidth);
                            $('.header .logo-l2').hide();
                            contentWrapper.css('marginLeft', slideOldShrinkWidth);
                            //隐藏所有子菜单
                            slideWrapper.find('.parentmenu + ul').hide();
                            self.shrinked = true;
                        }else{//展开
                            slideWrapper.prop('expend',true);
                            //slideWrapper.animate({ width: slideOldSpreadWidth }, "quick", null, function(){
                            //    $(this).removeClass('side-off');
                            //});
                            slideWrapper.removeClass('side-off');
                            slideWrapper.width(slideOldSpreadWidth);
                            $('.header .logo-l2').show();
                            contentWrapper.css('marginLeft', oldContentMarginLeft);
                            self.renderMenu();
                            self.bindMenuEvent();
                            self.shrinked = false;
                        }
                    });
                },
                resetMenuData: function(menulist){
                    function travalMenu(list){
                        _.each(list,function(el){
                            el._isSpread = 'false';
                            el._isActive = 'false';
                            if(el.childMenuList && el.childMenuList.length){
                                //递归菜单
                                travalMenu(el.childMenuList);
                            }
                        });
                    }
                    travalMenu(menulist);
                },
                //画菜单
                /**
                 * 一级菜单样式 parentMenu  childMenu
                 * 其他级菜单样式 parentmenu  childmenu
                 * 数据结构说明：后面加的 _isActive 是标识当前选中的菜单用的，同时把其子菜单显示出来。
                 */
                renderMenu: function(){
                    var menu = store.get('Menus');
                    var slideWrapper = $('#slideWrapper');
                    var curMenuDepth = 1, childMenuHTML = '', parentMenu='';
                    var assignMenu = common.getParamVal('curMenu');
                    //assignMenu 当不是从点击来的时候，既页面直接跳转菜单时通过 url参数标识当前节点所在路径. 路径要满足类似7_2_1_2这样的格式. 之前用^\d(_\d)*缺少单个的情况
                    var tempMenu = null, erroMenuDepth = false;
                    if(assignMenu && assignMenu.match(/^\d$|^\d(_\d)*$/)){
                        assignMenu = assignMenu.split('_');
                        tempMenu = menu; //_.clone(menu);
                        this.resetMenuData(menu);
                        //assignMenu.slice(0, assignMenu.length-1)
                        _.each(assignMenu,function(el, idx){
                            var curDepth = Number(el)-1;
                            if(!tempMenu){
                                alert('菜单层级参数不对，不存在指定的菜单');
                                erroMenuDepth = true;
                                return false;
                            }
                            tempMenu[curDepth]._isSpread = 'true';
                            tempMenu[curDepth]._isActive = 'true';
                            tempMenu = tempMenu[curDepth].childMenuList;
                        });

                    }
                    if(erroMenuDepth){
                        return;
                    }
                    _.each(menu, function(el, idx){
                        //一级菜单文字
                        parentMenu += '<li class="parentmenu'+ (el._isActive=="true"?' parentmenu-focus':'') +'" order="'+ idx +'">';
                        parentMenu += '<h3 class="nav01 nav01-'+ (idx+1) +'">'; //nav01-n 图标
                        parentMenu += '<span class="icon-nav01"></span>';
                        parentMenu += '<span class="nav01-title">'+ el.menuName +'</span>';
                        parentMenu += '</h3>';
                        parentMenu += '<span class="nav-focus2"></span>';
                        parentMenu += '</li>';
                        //从二级菜单开始 父子菜单的结构就都一致了（如三、四两级的和 二三两级的一致）.
                        if(el.childMenuList && el.childMenuList.length){
                            //递归菜单
                            travalMenu(el.childMenuList, el._isSpread);
                            //if(el._isActive){
                            //    parentMenu.addClass('nav01-focus');
                            //    childMenu.show();
                            //}
                            parentMenu += childMenuHTML;
                            childMenuHTML = '';
                        }
                    });
                    slideWrapper.children('ul').html(parentMenu);

                    function travalMenu(menus, _isSpread){
                        childMenuHTML+='<ul'+ (_isSpread=='true'?' style="display:block" is_spread="true"':'') +'>';
                        curMenuDepth++;
                        _.each(menus, function(el, idx){
                            //有子节点：
                            if(el.childNodeFlag===false || (el.childMenuList && el.childMenuList.length)) {
                                //'+ (el._isActive=="true"?' parentmenu-focus':'') +' 非一级菜单的父菜单不加激活样式
                                childMenuHTML+='<li class="parentmenu" is_active="false" order="'+ idx +'">';
                            }else {
                                //叶子节点
                                childMenuHTML+='<li class="childmenu'+ (el._isActive=="true"?' childmenu-focus':'') +'" order="'+ idx +'">'; // class="nav'+ (curMenuDepth<10?'0'+curMenuDepth:''+curMenuDepth) +'"
                            }
                            if(el.menuHtmlLink){
                                childMenuHTML+='<a href="'+ el.menuHtmlLink +'">'+ el.menuName +'</a>';
                            }else{
                                childMenuHTML+='<a href="javascript:void(0)">'+ el.menuName +'</a>';
                            }
                            childMenuHTML+='</li>';
                            if(el.childMenuList){
                                travalMenu(el.childMenuList, el._isSpread);
                            }
                        })
                        curMenuDepth--;
                        childMenuHTML+='</ul>'
                    }
                },
                bindMenuEvent: function(){
                    function buildMenuDate(el, oldMenuList){
                        // = store.get('Menus');
                        function travalMenu(ul, menuList){
                            var menus = [];
                            _.each(ul.children('li'), function(el, idx){
                                var el = $(el), childMenu = el.next('ul:first'), obj = {};
                                obj._isActive = el.attr('is_active');
                                if(childMenu.size()){
                                    //有子菜单
                                    obj._isSpread = childMenu.attr('is_spread');
                                    //obj.childMenuList = travalMenu... (这个会把menus覆盖子菜单了) 传入旧菜单数据结构就是为了避免直接赋值menus(里面没有旧菜单的信息,在这里直接赋值得出的新菜单就和旧菜单有出入了)
                                    travalMenu(childMenu, menuList[idx].childMenuList);
                                }
                                menus.push(obj);
                                $.extend(menuList[idx],obj);
                            });
                            return menus;
                        }
                        return travalMenu(el, oldMenuList);
                    }
                    var self = this, menu = store.get('Menus');
                    //console.log(menu);
                    var slideMenu = $('#slideWrapper>ul');
                    //菜单点击
                    slideMenu.find(".parentmenu").off().on('click', function(){
                        if(self.shrinked) return;
                        var curJqDom = $(this), parentMenus = slideMenu.find(".parentmenu"),
                            curChild = curJqDom.next('ul'), rootMenu = curJqDom.parents('ul[is_spread]:last').prev();
                        // 移除其他1级节点的击中样式
                        parentMenus.attr('is_active',false);
                        parentMenus.removeClass('parentmenu-focus');

                        if(curJqDom.parent().parent().is('#slideWrapper')){
                            rootMenu = curJqDom;
                        }
                        //给根节点菜单 加激活状态
                        rootMenu.addClass('parentmenu-focus').attr('is_active',true);
                        //同级菜单的子菜单隐藏
                        _.each(curJqDom.parent().children('ul'), function(el){
                            var el = $(el)
                            if(curChild[0]!=el[0]){
                                el.hide().attr('is_spread', false);
                            }else{
                                console.log(el.prev()[0]);
                            }
                        })
                        //curJqDom.parent().children('ul').hide();

                        if(curChild.attr('is_spread')=='true'){
                            //curJqDom.parent().find('ul') 所有子级的菜单都要收起
                            curChild.animate({ height: 0, opacity: 'hide' }, "normal", null, function(){
                                common.resetScroll();
                            });
                            curChild.attr('is_spread', false);
                        }else{
                            //展开
                            curChild.animate({ height: '100%', opacity: 'show' }, "normal", null, function(){
                                common.resetScroll();
                            });
                            curChild.attr('is_spread', true);

                        }

                        //store.set('Menus', buildMenuDate(slideMenu));
                        buildMenuDate(slideMenu, menu);
                        store.set('Menus', menu);
                        //console.log(menu);
                    });
                    //叶子节点点击
                    slideMenu.find(".childmenu").off().on('click', function(){
                        var curJqDom = $(this), childs = slideMenu.find(".childmenu"), rootMenu = curJqDom.parents('ul[is_spread]:last').prev();
                        //给根节点菜单 加激活状态
                        rootMenu.addClass('parentmenu-focus').attr('is_active',true);

                        childs.removeClass('childmenu-focus').attr('is_active', false);
                        if(curJqDom.is('.childmenu-focus')){
                            curJqDom.attr('is_active', false);
                        }else{
                            //非激活状态  转  激活状态
                            curJqDom.addClass('childmenu-focus');
                            curJqDom.attr('is_active', true);
                        }
                        //store.set('Menus', buildMenuDate(slideMenu));
                        //var menudata = buildMenuDate(slideMenu);
                        //_.map(menu, function(el,idx){
                        //    return $.extend(el, menudata[idx])
                        //})
                        buildMenuDate(slideMenu, menu);
                        store.set('Menus', menu);
                        //console.log(menu);

                    });

                }
            }
            Menu.init();

            common.initMenu.hadInited = true;

        },
        initScroll : function(){
            var doc = $(document.documentElement), contentH = doc[0].clientHeight-$('.header').height(), contentArea=$('#contentArea');
            $('#slideWrapper').height(contentH);
            $('#contentWrapper').height(contentH); //-$('#footer').outerHeight()
            //$('body>.wrapper>.content').height(contentH).css({
            //    'overflow-y': 'scroll'
            //});
            var slideWrapper = new iScroll("slideWrapper", {hScroll : false, fadeScrollbar: false, hideScrollbar:true});
            var contentAreaHeight = contentArea.outerHeight(), footerHeight = $('#footer').outerHeight();
            if(contentAreaHeight+footerHeight<contentH){
                contentArea.css('min-height', contentH-footerHeight);
            }
            $(window).on('resize', function(){ //.off('resize')
                common.resetScroll();
            })

            this.resetScroll = function(){
                var doc = $(document.documentElement), contentH = doc[0].clientHeight-$('.header').height(), contentArea=$('#contentArea');
                $('#slideWrapper').height(contentH);
                $('#contentWrapper').height(contentH);
                slideWrapper.refresh();
                //if(contentAreaHeight+footerHeight>contentH){
                //    //contentWrapper.refresh();
                //}else{
                //    contentArea.css('min-height', contentH-footerHeight);
                //}
            }
            //$('#slideWrapper').css('overflow-y','scroll');
        }
    };
    // 全局AJAX配置
    common.ajaxSettings();
    // 动态创建loading
    common.generatedLoading('');
    //common.addLoading('');
    //common.removeLoading();
    // 全局错误定义
    common.onError();

    common.initMenu();
    common.initScroll();

    return common;
});