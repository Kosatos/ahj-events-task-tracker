import Task from './Task';

export default class TaskTracker {
  constructor(formName) {
    this.allTasks = [];
    this.form = document.getElementById(`${formName}`);
    this.input = this.form.querySelector('#task-input');
    this.tasksBox = document.getElementById('all-tasks');
    this.pinnedTasksBox = document.getElementById('pinned-tasks');

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = new Task(this.input.value);
      this.allTasks.push(task);
      this.createTaskDOM(task.taskName, 'all');

      this.form.reset();
    });
  }

  createTaskDOM(taskName, taskBox) {
    const task = document.createElement('div');
    task.classList.add('task');
    const taskTitle = document.createElement('h4');
    taskTitle.textContent = `${taskName}`;
    const taskCheckbox = document.createElement('div');
    taskCheckbox.classList.add('task__checkbox');

    taskCheckbox.addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('pinned');
      this.allTasks.forEach((task) => {
        if (
          task.taskName === e.currentTarget.previousElementSibling.textContent
        ) {
          this.pinTask(e.currentTarget, task);
        }
      });
    });

    task.appendChild(taskTitle);
    task.appendChild(taskCheckbox);

    if (taskBox === 'all') {
      this.tasksBox.appendChild(task);
    } else if (taskBox === 'pinned') {
      if (document.getElementById('no-pinned')) {
        document.getElementById('no-pinned').style.display = 'none';
      }
      this.pinnedTasksBox.appendChild(task);
      taskCheckbox.classList.toggle('pinned');
    }
  }

  pinTask(e, task) {
    e.closest('.task').remove();
    if (!this.pinnedTasksBox.querySelector('.task')) {
      document.getElementById('no-pinned').style.display = 'block';
    }

    if (task.pinned === false) {
      task.pinned = true;
      this.createTaskDOM(task.taskName, 'pinned');
    } else {
      task.pinned = false;
      this.createTaskDOM(task.taskName, 'all');
    }
  }
}
