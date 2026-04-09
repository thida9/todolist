import { useState, useEffect } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { db } from './firebase'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const todosRef = ref(db, 'todos')
    const unsubscribe = onValue(todosRef, (snapshot) => {
      const data = snapshot.val()
      setTodos(data ? Object.values(data) : [])
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const saveTodos = (updated) => {
    const todosRef = ref(db, 'todos')
    const obj = updated.reduce((acc, t) => ({ ...acc, [t.id]: t }), {})
    set(todosRef, updated.length ? obj : null)
  }

  const addTodo = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const updated = [...todos, { id: Date.now(), text, completed: false }]
    saveTodos(updated)
    setInput('')
  }

  const toggleTodo = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    saveTodos(updated)
  }

  const deleteTodo = (id) => {
    const updated = todos.filter(t => t.id !== id)
    saveTodos(updated)
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
        {loading ? (
          <p className="empty">Loading...</p>
        ) : filtered.length === 0 ? (
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
