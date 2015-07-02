document.observe("dom:loaded", function() {
    var toDo = new ToDoList(JSON.parse(localStorage.getItem('data')));
});
var toDoListManager = Class.create({
    initialize: function(toDoObject) {
        var self = this;
        self.toDoObject = toDoObject;
        self.titleElementId = "toDoTitle"
        self.inputId = "input_"
        self.taskDivId = "div_"
        self.titleInput = "inputTitle";
        self.liTemplate = new Template(
            '<li id="task_#{taskId}" class="ui-state-default tasks"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
            '<input id="input_#{taskId}" size="45" type="text"><div class="taskComplete" id="div_#{taskId}"></div>' +
            '<button class="finishTaskBtn" type="button">&#10003</button>' +
            '<button class="deleteTaskBtn" type="button">&#10005</button></li>'
        );
        if(this.toDoObject === null){
            this.toDoObject = {"title": "Click to Add Title", toDoList: [], sortOrder: ""}
        }

        self.setupHtml();

        $('addTask').observe('click', function() {
            self.addTask()
            self.insertLi(self.toDoObject.toDoList.length - 1);
        });

        $('toDoTitle').observe('dblclick', function(){
            $(self.titleInput).show();
            $(self.titleElementId).hide();
        });

        $('toDoList').observe('keypress', function(event){
            if ( event.keyCode == Event.KEY_RETURN  || event.which == Event.KEY_RETURN ) {
                self.saveTasks();
                Event.stop(event);
            }
        });

        $$('.finishTaskBtn').each(function(element) {
            element.observe('click', self.taskComplete.bindAsEventListener(self));
        });

        $$('.deleteTaskBtn').each(function(element) {
            element.observe('click', self.deleteTask.bindAsEventListener(self));
        });

        jQuery(function() {
            // save order of task after each reorder
            jQuery( "#sortable" ).sortable({
                update: function(e, ui) {
                    //var sorted = jQuery("#sortable").sortable("serialize");
                    //self.toDoObject.sortOrder = sorted;
                    self.saveOrder();
                    self.saveTasks();
                }
            });
            // sets the order of the task
            if(self.toDoObject.sortOrder != "") {
                var sortedValues = self.toDoObject.sortOrder.substring(7).split("&task[]=");
                var ul = jQuery("#sortable");
                var items = jQuery("#sortable").children();
                for (var i = sortedValues.length - 1; i >= 0; i--) {
                    ul.prepend( items.get((sortedValues[i])));
                }
            }
            jQuery( "#sortable" ).disableSelection();
            $('inputTitle').hide();
            $('saveTitleBtn').hide();
        });
    },
    saveTasks: function(){
        var self = this;
        var title = $(this.titleElementId).innerHTML;

        if (!$(self.titleInput).value.empty()){
            title = $(self.titleInput).value;
        }
        var toDoListJSON = {"title": title, toDoList: [], "sortOrder": ""}

        self.toDoObject.toDoList.each(function(task, index){
            toDoListJSON.toDoList.push({
                'task': $(self.inputId + index).getValue(),
                'isComplete': task['isComplete']
            });
        })
        toDoListJSON.sortOrder = self.toDoObject.sortOrder;
        localStorage.setItem('data', JSON.stringify(toDoListJSON));
        location.reload();
    },
    deleteTask: function(event){
        var taskId = event.element().up(0).identify().replace('task_', '');
        var taskObject = this.toDoObject.toDoList;
        delete taskObject[taskId];

        this.saveOrder();
        this.saveTasks();
    },
    taskComplete: function(event) {
        var taskId = event.element().up(0).identify().replace('task_', '');
        var taskObject = this.toDoObject.toDoList;
        var isComplete = taskObject[taskId]['isComplete'];

        if(isComplete){
            taskObject[taskId]['isComplete'] = false;
        } else{
            taskObject[taskId]['isComplete'] = true;
        }
        this.saveTasks();
    },
    addTask : function() {
        this.toDoObject.toDoList.push({
            'task': '',
            'isComplete': false
        })
        this.saveOrder();
    },
    saveOrder: function(){
        var sorted = jQuery("#sortable").sortable("serialize");
        this.toDoObject.sortOrder = sorted;
    }
});

var ToDoList = Class.create( toDoListManager,{
    setupHtml: function() {
        var self = this;
        
        $(self.titleElementId).update(self.toDoObject.title);

        self.toDoObject.toDoList.each(function (task, index) {
            self.insertLi(index);
            if (task['isComplete']) {
                $(self.taskDivId + index).update(task['task'].strike());
                $(self.inputId + index).setValue(task['task']);
                $(self.inputId + index).hide()
                $(self.taskDivId + index).show();
            } else {
                $(self.inputId + index).setValue(task['task']);
                $(self.inputId + index).show()
                $(self.taskDivId + index).hide();
            }
        });
    },
    insertLi: function(index) {
        var taskId = { taskId : index};
        $('sortable').insert(this.liTemplate.evaluate(taskId));
    }
});