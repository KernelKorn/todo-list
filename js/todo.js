document.observe("dom:loaded", function() {
    var numTask;
    var toDo = new ToDoList()

    if (localStorage.getItem('numTask') === null){
        numTask = 1;
        toDo.insertLi(numTask);
    } else {
        numTask = parseInt(localStorage.getItem('numTask'));
        for (var i = 1; i <= numTask; i++){
            toDo.insertLi(i);
            $('input_' + i).setValue(localStorage.getItem('task_'+ i));
        }
    }

    $('addTask').observe('click', function(e) {
       toDo.insertLi(numTask+=1);
    });

    $('save').observe('click', function(e) {
        toDo.save();
    });

    $$('.deleteTask').invoke('observe', 'click', toDo.delete)
});

var ToDoList = Class.create();
ToDoList.prototype = {
    initialize: function() {
    },
    insertLi: function(numTask) {
        $('sortable').insert('<li  id="task_'+
        numTask + '" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span><input id="input_' +
        numTask + '" size="60" type="text"><button class="deleteTask" type="button">x</button></li>')
    },
    save: function(){
        localStorage.setItem('numTask', jQuery('li').length);
        var numTask = parseInt(localStorage.getItem('numTask'));
        for (var i = 1; i <= numTask; i++ ){
            localStorage.setItem('task_' + i, $('input_' + i).value );
        }

        var sorted = jQuery( "#sortable" ).sortable( "serialize");
        localStorage.setItem('sorted', sorted);
    },
    delete: function(){
        var taskLi = this.up(0);
        console.log(taskLi);

        localStorage.removeItem(taskLi.identify());
        taskLi.remove();
        localStorage.setItem('numTask', jQuery('li').length);
    }
};