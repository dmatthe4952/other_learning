$('#new-todo-form').submit(function(e){
  e.preventDefault();
  var toDoItem = $(this).serialize();
  $.post('/todos', toDoItem, function(data){
     $('#todo-list').append(
       `
       <li class="list-group-item">
         <span class="lead">
           ${data.text}
         </span>
         <div class="pull-right">
           <button class="btn btn-sm btn-warning">Edit</button>
           <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-form">
             <button type="submit" class="btn btn-sm btn-danger">Delete</button>
           </form>
         </div>
         <div class="clearfix"></div>
       </li>
       `
     );
     $('#new-todo-form').find('.form-control').val('');
  });
});
$('#todo-list').on('click','.edit-button', function(){
  $(this).parent().siblings('.edit-item-form').toggle();
});
$('#todo-list').on('submit', '.edit-item-form', function(e){
  e.preventDefault();
  var formData = $(this).serialize();
  var formAction = $(this).attr('action');
  var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url:formAction,
    data:formData,
    type:'PUT',
    originalItem: $originalItem,
    success: function(data){
      this.originalItem.html(
      `
        <form action="/todos/${data._id}" method="POST" class='edit-item-form'>
          <div class="form-group">
            <label>Item Text</label>
            <input type="text" value="${data.text}" name="todo[text]" class="form-control">
          </div>
          <button class="btn btn-primary update-button">Update Item</button>
        </form>
        <span class="lead">
          ${data.text}
        </span>
        <div class="pull-right">
          <button class="btn btn-sm btn-warning edit-button">Edit</button>
          <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-form">
            <button type="submit" class="btn btn-sm btn-danger">Delete</button>
          </form>
        </div>
        <div class="clearfix"></div>
      `
    )}
  });
  $('#todo-list').parent().siblings('.edit-item-form').toggle()
});
$('#todo-list').on('submit', '.delete-form', function(e){
  e.preventDefault();
  var confirmResponse = confirm('Are you sure?');
  var $itemToDelete = $(this).closest('.list-group-item');
  if(confirmResponse){
    var formAction = $(this).attr('action');
    $.ajax({
      url:formAction,
      type: 'DELETE',
      itemToDelete: $itemToDelete,
      success: function(data){
        this.itemToDelete.remove();
      }
    })
  } else {
    $(this).find('button').blur();
  }
});
