// Required IDs
const taskForm  = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const addBtn    = document.getElementById('addBtn');
const statusEl  = document.getElementById('status');
const taskList  = document.getElementById('taskList');
const themeBtn  = document.getElementById('themeBtn');
const storageKey = "task-item";

// local storage 
function save() {
    localStorage.setItem("tasks", taskList.innerHTML);
}

function load() {
    taskList.innerHTML = localStorage.getItem("tasks") || "";
}

// Counting of tasks
function taskCount() {
  return taskList.querySelectorAll('.task-item').length;
}

 
function createTaskItem(text) {
  const li = document.createElement('li');
  li.className = 'task-item';

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = text;

  const completeBtn = document.createElement('button');
  completeBtn.className = 'btn complete';
  completeBtn.type = 'button';
  completeBtn.textContent = 'Done';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn delete';
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Delete';

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  return li;
}


taskForm.addEventListener('submit', (task) => {
  task.preventDefault();

  const value = taskInput.value.trim();
  if (!value) {
    updateStatus('Please enter a task.');
    taskInput.focus();
    return;
  }

  const item = createTaskItem(value);
  taskList.appendChild(item);

  taskInput.value = '';
  taskInput.focus();

  updateStatus(`Added: “${value}”. ${taskCount()} task(s) total.`);
});


taskList.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const li = btn.closest('.task-item');
  if (!li) return;

  const textEl = li.querySelector('.task-text');
  const label = textEl ? textEl.textContent : 'Task';

  
  if (btn.classList.contains('complete')) {
    const nowDone = li.classList.toggle('done');
    btn.textContent = nowDone ? 'Undo' : 'Done';
    updateStatus(`${nowDone ? 'Marked done' : 'Restored'}: “${label}”.`);
    return;
  }

  
  if (btn.classList.contains('delete')) {
    const allItems = Array.from(taskList.querySelectorAll('.task-item'));
    const idx = allItems.indexOf(li);

    
    li.remove();

    
    const remaining = taskList.querySelectorAll('.task-item');
    if (remaining.length > 0) {
      const nextIdx = Math.min(idx, remaining.length - 1);
      const nextItem = remaining[nextIdx];
      const nextBtn = nextItem.querySelector('button');
      if (nextBtn) nextBtn.focus();
    } else {
      taskInput.focus();
    }

    updateStatus(`Deleted: “${label}”. ${taskCount()} task(s) left.`);
  }
});

// Theme toggle
themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeBtn.setAttribute('aria-pressed', String(isDark));
  updateStatus(`Theme: ${isDark ? 'Dark' : 'Light'}.`);
});


window.addEventListener('DOMContentLoaded', () => {
  taskInput?.focus();
});

