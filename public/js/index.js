/**
 * 查询
 */
window.query = function () {

};
/**
 * 新建
 */
window.add = function () {
    $("#addDialog").modal('show');
};
/**
 * 编辑
 */
window.edit = function () {

};
/**
 * 删除
 */
window.delete = function () {

};


/*** 新建 ***/
window.addDialog = {
    /**
     * 配置菜单
     * @event    事件
     */
    config: function (event) {
        var target = event.target;
        var parent;
        //新增
        if($(target).hasClass("btn btn-link glyphicon glyphicon-plus")){
            parent = $(target).parent();
            //本元素增加删除
            if(parent.children(".btn.btn-link.glyphicon.glyphicon-minus").length <= 0){
                parent.append( '<button type="button" class="btn btn-link glyphicon glyphicon-minus" style="text-decoration: none"></button>');
            }
            //增加一个新的url
            $(target).parent().parent().after(
                '<div class="form-group urls">' +
                    '<label for="filename" class="col-sm-3 control-label">url（绝对路径）</label>' +
                    '<div class="col-sm-5">' +
                        '<input type="text" name="urls" id="urls" class="form-control">' +
                    '</div>' +
                    '<div class="col-sm-4">' +
                        '<button type="button" class="btn btn-link glyphicon glyphicon-plus" style="text-decoration: none"></button>' +
                        '<button type="button" class="btn btn-link glyphicon glyphicon-minus" style="text-decoration: none"></button>' +
                    '</div>' +
                '</div>'
            );
        }
        //删除
        if($(target).hasClass("btn btn-link glyphicon glyphicon-minus")){
            //删除本行
            $(target).parent().parent().remove();
            //如果只剩下一个，则没有删除标签
            if($("#addDialog form .form-group.urls").length <= 1){
                $("#addDialog form .form-group.urls .glyphicon-minus").remove();
            }
        }
    },
    /**
     * 提交
     */
    submit: function () {
        $("#addDialog form").submit();
    }
};


$(function () {
    //配置新建窗口
    //$('#addDialog form').click(addDialog.config);
});

// $(function(){
//   //获取文件列表
//   $.post("/file/list", function(res){
//     $.each(res.data, function(i, item){
//       $("#filelist").append(
//         "<tr>" +
//           "<th scope='row'>" + (i + 1) + "</th>" +
//           "<td>" + item.filename + "</td>" +
//           "<td>" + item.url + "</td>" +
//           "<td>" + item.md5 + "</td>" +
//           "<td>" +
//             "<form action='/file/delete' method='post'>" +
//                 "<input id='filename' name='filename' value='" + item.filename + "' style='display:none;'/>" +
//                 "<button type='submit' class='btn btn-danger'>删除</button>" +
//             "</form>" +
//           "</td>" +
//         "</tr>"
//       );
//     });
//   });
// });