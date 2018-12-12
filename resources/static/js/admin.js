var token;
var header;

$(document).ready(function(){
    token = $("meta[name='_csrf']").attr("content");
    header = $("meta[name='_csrf_header']").attr("content");

    $('.tabs').tabs();

    $(".dtable").DataTable({
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

    $('.modal').modal();

    $("#addFirst").click(function(e) {
        addFirstName($("#nameFirst").val());
    });

    $("#addSecond").click(function(e) {
        addSecondName($("#nameSecond").val());
    });

    getFirstNames();
    getSecondNames();
});

function getFirstNames() {
    $.ajax({
        type: "GET",
        url: "/firstname/all",
        data: "",
        dataType: "json",

        success: function(data, textStatus, jqXHR) {
            var table = $("#firstnameTable").DataTable();
            var dellink;
            table.clear().draw();
            for(var i=0;i<data.length;i++) {
                dellink = "<a class='hand' onclick='deletefirstname(" + data[i].id + ")'>Удалить</a>";
                table.row.add([data[i].id, data[i].firstname, dellink]);
            }
            table.draw();
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log("First names get failed: " + textStatus);
            console.log("response text: " + jqXHR.responseText);
        },

        beforeSend: function(jqXHR, settings) {
            settings.data += "&dummyData=loremipsum";
            jqXHR.setRequestHeader(header, token);
        },

        complete: function(jqXHR, textStatus) {
            // ничего не делать :)
            // тут должен быть прелоадер, но данных так мало, что ни к чему эти мелькания
        }
    })
}

function getSecondNames() {
    $.ajax({
        type: "GET",
        url: "/secondname/all",
        data: "",
        dataType: "json",

        success: function(data, textStatus, jqXHR) {
            var table = $("#secondnameTable").DataTable();
            var dellink;
            table.clear().draw();
            for(var i=0;i<data.length;i++) {
                dellink = "<a class='hand' onclick='deletesecondname(" + data[i].id + ")'>Удалить</a>";
                table.row.add([data[i].id, data[i].secondname, dellink]);
            }
            table.draw();
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Second names get failed: " + textStatus);
            console.log("response text: " + jqXHR.responseText);
        },

        beforeSend: function(jqXHR, settings) {
            settings.data += "&dummyData=loremipsum";
            jqXHR.setRequestHeader(header, token);
        },

        complete: function(jqXHR, textStatus) {
            // ничего не делать :)
            // тут должен быть прелоадер, но данных так мало, что ни к чему эти мелькания
        }
    })
}

function deletefirstname(id) {
    $.ajax({
        type: "GET",
        url: "/firstname/delete",
        data: "id=" + id,
        dataType: "text",

        success: function(data, textStatus, jqXHR) {
            getFirstNames();
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log("First names delete failed: " + textStatus);
            console.log("response text: " + jqXHR.responseText);
        },

        beforeSend: function(jqXHR, settings) {
            settings.data += "&dummyData=loremipsum";
            jqXHR.setRequestHeader(header, token);
        },

        complete: function(jqXHR, textStatus) {
            // ничего не делать :)
            // тут должен быть прелоадер, но данных так мало, что ни к чему эти мелькания
        }
    })
}

function deletesecondname(id) {
    $.ajax({
        type: "GET",
        url: "/secondname/delete",
        data: "id=" + id,
        dataType: "text",

        success: function(data, textStatus, jqXHR) {
            getSecondNames();
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Second names delete failed: " + textStatus);
            console.log("response text: " + jqXHR.responseText);
        },

        beforeSend: function(jqXHR, settings) {
            settings.data += "&dummyData=loremipsum";
            jqXHR.setRequestHeader(header, token);
        },

        complete: function(jqXHR, textStatus) {
            // ничего не делать :)
            // тут должен быть прелоадер, но данных так мало, что ни к чему эти мелькания
        }
    })
}

function addFirstName(name) {
    $.ajax({
        type: "GET",
        url: "/firstname/add",
        data: "name=" + name,
        dataType: "text",

        success: function(data, textStatus, jqXHR) {
            getFirstNames();
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log("First names add failed: " + textStatus);
            console.log("response text: " + jqXHR.responseText);
        },

        beforeSend: function(jqXHR, settings) {
            settings.data += "&dummyData=loremipsum";
            jqXHR.setRequestHeader(header, token);
        },

        complete: function(jqXHR, textStatus) {
            // ничего не делать :)
            // тут должен быть прелоадер, но данных так мало, что ни к чему эти мелькания
        }
    })
}

function addSecondName(name) {
    $.ajax({
        type: "GET",
        url: "/secondname/add",
        data: "name=" + name,
        dataType: "text",

        success: function(data, textStatus, jqXHR) {
            getSecondNames();
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Second names add failed: " + textStatus);
            console.log("response text: " + jqXHR.responseText);
        },

        beforeSend: function(jqXHR, settings) {
            settings.data += "&dummyData=loremipsum";
            jqXHR.setRequestHeader(header, token);
        },

        complete: function(jqXHR, textStatus) {
            // ничего не делать :)
            // тут должен быть прелоадер, но данных так мало, что ни к чему эти мелькания
        }
    })
}