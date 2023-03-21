import { useState, useEffect, useRef } from 'react';
import { Todo } from './components/model';
import InputField from './components/elements/InputField/InputField';
import TodosList from './components/elements/TodosList/TodosList';
import SaveHeader from './components/elements/SaveHeader/SaveHeader';
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
  const [todosDeleted, setTodosDeleted] = useState<Todo[]>([]);
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

      // await setDoc(doc(firestore, 'tasks', newTodo.id.toString()), newTodo);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1 className="heading">Taskify</h1>
        <SaveHeader
          todos={todos}
          completedTodos={completedTodos}
          todosDeleted={todosDeleted}
        />
      </div>
      <InputField todo={todo} setTodo={setTodo} handleAddTask={handleAddTask} />
      <TodosList
        todos={todos}
        setTodos={setTodos}
        completedTodos={completedTodos}
        setCompletedTodos={setCompletedTodos}
        todosDeleted={todosDeleted}
        setTodosDeleted={setTodosDeleted}
      />
    </div>
  );
};

export default App;
