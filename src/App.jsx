import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: Date.now(), text, completed: false }])
    setInput('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const filtered = todos.filter(t => {
    if (filter === 'completed') return t.completed
    return true
  })

  return (
    <div className="app">
      <h1>Todo List</h1>

      <form onSubmit={addTodo} className="input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task..."
          autoFocus
        />
        <button type="submit">Add</button>
      </form>

      <div className="tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="todo-box">
        {filtered.length === 0 ? (
          <p className="empty">No tasks here.</p>
        ) : (
          <ul className="todo-list">
            {filtered.map(todo => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
                <button className="delete" onClick={() => deleteTodo(todo.id)}>✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
