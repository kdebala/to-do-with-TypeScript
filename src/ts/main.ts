import '../sass/style.scss';
import { v4 as uuidv4 } from 'uuid';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>('#list');
const input = document.querySelector<HTMLInputElement>('#new-task-item');
const btn = document.querySelector<HTMLButtonElement>('#new-task-btn');

const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

btn?.addEventListener('click', e => {
  e.preventDefault();
  if (input?.value == '' || input?.value == null) return;

  const newTask: Task = {
    id: uuidv4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };
  input.value = '';
  tasks.push(newTask);
  saveTasks(tasks);

  addListItem(newTask);
});

function addListItem(task: Task) {
  const item = document.createElement('li');
  const todoEl = document.createElement('p');
  todoEl.textContent = task.title;
  item.classList.add('item');
  item.setAttribute('id', task.id);
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks(tasks);
  });
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  const close = document.createElement('button');
  close.classList.add('close');
  close.textContent = 'X';
  label.appendChild(checkbox);
  close.addEventListener('click', function (e) {
    const targetElement = e.target as Element;
    tasks.splice(
      tasks.findIndex(task => task.id === targetElement.parentElement?.id),
      1,
    );
    saveTasks(tasks);
    targetElement.parentElement?.remove();
  });
  item.appendChild(label);
  item.appendChild(todoEl);
  item.appendChild(close);
  list?.appendChild(item);
}

function saveTasks(taskList: Task[]) {
  localStorage.setItem('TASKS', JSON.stringify(taskList));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem('TASKS');
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON);
}
