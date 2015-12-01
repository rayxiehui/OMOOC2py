
/*
* 自定义日历控件
* Created by ex-yuyongkun001 on 15-06-17.
* */

define(['zepto','underscore'],function ($,_) {

    /*
     * 转换日期字符串为日期类型
     * @param datestring(yyyy-MM-dd)
     * @returns {Date}
     * */
    var parseDateByString = function (datestring) {
        if (typeof datestring == 'string') {
            return new Date(datestring);
        } else {
            return datestring;
        }
    };

    // 数字1-9前面补0
    var fillTwoLen = function (val) {
        if (/^[1-9]$/.test(val)) {
            val = "0"+val;
        }
        return val;
    };

    /*
     * 判断是否为闰年
     * @param year
     * @returns {boolean}
     * */
    var isRainYear = function (year) {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
            return true;
        }
        return false;
    };

    /*
     * 根据年份获取当前年份每月的天数
     * @param date
     * @returns {Array}
     * */
    var getMonthDaysByYear = function (date) {

        // 每月有的总天数，2月有可能是28/29天，闰年为28天
        var monthDaysArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (isRainYear(date.getFullYear())) {
            monthDaysArray[1] = 29;
        }
        return monthDaysArray;
    };

    /*
     * 获取前一个月的时间
     * @returns {*}
     * */
    var getPrevMonthByDate = function (curDate) {
        var monthDaysArray = getMonthDaysByYear(curDate),
            index = curDate.getMonth(),
            prevIndex = index - 1 < 0 ? 11 : index - 1,
            day = Math.min(monthDaysArray[prevIndex],monthDaysArray[index]);
        var date = new Date(curDate.getFullYear(),index - 1,day);
        return date;
    };

    /*
     * 获取后一个月的时间
     * @returns {*}
     * */
    var getNextMonthByDate = function (curDate) {
        var monthDaysArray = getMonthDaysByYear(curDate),
            index = curDate.getMonth(),
            nextIndex = index + 1 > 11 ? 0 : index + 1,
            day = Math.min(monthDaysArray[nextIndex],monthDaysArray[index]);
        var date = new Date(curDate.getFullYear(),index + 1,day);
        return date;
    };

    /*
     * 根据传入的时间对象，获取当前月第一天是星期几
     * @param date
     * @returns {number}
     * */
    var getWeekOfMonthFirstDay = function(curDate) {
        var date = new Date(curDate.getFullYear(),curDate.getMonth(),curDate.getDate());
        date.setDate(1);
        return date.getDay();
    };

    /*
    * 填充table
    * @param data
    * @returns {*}
    * */
    var fillDateTable = function (data) {

        var tableHTML = '<table id="{{=tableId}}" style="display: none">'+
            '{{'+
            'var dataLen = dataList.length;'+
            'var tabIndex = 0;'+
            'var rowsNum = parseInt((dataLen + (colsNum-1)) / colsNum);'+
            '}}'+
            '{{'+
            'for(var i=0;i<rowsNum;i++){'+
            '}}'+
            '<tr>'+
            '   {{'+
            '                        for(var j=0;j<colsNum;j++){'+
            '                       if(tabIndex<dataLen){'+
            '                      }}'+
            '                     <td class="td-enable">{{=dataList[tabIndex]}}</td>'+
            '                    {{'+
            '                   }else{'+
            '                  }}'+
            '                 <td>&nbsp;</td>'+
            '                {{'+
            '               }'+
            '              tabIndex++;'+
            '             }'+
            '            }}'+
            '       </tr>'+
            '      {{'+
            '     }'+
            '    }}'+
            '</table>';
        return _.template(tableHTML)(data);
    };

    /*
     *  填充tableCell
     * */
    var fillTableCell = function (dateConElement,curMonthWhileIndex,maxCellNumber,firstDayWeek,curMonthDays,curDate,newULElement) {
        for (var i = 1; i <= maxCellNumber; i++) {
            var ctext = i > firstDayWeek ? curMonthWhileIndex++ : '';
            var cliItem = $("<td />");
            var curFullDate = '';
            if (curMonthWhileIndex > curMonthDays + 1) {
                ctext = "";
            } else {
                curFullDate = curDate.getFullYear() + "-" + fillTwoLen(curDate.getMonth()+1) + "-" + fillTwoLen(ctext);
            }
            if (ctext) {
                cliItem.addClass("td-enable");
                cliItem.text(ctext).attr("datestring", curFullDate);
            } else {
                cliItem.addClass("td-disable");
            }
            newULElement.append(cliItem);
            if (i % 7 == 0) {
                dateConElement.append(newULElement);
                newULElement = $("<tr />");
            }
        }
    };

    // 日历控件 - 结构模板
    var templateHTML = '<div class="calendar">'+
        '    <div class="calendar-title">'+
        '    <p class="calendar-prev-month" id={{=btnLeftId}} >上一月</p>'+
        '    <p id="dateTit"></p>'+
        '    <p class="calendar-next-month" id={{=btnRightId}} >下一月</p>'+
        '</div>'+
        '    <div class="calendar-week" id="calendarWeek">'+
        '    <table>'+
        '        <tr><td>周日</td><td>周一</td><td>周二</td><td>周三</td><td>周四</td><td>周五</td><td>周六</td></tr>'+
        '    </table>'+
        '    </div>'+
        '   <div class="calendar-days">'+
        '      <table id={{=dateConId}} >'+
        '     </table>'+
        '</div>'+
        '</div>';
    var defaultOptions = {
        defaultDate: new Date(),
        titleId:'dateTit',
        btnLeftId:'btnLeft',
        btnRightId:'btnRight',
        dateConId:'dateCon',
        triggerEventType:"tap",
        wrap:'',
        loadedCallback:null,
        clickCallback:null
    };

    // 是否初始化过结构
    var initDatePicker = false;

    // 构造函数
    var Calendar = function ($wrap) {
        this.$wrap = typeof $wrap == 'object'?$wrap:$('#'+$wrap);
    };

    // 渲染td元素
    Calendar.prototype.renderCalendar = function (options) {

        // 传入的当前日期（默认为当前日期）
        var curDate = parseDateByString(options.defaultDate);

        // 前一个月的时间
        this.prevMonthDate = getPrevMonthByDate(curDate);

        // 后一个月的时间
        this.nextMonthDate = getNextMonthByDate(curDate);

        // 标题元素ID
        var titleId = "#"+options.titleId;

        // 日期内容区域ID
        var dateConId = "#"+options.dateConId;

        // 现在的时间对象
        var nowDate = new Date();

        // 当前月份索引(实际月份应+1)
        var curMonthIndex = curDate.getMonth();

        // 获取当前月第一天是星期几
        var firstDayWeek = getWeekOfMonthFirstDay(curDate);

        // 获取当前时间对应的每月天数
        var monthDays = getMonthDaysByYear(curDate);

        // 当前月天数
        var curMonthDays = monthDays[curMonthIndex];
        var curMonthWhileIndex = 1;
        var monthTableId = "selectMonthTable", yearTableId="selectYearTable";

        // 判断是否有初始化结构
        if (!initDatePicker) {

            // 填充结构模板
            this.$wrap.html(_.template(templateHTML)(options));

            // 填充“选择月份”UI
            var monthTmpData = {
                tableId:monthTableId,
                dataList:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
                colsNum:5
            };
            var tableHTML = fillDateTable(monthTmpData);
            $(dateConId).after(tableHTML);

            // 填充“选择年份”UI
            var yearTmpData = {
                tableId:yearTableId,
                dataList:[],
                colsNum:5
            };
            for (var yi = nowDate.getFullYear(), minYear = 1990; yi >= minYear; yi--)yearTmpData.dataList.push(yi+"年");
            tableHTML = fillDateTable(yearTmpData);
            $(dateConId).after(tableHTML);
            initDatePicker = true;
        }
        var dateConElement = $(dateConId);
        dateConElement.empty().show().siblings().hide();
        $("#calendarWeek").show();
        var maxCellNumber = parseInt(((firstDayWeek + curMonthDays) + 6) / 7) * 7;
        var newULElement = $("<tr />");

        fillTableCell(dateConElement,curMonthWhileIndex,maxCellNumber,firstDayWeek,curMonthDays,curDate,newULElement);

        // 改变title
        $(titleId).text(curDate.getFullYear() + "年" + (curMonthIndex + 1) + "月").siblings().show();

        // 初始化完成回调
        options.loadedCallback&&options.loadedCallback(curDate);

    };

    // Calendar对象初始化方法
    Calendar.prototype.initCalendar = function (options) {
        var self = this;
        for (var property in defaultOptions) {
            if (options[property] == undefined) {
                options[property] = defaultOptions[property];
            }
        }

        // 上一月元素ID
        var btnLeftId = "#"+options.btnLeftId;

        // 下一月元素ID
        var btnRightId = "#"+options.btnRightId;

        // 触发事件的类型
        var triggerEventType = options.triggerEventType;

        this.renderCalendar(options);

        // 点击上月
        this.$wrap.undelegate(btnLeftId,triggerEventType).delegate(btnLeftId,triggerEventType, function() {
            options.defaultDate = self.prevMonthDate;
            self.renderCalendar(options);
        });

        // 点击下月
        this.$wrap.undelegate(btnRightId,triggerEventType).delegate(btnRightId,triggerEventType, function() {
            options.defaultDate = self.nextMonthDate;
            self.renderCalendar(options);
        });

        // 点击td元素
        this.$wrap.undelegate('td',triggerEventType).delegate('td',triggerEventType, function(e) {
            options.clickCallback&&options.clickCallback(e);
        });
    };
    return Calendar;
});