const newTaskContainer = document.querySelector('.taskArea');
const pendingTaskList = document.getElementById('pending');
const completeTaskList = document.getElementById('resolve');

document.addEventListener('DOMContentLoaded', () => {
    insertBtn(newTaskContainer);
    insertTasks(pendingTaskList, completeTaskList);
})

function createNewTask(container) {
    container.innerHTML = '';
    const newTaskForm = document.createElement('div');
    newTaskForm.classList.add('newTask');
    newTaskForm.innerHTML = `
        <h2 class="newTask__title">Nueva tarea: </h2>
        <img src="/icon/close.svg" alt="cerrar" class="newTask__close">
        <span class="newTask__name">
            <p class="newTask_name-p">Nombre:</p>
            <input type="text" class="newTask_name-input" maxlength="20">
            <p class="newTask_name-caracterCount" id='titleCount'>0/20</p>
        </span>
        <span class="newTask__desciption">
            <p class="newTask_name-p">Descripción:</p>
            <textarea class="newTask__desciption-textArea" maxlength="300"></textarea>
            <p class="newTask_name-caracterCount" id='descriptionCount'>0/300</p>
        </span>
        <a href="#" class="newTask__save">Guardar</a>
    `
    container.appendChild(newTaskForm);
    newTaskForm.style.animation = 'showItem 1s ease-in'
    setTimeout(() => {
        newTaskForm.style.opacity = '1';
    }, 1000)

    const saveTaskBtn = document.querySelector('.newTask__save');
    const nameTaskInput = document.querySelector('.newTask_name-input')
    const desciptionTaskText = document.querySelector('.newTask__desciption-textArea')
    saveTaskBtn.addEventListener('click', () => {
        saveTask(nameTaskInput.value, desciptionTaskText.value, pendingTaskList);
    })
    const closeTaskContainer = document.querySelector('.newTask__close');
    closeTaskContainer.addEventListener('click', () => {
        insertBtn(container);
        location.reload;
    })
    //counts
    nameTaskInput.addEventListener('input', ()=>{
        const titleCaractersCount = document.getElementById('titleCount');
        titleCaractersCount.innerHTML = `${nameTaskInput.value.length}/20`;
        if(nameTaskInput.value.length >= 18) {
            titleCaractersCount.style.backgroundColor = 'red';
        } else {
            titleCaractersCount.style.backgroundColor = 'rgba(0, 128, 0, 0.39)';
        }
    })

    desciptionTaskText.addEventListener('input', ()=> {
        const descriptionCaractersCount = document.getElementById('descriptionCount')
        descriptionCaractersCount.innerHTML = `${desciptionTaskText.value.length}/300`;
        if(desciptionTaskText.value.length >= 280) {
            descriptionCaractersCount.style.backgroundColor = 'red';
        } else {
            descriptionCaractersCount.style.backgroundColor = 'rgba(0, 128, 0, 0.39)';
        }
    })
}

function saveTask(name, description, list) {
    let storedTasks = JSON.parse(localStorage.getItem('taskList'));
    if (storedTasks === null) {
        storedTasks = [];
    }
    const validateTask = storedTasks.find(element => element.taskName === name);
    if(validateTask) {
        alert('Ya existe una tarea con ese nombre');
    } else {
        if(name.trim() === '') {
            alerts('warning', 'Por favor, agrega un nombre a tu tarea para continuar.')
        } else {
            const newTask = {
                taskName: name,
                taskDescription: description,
                state: true,
                taskMarked: false,
                id: Math.floor(Math.random() * 1000000)
            };
            storedTasks.push(newTask);
            localStorage.setItem('taskList', JSON.stringify(storedTasks));
            const taskLiElement = document.createElement('li');
            taskLiElement.classList.add('task');
            taskLiElement.innerHTML = `
                <p class="task__name">${name}</p>
                <div class="task__opt">
                    <img src="/icon/info.svg" alt="info" title="Descripción" class="task__opt-btn">
                    <img src="/icon/check.svg" alt="info" title="Completar" class="task__opt-btn">
                    <img src="/icon/flag.svg" alt="info" title="Resaltar" class="task__opt-btn">
                </div>
            `;
            list.appendChild(taskLiElement);
            location.reload();
        }

    }
}

function insertBtn(container) {
    container.innerHTML = '';
    const newTaskBtn = document.createElement('a');
    newTaskBtn.classList.add('newTaskBtn');
    newTaskBtn.setAttribute('id', 'newTask');
    newTaskBtn.textContent = 'Nueva tarea';
    container.appendChild(newTaskBtn);
    newTaskBtn.addEventListener('click', () => {
        createNewTask(newTaskContainer);
    });
}

function insertTasks(pendingsList, completeList) {
    const taskAvailable = JSON.parse(localStorage.getItem('taskList'));
    if (taskAvailable === null) {
        alert('No hay tareas')
    } else {
        const optionsTaskBtns = document.querySelectorAll('.task__opt-btn');
        optionsTaskBtns.forEach(button => {
            button.removeEventListener('click', handleTaskOption);
        });

        taskAvailable.forEach(element => {
            const liElement = document.createElement('li');
            liElement.classList.add('task');
            if (element.state === true) {
                if(element.taskMarked === true) {
                    liElement.classList.add('marked');
                } 
                liElement.innerHTML = `
                    <p class="task__name">${element.taskName}</p>
                    <div class="task__opt"> 
                        <img src="/icon/info.svg" alt="info" title="Descripción" class="task__opt-btn" data-task-id="${element.id}" data-action="description">
                        <img src="/icon/check.svg" alt="info" title="Completar" class="task__opt-btn" data-task-id="${element.id}" data-action="complete">
                        <img src="/icon/flag.svg" alt="info" title="Resaltar" class="task__opt-btn" data-task-id="${element.id}" data-action="market">
                    </div>
                `;
                pendingsList.appendChild(liElement);
                liElement.style.animation = 'showItem 1s ease-in';
                setTimeout(() => {
                    liElement.style.opacity = '1';
                }, 1000);
            } else {
                liElement.innerHTML = `
                    <p class="task__name">${element.taskName}</p>
                    <div class="task__opt">
                        <img src="/icon/delete.svg" alt="info" title="Eliminar" class="task__opt-btn" data-task-id="${element.id}" data-action="delete">
                        <img src="/icon/back.svg" alt="info" title="Reabrir tarea" class="task__opt-btn" data-task-id="${element.id}" data-action="reopen">
                    </div>
                `;
                completeList.appendChild(liElement);
                liElement.style.animation = 'showItem 1s ease-in';
                setTimeout(() => {
                    liElement.style.opacity = '1';
                }, 1000);
            }
        });
        const newOptionsTaskBtns = document.querySelectorAll('.task__opt-btn');
        newOptionsTaskBtns.forEach(button => {
            button.addEventListener('click', handleTaskOption);
        });
    }
}

function handleTaskOption(event) {
    const taskId = event.currentTarget.getAttribute('data-task-id');
    const action = event.currentTarget.getAttribute('data-action');
    taskOptions(taskId, action);
}

function taskOptions(taskId, taskAction) {
    const taskList = JSON.parse(localStorage.getItem('taskList'));
    const findTaskIndex = taskList.findIndex(task => task.id.toString() === taskId);
    
    if(findTaskIndex !== -1){
        const findTask = taskList[findTaskIndex];
        
        if (taskAction === 'description') {
            alerts('description', `${findTask.taskDescription}`);
        } else if (taskAction === 'complete') {
            console.log('se marca como completa la tarea');
            findTask.state = false;
            findTask.taskMarked = false;
            localStorage.setItem('taskList', JSON.stringify(taskList));
            location.reload();
        } else if (taskAction === 'market') {
            console.log('se resalta la tarea');
            findTask.taskMarked = !findTask.taskMarked;
            localStorage.setItem('taskList', JSON.stringify(taskList));
            location.reload();
        } else if (taskAction === 'delete') {
            alerts('delete', 'lorem')
            const deleteTaskBtn = document.querySelector('.optionBtn');
            deleteTaskBtn.addEventListener('click', ()=>{
                taskList.splice(findTaskIndex, 1);
                localStorage.setItem('taskList', JSON.stringify(taskList));
                location.reload();
            })
        } else if (taskAction === 'reopen') {
            console.log('se reabre la tarea');
            findTask.state = true;
            localStorage.setItem('taskList', JSON.stringify(taskList));
            location.reload();
        }
    } else {
        console.log('no se localizó la tarea');
    }
}

function alerts(alertType, taskDescription) {
    const alertContainer = document.querySelector('.alerts');
    alertContainer.innerHTML = '';
    if(alertType === 'delete') {
        alertContainer.innerHTML = `
        <p class="alerts__text">
            Las tareas eliminadas no pueden recuperarse <br>
            ¿Deseas continuar?
        </p>
            <img src="/icon/close.svg" alt="close alert" class="alerts__icon__close">
            <a href='#' class="optionBtn">Si</a>
        `
        alertContainer.style.backgroundColor = 'rgba(255, 255, 0, 0.815)';
        alertContainer.style.display = 'flex'
    } else if (alertType === 'description') {
        alertContainer.innerHTML = `
        <p class="alerts__text">${taskDescription}</p>
        <img src="/icon/close.svg" alt="close alert" class="alerts__icon__close">
        `
        alertContainer.style.backgroundColor = 'var(--color1)';
        alertContainer.style.display = 'flex'
    } else if (alertType === 'warning') {
        alertContainer.innerHTML = `
        <p class="alerts__text">${taskDescription}</p>
        `
        alertContainer.style.backgroundColor = 'rgba(255, 255, 0, 0.815)';
        alertContainer.style.display = 'flex'
        setTimeout(()=>{
            alertContainer.style.display = 'none'
            alertContainer.innerHTML = '';
        }, 5000)
    }
    const closeBtn = document.querySelector('.alerts__icon__close')
    closeBtn.addEventListener('click', ()=>{
        alertContainer.style.display = 'none'
    })
}