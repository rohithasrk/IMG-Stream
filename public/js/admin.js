$(document).ready(function () {
    function updateValues(){
            var encodingString = ',%,'
            
            var deleted = "";
            var Darray = $(".deleted")[0].getElementsByTagName('li');
            for(i=0;i<Darray.length;i++){
                deleted += Darray[i].innerHTML + encodingString;
            }
            $("#deleted")[0].value = deleted;
            
            var approved = "";
            var Aarray = $(".approved")[0].getElementsByTagName('li');
            for(i=0;i<Aarray.length;i++){
                approved += Aarray[i].innerHTML + encodingString;
            }
            $("#approved")[0].value = approved;
            
            var toBeApproved = "";
            var tBAarray = $(".toBeApproved")[0].getElementsByTagName('li');
            for(i=0;i<tBAarray.length;i++){
                toBeApproved += tBAarray[i].innerHTML + encodingString;
            }
            $("#toBeApproved")[0].value = toBeApproved;

    }
    updateValues();
    var oldList, newList, item;
    $(".categories-sortable").sortable({
        connectWith: $('.categories-sortable'),
        start: function (event, ui) {
            item = ui.item;
            newList = oldList = ui.item.parent();
        },
        stop: function (event, ui) {
            updateValues();            
        },
        change: function (event, ui) {
            if (ui.sender) {
                newList = ui.placeholder.parent();
            }
        },
    })
        .disableSelection();

});
