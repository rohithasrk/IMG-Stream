$(document).ready(function () {
    var oldList, newList, item;
    $(".categories-sortable").sortable({
        connectWith: $('.categories-sortable'),
        start: function (event, ui) {
            item = ui.item;
            newList = oldList = ui.item.parent();
        },
        stop: function (event, ui) {
            console.log("Moved " + item.text() + " from " + oldList.attr('id') + " to " + newList.attr('id'));
        },
        change: function (event, ui) {
            if (ui.sender) {
                newList = ui.placeholder.parent();
            }
        },
    })
        .disableSelection();

});
