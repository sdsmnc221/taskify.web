import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Todo } from './components/model';
import InputField from './components/elements/InputField/InputField';
import TodosList from './components/elements/TodosList/TodosList';
import {
  setDoc,
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  getDocs,
  doc
} from '@firebase/firestore';
import { firestore } from './utils/firebase';

import './App.scss';

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTasks = async (db: Firestore) => {
      const tasksCollection: CollectionReference<DocumentData> = collection(
        db,
        'tasks'
      );
      const tasksSnapshot = await getDocs(tasksCollection);
      const tasksList = tasksSnapshot.docs.map((doc) => doc.data());
      return tasksList;
    };

    fetchTasks(firestore)
      .then((tasks) => {
        if (tasks.length > 0) {
          setTodos(
            tasks
              .filter((task) => !task.isDone)
              .map((task) => ({
                id: task.id,
                todo: task.todo,
                isDone: task.isDone
              }))
          );
          setCompletedTodos(
            tasks
              .filter((task) => task.isDone)
              .map((task) => ({
                id: task.id,
                todo: task.todo,
                isDone: task.isDone
              }))
          );
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      const newTodo = { id: Date.now(), todo, isDone: false };
      setTodos([...todos, newTodo]);
      setTodo('');

      await setDoc(doc(firestore, 'tasks', newTodo.id.toString()), newTodo);
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
