import Task from './Task';

export default class TaskTracker {
  constructor(formName) {
    this.allTasks = [];
    this.form = document.getElementById(`${formName}`);
    this.input = this.form.querySelector('#task-input');
    this.tasksBox = document.getElementById('all-tasks');
    this.pinnedTasksBox = document.getElementById('pinned-tasks');
    this.popup = document.getElementById('popup');

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (this.input.value.startsWith(' ') || this.input.value === '') {
        this.popup.classList.toggle('overlay-visible');

        this.resetTasks();
        this.form.reset();
        return;
      }

      const task = new Task(this.input.value);
      this.allTasks.push(task);
      this.createTaskDOM(task.taskName, 'all');

      this.resetTasks();
      this.form.reset();
    });

    this.input.addEventListener('input', (e) => {
      const filterValue = e.target.value;
      this.resetTasks();
      this.filterTasks(filterValue);
    });

    document.getElementById('close-btn').addEventListener('click', () => {
      this.popup.classList.toggle('overlay-visible');
    });
  }

  // Создает DOM-элемент, вешает обработчик события клика
  // на чекбокс, добавляет элемент в закрепленные или все
  // задачи

  createTaskDOM(taskName, taskBox) {
    const task = document.createElement('li');
    task.classList.add('task');
    const taskTitle = document.createElement('h4');
    taskTitle.textContent = `${taskName}`;
    const taskCheckbox = document.createElement('div');
    taskCheckbox.classList.add('task__checkbox');

    taskCheckbox.addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('pinned');
      this.allTasks.forEach((item) => {
        if (
          item.taskName === e.currentTarget.previousElementSibling.textContent
        ) {
          this.pinTask(e.currentTarget, item);
        }
      });
    });

    task.appendChild(taskTitle);
    task.appendChild(taskCheckbox);

    if (taskBox === 'all') {
      this.tasksBox.appendChild(task);
    } else if (taskBox === 'pinned') {
      if (!document.getElementById('no-pinned').classList.contains('hidden')) {
        document.getElementById('no-pinned').classList.toggle('hidden');
      }
      this.pinnedTasksBox.appendChild(task);
      taskCheckbox.classList.toggle('pinned');
    }
  }

  // Удаляет из списка элемент при нажатии на чекбокс и добавляетв в другой список,
  // изменяет состояние задачи pinned true/false

  pinTask(e, pinnedTask) {
    e.closest('.task').remove();
    if (!this.pinnedTasksBox.querySelector('.task')) {
      document.getElementById('no-pinned').classList.toggle('hidden');
    }

    if (pinnedTask.pinned === false) {
      pinnedTask.pinned = true;
      this.createTaskDOM(pinnedTask.taskName, 'pinned');
    } else {
      pinnedTask.pinned = false;
      this.createTaskDOM(pinnedTask.taskName, 'all');
      this.filterTasks(this.input.value);
    }
  }

  // Фильтрует задачи в списке всех задач по набранным символам

  filterTasks(value) {
    const tasks = [...this.tasksBox.querySelectorAll('.task')];

    if (tasks) {
      tasks.forEach((task) => {
        if (
          task
            .querySelector('h4')
            .textContent.toLowerCase()
            .startsWith(value.toLowerCase())
        ) {
          return;
        }

        task.classList.add('hidden');
      });

      if (tasks.every((task) => task.classList.contains('hidden'))) {
        document.getElementById('no-found').classList.remove('hidden');
      } else {
        document.getElementById('no-found').classList.add('hidden');
      }
    }
  }

  // Отображает все задачи в списке

  resetTasks() {
    const tasks = [...this.tasksBox.querySelectorAll('.task')];
    tasks.forEach((task) => {
      task.classList.remove('hidden');
    });
    document.getElementById('no-found').classList.add('hidden');
  }
}
