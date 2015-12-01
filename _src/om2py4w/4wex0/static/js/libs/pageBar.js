define([

], function () {
    /**
     * 分页对象
     * pageCount 总页数
     * pageNo  当前页
     * wrapper  包裹层
     * callback
     */
    function Pagebar(pageCount, pageNo, wrapper,callback) {
        this._pageCount = pageCount;
        this._pageNo = pageNo;
        this._wrapper = wrapper;

        this.init(callback);
    }

    Pagebar.pageLink = 5;

    /**
     * 初始化
     */
    Pagebar.prototype.init = function (callback) {
        var self = this;
        this._wrapper.undelegate('li', 'click');
        this._wrapper.delegate('li', 'click', function () {
            var li = $(this),
                pageNo = null;

            if (li.hasClass('prev-ten')) {
                // 第一页
                if (self._pageNo != 1) {
                    pageNo = 1;
                }
            } else if (li.hasClass('prev')) {
                // 上一页
                if (self._pageNo > 1) {
                    pageNo = self._pageNo*1 - 1;
                }
            } else if (li.hasClass('next')) {
                // 下一页
                if (self._pageNo < self._pageCount) {
                    pageNo = self._pageNo*1 + 1;
                }
            } else if (li.hasClass('next-ten')) {
                // 最后一页
                if (self._pageNo != self._pageCount) {
                    pageNo = self._pageCount*1;
                }
            } else if (li.hasClass('curr')) {
                // 当前页
            } else if(li.hasClass('pages')){
                // 具体页码
                pageNo = parseInt(li.find('a').text());
            } else if (li.hasClass('go')){
                // 搜索几页
                var ex = /^\d+$/;
                var goood=Number(li.siblings('.page-last').find('input').val());
                if (ex.test(goood)){
                    if (goood*1>0 && goood*1<=self._pageCount*1) {
                        pageNo = goood;
                    }
                }
            } else if (li.hasClass('page-last')){
                // 当前页
            }

            if (pageNo === null) {
                return false;
            }

            callback && callback(pageNo,self);
        });
        callback && callback(1,self);
    }

    /**
     * 显示分页条
     */
    Pagebar.prototype.show = function (pageCount, pageNo) {
        var html = [],
            start = 0,
            end = 0;

        this._pageCount = pageCount;
        this._pageNo = pageNo;

        html.push('<ul style="display: inline-block" class="pagination">');
        html.push('<li class="prev-ten"><a href="javascript:void(0)">第一页</a></li>');
        html.push('<li class="prev"><a href="javascript:void(0)">上一页</a></li>');

        if (pageCount <= Pagebar.pageLink) {
            start = 1;
            end = pageCount;
        } else {
            pageNo =parseInt(pageNo);
            if (pageNo <= Pagebar.pageLink) {
                start = 1;
                end = Pagebar.pageLink;
            } else if ((pageNo + Pagebar.pageLink) >= pageCount) {
                start = pageCount - Pagebar.pageLink;
                end = pageCount;
            } else {
                var both = parseInt(Pagebar.pageLink / 2);
                start = pageNo - both;
                end = pageNo + both;
            }
        }

        for (var i = start; i <= end; i++) {
            if (i == pageNo) {
                html.push('<li class="curr"><a style="color:red" href="javascript:void(0)">' + i + '</a></li>');
            } else {
                html.push('<li class="pages"><a href="javascript:void(0)">' + i + '</a></li>');
            }
        }
        html.push('<li class="next"><a href="javascript:void(0)">下一页</a></li>');
        html.push('<li class="next-ten"><a href="javascript:void(0)">最后一页</a></li>');
        html.push('<li class="page-last"><span>'+ pageNo +'</span>/<strong>'+pageCount+'</strong>第<input  calss="inputs" type="text" value="'+pageNo+'">页</li>');
        html.push('<li class="go"><a href="javascript:void(0)" >Go</a></li> ');
        html.push('</ul>');
        this._wrapper.html(html.join(''));
        //console.log(this._wrapper);
        this._wrapper.show();
    }

    Pagebar.prototype.hide = function () {
        this._wrapper.html('');
        this._wrapper.hide();
    }
    return Pagebar;
});
