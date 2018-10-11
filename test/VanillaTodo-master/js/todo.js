document.querySelector('#taskInput').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (( key == 13 ) && ( document.querySelector('#taskInput').value.length > 0 )) // 13 is enter
    	addToList( this.value.trim() );
});

var taskList = [],
	completedTasks = [];

if( JSON.parse( localStorage.getItem( 'taskList' )))
	taskList = JSON.parse( localStorage.getItem( 'taskList' ));
else
	localStorage.setItem("taskList", JSON.stringify( taskList ));

updateCompletedListArray();
updateListView();

function updateCompletedListArray() {
	completedTasks = [];

	taskList.forEach(function( task ) {
		if( task.done )
			completedTasks.push( taskList.indexOf( task ) + '' );
	});
}

function addToList( task ){
	if( checkDuplicate( task )) {
		// animateInvalid(); // Animates input field with red outline if an invalid input is given
		return;
	}

	taskList.push({
		name: task,
		done: false
	});

	updateListView();

	localStorage.setItem('taskList', JSON.stringify( taskList ));
	document.querySelector('#taskInput').value = '';
}

function updateListView() {
	var ul = document.getElementById('taskList');

	ul.innerHTML = '';

	taskList.forEach(function( task ) {
		var listItem = document.createElement('li'),
			taskLabel = document.createElement('label'),
			delBtn = document.createElement('span'),
			checkbox = document.createElement('input');

		listItem.className = 'task';
		listItem.id = taskList.indexOf( task );

		taskLabel.className = 'taskLabel';
		taskLabel.textContent = task.name;
		taskLabel.htmlFor = 'c' + taskList.indexOf( task );

		delBtn.className = 'deleteTaskBtn';
		delBtn.textContent = 'x';
		delBtn.onclick = deleteThisTask;

		checkbox.className = 'taskCheckbox'
		checkbox.id = 'c' + taskList.indexOf( task );
		checkbox.type = 'checkbox';
		checkbox.checked = task.done;
		checkbox.onclick = toggleChecked;

		listItem.appendChild( checkbox );
		listItem.appendChild( taskLabel );
		listItem.appendChild( delBtn );
			  ul.appendChild( listItem );
	});
}

function toggleChecked(e) {
	var checkStatus = e.target.checked,
		task = e.target.parentElement,
		taskId = task.id,
		removed = false;

	taskList[taskId].done = checkStatus;

	if( completedTasks.length === 0 ) {
		completedTasks.push( taskId );
	}
	else {
		completedTasks.forEach(function( index ) {
			if( taskId === index ) {
				completedTasks.splice( completedTasks.indexOf( index ), 1 );
				removed = true;
			}
		});

		if( !removed ) {
			completedTasks.push( taskId );
			completedTasks.sort();
		}
	}

	saveLocalList();
}

function checkDuplicate( task ) {
	var matchFound = false;

	taskList.forEach(function( t ) {
		if( t.name === task )
			matchFound = true;
	});

	return matchFound;
}

function deleteThisTask(e) {
	taskList.splice( e.target.parentElement.id, 1 );

	saveLocalList();
	updateCompletedListArray();
	updateListView();
}

function saveLocalList() {
	localStorage.setItem("taskList", JSON.stringify( taskList ));
}
