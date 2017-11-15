var plugDown = {
	page: 1,
	pageSize: 10,
	total: 0,
	init: function () {
		var _this = this;
		_this.getSearchData();
		_this.getData();
	},
	getSearchData: function () {
		var channelList = [], nameList = [], versionList = [], modelList = [];
		$.ajax({
			url: '/plugin/api/getPlugSearch',
			type: 'GET',
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					var data = data.data;

					$.each(data.channelList, function (i, e) {
						channelList.push('<option value="' + e.channel + '">' + e.channel + '</option>');
					})

					$.each(data.nameList, function (i, e) {
						nameList.push('<option value="' + e.name + '">' + e.name + '</option>');
					})

					$.each(data.versionList, function (i, e) {
						versionList.push('<option value="' + e.version + '">' + e.version + '</option>');
					})
					$.each(data.modelList, function(i, e) {
						modelList.push('<option value="' + e.mobileModel + '">' + e.mobileModel + '</option>');
					})
					$('#plugChannel').html('<option value="">请选择</option>').append(channelList.join(''));
					$('#plugName').html('<option value="">请选择</option>').append(nameList.join(''));
					$('#plugVersion').html('<option value="">请选择</option>').append(versionList.join(''));
					$('#mobileModel').html('<option value="">请选择</option>').append(modelList.join(''));
				}
			}
		})
	},
	getData: function (channel, name, version, mobileModel, page, pageSize) {
		var tr = '';
		var str = '';
		var _this = this;
		var pages = _this.page || page;
		var pageSize = _this.pageSize || pageSize;
		$.ajax({
			url: '/plugin/api/getPlugDownList',
			type: 'GET',
			data: {
				channel: channel,
				name: name,
				version: version,
				mobileModel: mobileModel,
				page: pages,
				pageSize: pageSize
			},
			dataType: 'json',
			success: function (data) {
				if (data.success && data.data.list.length > 0) {
					var d = data.data.list;
					$.each(d, function (i, o) {
						var a = o;
						tr += '<tr>';
						tr += '<td>' + a.name + '</td>';
						tr += '<td>' + a.plugName + '</td>';
						tr += '<td>' + a.plugVersion + '</td>';
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

					_this.total = data.data.totalCount; //取到pageCount的值

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
								_this.getData(channel, name, version, mobileModel);
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

	$('#plugChannel, #plugName, #plugVersion, #mobileModel').change(function () {
		var plugChannel = $('#plugChannel').val() || '';
		var plugName = $('#plugName').val() || '';
		var plugVersion = $('#plugVersion').val() || '';
		var mobileModel = $('#mobileModel').val() || '';
		var page = 1;
		var pageSize = 10;

		plugDown.getData(plugChannel, plugName, plugVersion, mobileModel, page, pageSize);
	})
});