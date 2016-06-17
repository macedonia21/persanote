/**
 * Created by Administrator on 6/13/2016.
 */
// Generate unique ID
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

// Check empty selector
$.fn.exists = function () {
    return this.length !== 0;
}
// Highlight item
var highlightItem = function () {
    var firstli = $("ul.all").children().not(".list-group-item-success").first();
    firstli.removeClass("list-group-item-danger").addClass("active");

    firstli = $("ul.going").children().first();
    firstli.addClass("active");
};
// Add new item to the list
var newItem = function(itemText) {
    var newItem = $("<li>").text(itemText);
    var newIconRemove = $("<span>").addClass("glyphicon glyphicon-remove");
    var newIconDone = $("<span>").addClass("glyphicon glyphicon-ok");
    var newIconRepeat = $("<span>").addClass("glyphicon glyphicon-repeat");
    newIconRemove.appendTo(newItem);
    newIconDone.appendTo(newItem);
    newIconRepeat.appendTo(newItem).hide();

    newIconRemove.click(function () {
        $(this).parent().fadeOut("100", function () {
            var uuid = $(this).attr("class");
            $("." + uuid.substring(0, 36)).remove();
            if (!$(".list-group-item.active").exists()){
                var firstPendingItem = $("ul.pending").children().first();
                if (firstPendingItem.exists) {
                    firstPendingItem.appendTo("ul.going");
                }
            }

            highlightItem();
        });
    });

    newIconDone.click(function () {
        var item = $(this).parent();
        item.removeClass("active list-group-item-danger").addClass("list-group-item-success");
        item.children().filter(".glyphicon-ok").hide();
        item.children().filter(".glyphicon-repeat").show();

        // item.appendTo("ul.all");
        $("ul.all .list-group-item.active").before(item);

        var uuid = $(item).attr("class");
        var doneItem = $("." + uuid.substring(0, 36)).not(".list-group-item-success").first();
        doneItem.removeClass("active list-group-item-danger").addClass("list-group-item-success");
        doneItem.children().filter(".glyphicon-ok").hide();
        doneItem.children().filter(".glyphicon-repeat").show();
        doneItem.appendTo("ul.done");

        if (!$(".list-group-item.active").exists()){
            var firstPendingItem = $("ul.pending").children().first();
            if (firstPendingItem.exists) {
                firstPendingItem.appendTo("ul.going");
            }
        }

        highlightItem();
    });

    newIconRepeat.click(function () {
        var item = $(this).parent();
        item.removeClass("list-group-item-success");
        item.children().filter(".glyphicon-ok").show();
        item.children().filter(".glyphicon-repeat").hide();
        if ($(".list-group-item.active").exists()) {
            item.addClass("list-group-item-danger");
        }
        item.appendTo("ul.all");

        var uuid = $(item).attr("class");
        var repeatItem = $("." + uuid.substring(0, 36)).filter(".list-group-item-success").first();
        repeatItem.removeClass("list-group-item-success");
        repeatItem.children().filter(".glyphicon-ok").show();
        repeatItem.children().filter(".glyphicon-repeat").hide();
        if ($(".list-group-item.active").exists()){
            repeatItem.addClass("list-group-item-danger");
            repeatItem.appendTo("ul.pending");
        } else {
            repeatItem.appendTo("ul.going");
        }

        highlightItem();
    });

    var newUUID = generateUUID();

    newItem.addClass(newUUID);

    if ($(".list-group-item.active").exists()){
        newItem.addClass("list-group-item").addClass("list-group-item-danger").appendTo("ul.all");
        var cloneItem = newItem.clone(true);
        cloneItem.appendTo("ul.pending");
    } else {
        newItem.addClass("list-group-item").appendTo("ul.all");
        var cloneItem = newItem.clone(true);
        cloneItem.appendTo("ul.going");
    }

    highlightItem();
};

// Add button click
var addClick = function () {
    var todoInput = $("#todo");
    if (todoInput.val().length > 0) {
        newItem(todoInput.val());

        todoInput.val("");
        todoInput.focus();

        $("#btn_add").addClass("disabled");
    }
};

var main = function() {
    // Add button disabled by default
    var btnAdd = $("#btn_add");
    btnAdd.addClass("disabled");

    var todoList = $("#todo");

    // Set focus by default
    todoList.focus();
    
    // Check Input length to active button
    todoList.keyup(function() {
        var postLength = $(this).val().length;
        if (postLength > 0) {
            btnAdd.removeClass("disabled");
            btnAdd.addClass("active");
        } else {
            btnAdd.removeClass("active");
            btnAdd.addClass("disabled");
        }
    });

    // Enter press
    todoList.keypress(function(e) {
        if (e.which === 13) {
            // addClick ();
            if (todoList.val().length > 0) {
                addClick ();
            }
            return false;
        }
    });
    
    //Add button click
    btnAdd.click(function(){
        addClick ();
    });
};

$(document).ready(main);