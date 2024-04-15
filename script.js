const todoInput = document.querySelector('.todo-input');
const todoForm = document.querySelector('.form');
const list = document.querySelector('.todo-list');

let todoItems = [];

function renderTodo(todo) {
    
    const item = document.querySelector(`[data-key='${todo.id}']`);
    const node = document.createElement('li');
    const isChecked = todo.checked ? 'done':'';
    
    if (todo.delete) {
        const index = todoItems.findIndex(t => t.id === Number(todo.id));
        
        item.remove();
        todoItems.splice(index,index + 1);
        
        if (todoItems.length === 0) list.innerHTML = '';
        
        localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));
        
        return;
    }
    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todo.id);
    node.innerHTML = `
    <input id = "${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>`

    if (item) {
        list.replaceChild(node, item);
    } else {
        list.append(node);
    }

    console.log(todoItems);
    localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));

}

function addTodo(text) {
    const todo = {
        text,
        checked: false,
        id: Date.now(),
    }
    todoItems.push(todo);
    renderTodo(todo);
}

todoForm.addEventListener('submit', event => {
    event.preventDefault();

    const text = todoInput.value.trim();

    if(text !== '') {
        addTodo(text)
        todoInput.value = '';
        todoInput.focus();
    }
});

list.addEventListener('click', event => {
    const idKey = event.target.parentElement.dataset.key;

    if(event.target.classList.contains('tick')) {
        toggleDone(idKey);
    }
    if (event.target.classList.contains('delete-todo')) {
        deleteTodo(idKey);
    }
});

function toggleDone(key) {
    const index = todoItems.findIndex(event => event.id === Number(key));
    todoItems[index].checked = !todoItems[index].checked;
    renderTodo(todoItems[index]);
}

function deleteTodo(key) {
    const index = todoItems.findIndex(event => event.id === Number(key));
    const todo = {
        delete: true,
        ...todoItems[index],
    }
    renderTodo(todo);
}

document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('todoItemsRef');

    if (ref) {
        todoItems = JSON.parse(ref);
        todoItems.forEach(todo => renderTodo(todo));
    }
});