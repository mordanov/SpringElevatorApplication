var token;
var header;

var plot1, plot2, plot3;
var plot1_ticks = [];
var plot2_ticks = [];

$(document).ready(function() {

    token = $("meta[name='_csrf']").attr("content");
    header = $("meta[name='_csrf_header']").attr("content");

    $(".jqtable").DataTable( {
		paging: false,
		info: false,
		searching: false,
		sorting: true,
		language: {
		  "processing": "Подождите...",
		  "search": "Поиск:",
		  "lengthMenu": "Показать _MENU_ записей",
		  "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
		  "infoEmpty": "Записи с 0 до 0 из 0 записей",
		  "infoFiltered": "(отфильтровано из _MAX_ записей)",
		  "infoPostFix": "",
		  "loadingRecords": "Загрузка записей...",
		  "zeroRecords": "Записи отсутствуют.",
		  "emptyTable": "В таблице отсутствуют данные",
		  "paginate": {
			"first": "Первая",
			"previous": "Предыдущая",
			"next": "Следующая",
			"last": "Последняя"
		  },
		  "aria": {
			"sortAscending": ": активировать для сортировки столбца по возрастанию",
			"sortDescending": ": активировать для сортировки столбца по убыванию"
		  }			
		}
	});
	
	$(".jqbutton").button();
	
	$(".timepick").html("");
	var hourhtml = "";
	for(k=0;k<24;k++) {
		hourhtml += "<option value=\"" + checkTime(k) + "\">" + checkTime(k) + "</option>";
	}
	$(".timepick").html(hourhtml);
	var minhtml = "";
	for(k=0;k<=60;) {
		minhtml += "<option value=\"" + checkTime(k) + "\">" + checkTime(k) + "</option>";
		k+=15;
	}
	$("#TimeM1, #TimeM2, #GTimeM1, #GTimeM2, #L1TimeM1, #L1TimeM2").html(minhtml);
	
	//$(".datepick").datepicker({
	//	changeMonth: true,
	//	changeYear: true,
	//	showAnim: "slideDown",
	//	dateFormat: "yy-mm-dd"
	//});
	//$(".datepick").datepicker($.datepicker.regional["ru"]);
	$(".datepick").bootstrapMaterialDatePicker({ weekStart : 0, time: false }); 
	
	$("<div id='tooltip'></div>").css({
		position: "absolute",
		display: "none",
		border: "1px solid #fdd",
		padding: "2px",
		"background-color": "#fee",
		opacity: 0.80
	}).appendTo("body");
	
	$("#placeholder1").bind("plothover", function (event, pos, item) {
		if (item) {
			var x = item.datapoint[0].toFixed(),
				y = item.datapoint[1].toFixed();

			$("#tooltip").html(item.series.label + " - " + y + " (" + plot1_ticks[x-1][1] + ")")
				.css({top: item.pageY+5, left: item.pageX+5})
				.fadeIn(200);
			} else {
				$("#tooltip").hide();
			}
	});
	
	$("#placeholder1").bind("plotclick", function (event, pos, item) {
		if (item) {
			$("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
			plot1.highlight(item.series, item.datapoint);
		}
    });
	$("#placeholder2").bind("plotclick", function (event, pos, item) {
		if (item) {
			$("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
			plot2.highlight(item.series, item.datapoint);
		}
    });
	$("#placeholder3").bind("plotclick", function (event, pos, item) {
		if (item) {
			$("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
			plot3.highlight(item.series, item.datapoint);
		}
    });

	$("#PlotForm").submit( function(e) {
		e.preventDefault();
	});
	
	$("#repButton").click(function(e) {
		callReport();
	});
	
});

function callReport() {
	var form = $("form#PlotForm");
	var dataString = form.serialize();

	$.ajax({
		type: "GET",
		url: "/stats/launchstat",
		data: dataString,
		dataType: "json",
	   
		success: function( data, textStatus, jqXHR) {
			console.log(data);
			$("#total0").html(data.totallaunches);	 
			$("#total1").html(data.totalpassengers);	 
			$("#total2").html(data.totalelevators);	 
			$("#total3").html(Math.round(data.avgInOutTime*100)/100 + " с");	 
			$("#total4").html(data.mostPopularFirstName);	 
			$("#total5").html(data.mostPopularLastName);	 
			
			var p1data_s = [], p1data_d = [];
			plot1_ticks = [];
			for(var i=0;i<data.statMove.length;i++) {
				p1data_s.push([data.statMove[i].floor, data.statMove[i].source]);
				p1data_d.push([data.statMove[i].floor, data.statMove[i].destination]);
				plot1_ticks.push([data.statMove[i].floor, data.statMove[i].floor]);
			}
			var p1 = [p1data_s, p1data_d];
			
			var p2data = [];
			plot2_ticks = [];
			for(var i=0;i<data.statWait.length;i++) {
				p2data.push([data.statWait[i].genTime, data.statWait[i].inTime]);
			}
			var p2 = [p2data];
			
			var piedata = [];
			for(var i=0;i<data.statElevators.length;i++) {
				piedata.push({label: data.statElevators[i].strategy, data: data.statElevators[i].passcount});
			}
			
			plot1 = $.plot("#placeholder1", p1, {
				series: {
					bars: {
						show: true,
					}
				},
				grid: {
					hoverable: true,
					clickable: true
				},
				xaxis: {
					ticks: plot1_ticks
				},
				legend: {
					show: false
				}
			}
			);
			$.each(plot1.getData()[0].data, function(i, el){
				var o = plot1.pointOffset({x: el[0], y: el[1]});
				$('<div class="data-point-label">' + el[1] + '</div>').css( {
					position: 'absolute',
					left: o.left + 4,
					top: o.top - 20,
					display: 'none'
				}).appendTo(plot1.getPlaceholder()).fadeIn('slow');
			});
			
			plot2 = $.plot("#placeholder2", p2, {
				series: {
					points: {
						show: true
					}
				},
				grid: {
					hoverable: true,
					clickable: true
				},
				legend: {
					show: true
				}
			}
			);
			
			plot3 = $.plot('#placeholder3', piedata, {
				series: {
					pie: {
						show: true,
						radius: 1,
						label: {
							show: true,
							radius: 1,
							formatter: labelFormatter,
							background: {
								opacity: 0.8
							}
						}
					}
				},
				legend: {
					show: false
				},
				    grid: {
					hoverable: true,
					clickable: true
				}
			});
		},
	   
		error: function(jqXHR, textStatus, errorThrown){
			 console.log("Something really bad happened " + textStatus);
		},
	   
		beforeSend: function(jqXHR, settings){
			form.preloader('start');
            jqXHR.setRequestHeader(header, token);
			settings.data += "&dummyData=whatever";
			$('#repButton').attr("disabled", true);
		},
	   
		complete: function(jqXHR, textStatus){
			form.preloader('stop');
			$('#repButton').attr("disabled", false);
		} 
	});

}

function labelFormatter(label, series) {
	return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
}

// нолик подставить в начало
function checkTime(v) {
	if(v<10) 
	{v = "0"+v;}
	return v;
}
