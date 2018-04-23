$(function () {
    var table = $(".linksholder").dataTable({
        "aoColumns": [
            { "sTitle": "", "mData": null, "bSortable": false, "sClass": "head0", "sWidth": "100px",
              "render": function (data, type, row, meta) {
                if (data.IsDirectory) {
                  return "<a href='#' target='_blank'><i class='fa fa-folder'></i>&nbsp;" + data.Name +"</a>";
                } else {
                  return "<a href='/" + data.Path + "' target='_blank'><i class='far fa-file" + "'></i>&nbsp;" + data.Name +"</a>";
                }
              }
            }
          ],
          "fnCreatedRow" :  function( nRow, aData, iDataIndex ) {
            if (!aData.IsDirectory) return;
            var path = aData.Path;
            $(nRow).bind("click", function(e){
               $.get('/files?path='+ path).then(function(data){
                table.fnClearTable();
                table.fnAddData(data);
                currentPath = path;
              });
              e.preventDefault();
            });
          },}
    );

    $.get('/files').then(function(data) {
        table.fnClearTable();
        table.fnAddData(data);
    });
});