document.observe("dom:loaded", function() {
    var numTask;
    var toDo = new ToDoList()

    // checks to see if local storage exist if it does sets numTask to 1 so there is at least one input
    // else it takes the data from local stotage and displays it
    if (localStorage.getItem('numTask') === null || localStorage.getItem('numTask') == 0){
        numTask = 1;
        toDo.insertLi(numTask);
    } else {
        var todoTitle = localStorage.getItem('title');
        if(todoTitle === null){
            todoTitle = "Click to add Title";
        }
        // sets the title of the to do list
        $('todoTitle').update(todoTitle);

        // finds the number of task then inerates through them setting data to correct input
        numTask = parseInt(localStorage.getItem('numTask'));
        for (var i = 1; i <= numTask; i++){
            toDo.insertLi(i);
            // finds task in local storage by key
            var taskObject = JSON.parse(localStorage.getItem( localStorage.key( i )));
            $('input_' + i).setValue( taskObject['taskValue']);
            $('div_' + i).update( taskObject['taskValue'].strike());

            // checks to see if task is complete and how to display it
            if(taskObject['isCompleted'] === "true"){
                $('input_' + i).hide()
                $('div_' + i).show();
            } else {
                $('input_' + i).show()
                $('div_' + i).hide();
            }
        }
    }

    // Observer for changing title
    $('todoTitle').observe('click',function(e){
        $('inputTitle').show();
        $('saveTitleBtn').show();
        $('todoTitle').hide();
    });
    // Observer to save title
    $('saveTitleBtn').observe('click', function(e){
        var titleValue = $('inputTitle').value;

        $('inputTitle').hide();
        $('saveTitleBtn').hide();
        $('todoTitle').show();
        $('todoTitle').update(titleValue);

        localStorage.setItem('title', titleValue);
    });

    $('addTask').observe('click', function(e) {
       toDo.insertLi(numTask+=1);
    });

    jQuery('#sortable').on('keyup','input', function(e) {
        if (event.keyCode == 13) {
            toDo.saveTasks();
        }
    });

    jQuery('#sortable').on('click','.finishTaskBtn',function(e) {
        toDo.finishTask(this);
    });

    jQuery('#sortable').on('click','.deleteTaskBtn',function(e) {
        toDo.deleteTask(this);
    });
});

var ToDoList = Class.create();
ToDoList.prototype = {
    initialize: function() {
    },
    insertLi: function(numTask) {
        // inserts list item
        $('sortable').insert('<li  id="task_'+
        numTask + '" class="ui-state-default tasks"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span><input id="input_' +
        numTask + '" size="45" type="text"><div class="taskComplete" id="div_' + numTask +'" ></div><button class="finishTaskBtn" type="button">&#10003</button>' +
        '<button class="deleteTaskBtn" type="button">&#10005</button></li>')
    },
    saveTasks: function(){
        var taskObject;
        localStorage.setItem('numTask', jQuery('li').length);
        var numTask = parseInt(localStorage.getItem('numTask'));

        // iterates through all list items and saves the data to the correct task
        for (var i = 1; i <= numTask; i++ ){
            taskObject =  JSON.parse(localStorage.getItem('task_' + i));
            if( taskObject === null || taskObject['isCompleted'] === "false"){
                taskObject = { 'taskValue' :  $('input_' + i).value, 'isCompleted' : 'false' };
            } else {
                taskObject = { 'taskValue' :  $('input_' + i).value, 'isCompleted' : 'true' };
            }
            localStorage.setItem('task_' + i, JSON.stringify(taskObject) );
        }
        console.log('saved');
    },
    deleteTask: function(child){
        var taskLi = child.up(0);

        localStorage.removeItem(taskLi.identify());
        taskLi.remove();
        localStorage.setItem('numTask', jQuery('li').length);

        var sorted = jQuery("#sortable").sortable("serialize");
        localStorage.setItem('z_sorted', sorted);
    },
    finishTask: function(child){
        var taskID = child.up(0).identify().replace('task_','');
        var taskObject = JSON.parse(localStorage.getItem('task_' + taskID));

        if(taskObject['isCompleted'] === "true"){
            $('input_' + taskID).show()
            $('div_' + taskID).hide();
            taskObject = { 'taskValue' :  $('input_' + taskID).value, 'isCompleted' : 'false' };
            localStorage.setItem('task_' + taskID, JSON.stringify(taskObject) );
            $('div_' + taskID).update(taskObject['taskValue'].strike());

        } else {
            $('input_' + taskID).hide()
            $('div_' + taskID).show();
            taskObject = { 'taskValue' :  $('input_' + taskID).value, 'isCompleted' : 'true' };
            localStorage.setItem('task_' + taskID, JSON.stringify(taskObject) );
            $('div_' + taskID).update(taskObject['taskValue'].strike());
        }
    }
};