import { useState, useEffect } from "react";
import axiosInstance from "../../axios";

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState(null);
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const response = await axiosInstance.delete(`/todos/${id}`);
      console.log(response.data);
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async (content) => {
    const id = content.id;
    const isCompleted = content.isCompleted;
    if (isCompleted) {
      try {
        const response = await axiosInstance.patch(
          `/todos/${id}`,
          JSON.stringify({
            isCompleted: false,
          })
        );
        console.log(response.data);
        fetchTodos();
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleDone = async (content) => {
    const id = content.id;
    const isCompleted = content.isCompleted;
    if (!isCompleted) {
      try {
        const response = await axiosInstance.patch(
          `/todos/${id}`,
          JSON.stringify({
            isCompleted: true,
          })
        );
        console.log(response.data);
        fetchTodos();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (title) {
      try {
        const response = await axiosInstance.post(
          "/todos",
          JSON.stringify({
            title: title,
            isCompleted: false,
          })
        );
        console.log(response.data);
        setTodos([...todos, response.data]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchTodos = async (query) => {
    try {
      const response = await axiosInstance.get("/todos", {
        params: {
          q: query,
        },
      });
      console.log(response.data);
      setTodos(response.data);
      console.log(todos);
    } catch (error) {
      console.log(error);
    }
  };

  // Debounce function
  const debounce = (func, delay) => {
    let inDebounce;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const onSearch = (e) => {
    setQuery(e.target.value);
    debounceOnSearch(e.target.value);
  };

  // Debounce the fetchProducts function
  const debounceOnSearch = debounce(fetchTodos, 500);

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todolist">
      <div className="search" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Search ex: todo 1"
          onChange={(e) => onSearch(e)}
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos.length > 0 &&
          todos?.map((todo, id) => (
            <div
              key={id}
              className={`list ${todo.isCompleted ? "completed" : ""}`}
            >
              <p> {todo.title}</p>
              <div className="span-btns">
                {!todo.isCompleted && (
                  <span onClick={() => handleDone(todo)} title="completed">
                    ✓
                  </span>
                )}
                <span
                  className="delete-btn"
                  onClick={() => handleDelete(todo.id)}
                  title="delete"
                >
                  x
                </span>
                <span
                  className="edit-btn"
                  onClick={() => handleEdit(todo)}
                  title="edit"
                >
                  ↻
                </span>
              </div>
            </div>
          ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
