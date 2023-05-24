import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

const App = () => {
  const queryClient = useQueryClient();

  // Fetch todos
  const { isLoading, error, data } = useQuery("todos", async () => {
    const response = await fetch("http://localhost:8765/todos");
    return response.json();
  });

  // Add todo mutation
  const addTodoMutation = useMutation(
    async (newTodo) => {
      const response = await fetch("http://localhost:8765/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  // Handler for submitting the form
  const handleSubmit = (e) => {
    e.preventDefault();
    const { value } = e.target.todoInput;
    const newTodo = {
      id: Math.random().toString(36).substring(7), // Generate a random alphanumeric id
      title: value,
    };
    addTodoMutation.mutate(newTodo);
    e.target.reset();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="todoInput"
          placeholder="Enter a todo"
          required
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
