$(document).ready(function(){

  // load tasks
  loadTasks();

  // target button with enter key
  $('#taskIn').keypress(function(event){
    if(event.keyCode == 13){
      $('#addTaskButton').click();
    }
  }); // end target button

  // create new task object to send from input
  $('#addTaskButton').on('click', function(){
    console.log('addTaskButton clicked');
    var newTask = $('#taskIn').val();
    // if/else statement to not leave blank inputs and only use approved values
    if(newTask === ''){
      alert("Task field empty!");
    } else {
      var taskObject = {
        "task": newTask,
        "status": false
      }; // end taskObject
      $.ajax({
        type: 'POST',
        url: '/createTask',
        data: taskObject,
        success: function(){
          loadTasks();
        }, // end success
      }); // end ajax
      $('#taskIn').val('');
    } // end if/else input check
  }); // end create new task object to send

  // mark tasks as complete
  $('#outputTable').on('click', '#completeButton', function(){
    console.log('completeButton clicked');
    var completeStatus = $(this).attr('data-status');
    var completeTaskObject = {
      "id": $(this).attr('data-id'),
      "status": completeStatus
    }; // end object
    $(this).closest('tr').css('opacity', '0.40');
    $("#completedTable").append($(this).parent().parent());
    $(this).remove();
    $.ajax({
      type: 'POST',
      url: '/completeTask',
      data: completeTaskObject,
      success: function(){
        loadTasks();
      } // end success
    }); // end ajax
  }); // end delete task

  // delete task
  $('#outputTable, #completedTable').on('click', '#deleteButton', function(){
    console.log('deleteButton clicked, remove id: ');
    if(confirm("Are you sure you want to delete this task?") === true){
      var deleteTaskObject = {
        "id": $(this).attr('data-id')
      }; // end object
      $(this).parent().parent().remove();
      $.ajax({
        type: 'POST',
        url: '/deleteTask',
        data: deleteTaskObject,
        success: function(){
          loadTasks();
        } // end success
      }); // end ajax
    } // end if/else delete confirmation
  }); // end delete task

  // get existing tasks from DB
  function loadTasks(){
    $.ajax({
      type: 'GET',
      url: '/getTasks',
      success: function(data){
        console.log('in getTasks success');
        createOutput(data);
      } // end success
    }); // end ajax
  } // end loadTasks

  // create output and append to DOM
  function createOutput(tasksToDo){
    $('#outputTable').empty();
    $('#completedTable').empty();
    for(i=0; i<tasksToDo.length; i++){
      var completeButton = '<button id="completeButton" data-id="'+ tasksToDo[i].id +'" data-status="'+ tasksToDo[i].status +'">complete</button>';
      var deleteButton = '<button id="deleteButton" data-id="'+ tasksToDo[i].id +'">delete</button></td>';
      if(tasksToDo[i].status === false) {
        var taskRow = '<tr id="taskRow"><td>' + tasksToDo[i].id + '</td>' +
        '<td>' + tasksToDo[i].task + '</td>' +
        '<td>' + tasksToDo[i].created + '</td>' +
        '<td>' + completeButton + deleteButton + '</td></tr>';
        $('#outputTable').append(taskRow);
      } else {
        var doneTaskRow = '<tr id="taskRow"><td>' + tasksToDo[i].id + '</td>' +
        '<td>' + tasksToDo[i].task + '</td>' +
        '<td>' + tasksToDo[i].created + '</td>' +
        '<td>' + deleteButton + '</td></tr>';
        $('#completedTable').append(doneTaskRow);
      } // end if/else to check task status for DOM order appending
    } // end for loop
  } // end createOutput
}); // end jquery
