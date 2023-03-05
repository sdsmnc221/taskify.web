import { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Todo } from './components/model';
import InputField from './components/elements/InputField/InputField';
import TodosList from './components/elements/TodosList/TodosList';

import './App.scss';

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      setTodos([...todos, { id: Date.now(), todo, isDone: false }]);
      setTodo('');
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let add,
      active = todos,
      completed = completedTodos;

    if (source.droppableId === 'todosList') {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = completed[source.index];
      completed.splice(source.index, 1);
    }

    if (destination.droppableId === 'todosList') {
      active.splice(destination.index, 0, add);
    } else {
      completed.splice(destination.index, 0, add);
    }

    setTodos(active);
    setCompletedTodos(completed.map((todo) => ({ ...todo, isDone: true })));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="app">
        <h1 className="heading">Taskify</h1>
        <InputField
          todo={todo}
          setTodo={setTodo}
          handleAddTask={handleAddTask}
        />
        <TodosList
          todos={todos}
          setTodos={setTodos}
          completedTodos={completedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
