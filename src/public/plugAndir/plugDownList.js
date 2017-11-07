var plugDown = {
	page: 1,
	pageSize: 10,
	total: 0,
	init: function () {
		var _this = this;
		_this.getData();
	},
	getData: function () {
		var tr = '';
		var str = '';
		var _this = this;
		var pages = _this.page;
		$.ajax({
			url: '/plugin/api/getPlugDownList',
			type: 'GET',
			data: {
				page: pages,
				pageSize: _this.pageSize
			},
			dataType: 'json',
			success: function (data) {
				if (data.success && data.data.length > 0) {
					var d = data.data;

					$.each(d, function (i, o) {
						var a = o;
						tr += '<tr>';
						tr += '<td>' + a.name + '</td>';
						tr += '<td>' + a.sum + '</td>';
						tr += '<td>' + a.mobileModel + '</td>';
						tr += '<td>' + a.mobileVersion + '</td>';
						tr += '<td>' + a.networkType + '</td>';
						tr += '<td>' + a.romInfo + '</td>';
						tr += '<td>' + a.appVersion + '</td>';
						tr += '<td>' + a.imei + '</td>';
						tr += '</tr>';
					});
					$('table tbody').html(tr);

					_this.total = data.pageSize; //取到pageCount的值

					if (pages == 1) {
						var options = {
							bootstrapMajorVersion: 3, //版本
							currentPage: _this.page, //当前页数
							totalPages: _this.total, //总页数
							numberOfPages: 5,
							itemTexts: function (type, page) {
								switch (type) {
									case 'first':
										return '首页';
									case 'prev':
										return '上一页';
									case 'next':
										return '下一页';
									case 'last':
										return '末页';
									case 'page':
										return page;
								}
							},
							onPageClicked: function (event, originalEvent, type, pages) {
								_this.page = pages;
								_this.getData();
							}
						};
						$('#pageUl').show().bootstrapPaginator(options);
					}
				} else {
					$('table tbody').html('');
					$('#pageUl').hide();
					$('.zwsj').show();
				}
			},
			error: function () {
				$('#pageUl').hide();
				$('table tbody').html('');
				$('.modal-body').html('暂无数据');
				$('#myModal').modal({
					keyboard: true,
					show: true
				});
				$('.zwsj').show();
			}
		});
	}
}
$(function () {
	// 获取插件下载量
	plugDown.init();
});