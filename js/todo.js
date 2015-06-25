document.observe("dom:loaded", function() {
    var numTask;

    if (localStorage.getItem('numTask') === null){
        numTask = 1;
        console.log(numTask);
    } else {
        var i;
        numTask = localStorage.getItem('numTask');
        for (i = 2; i <= numTask; i++){
            insertLi(i);
        }
    }

    $('task1').setValue(localStorage.getItem('task1'));

    $('addTask').observe('click', function(e) {
       insertLi(numTask+=1);
    });

    $('save').observe('click', function(e) {
       localStorage.setItem('numTask', jQuery('li').length);
       localStorage.setItem('task1', $('task1').value );
    });

});

function insertLi(numTask) {
    $('sortable').insert('<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span><input id="task'+
    (numTask) + '" size="60" type="text"></li>')
}