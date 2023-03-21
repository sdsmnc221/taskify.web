import React, { useRef, useState, useEffect, Fragment } from 'react';
import { Todo } from '../../model';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { IoSwapHorizontalOutline } from 'react-icons/io5';
import { firestore } from '../../../utils/firebase';
import { deleteDoc, doc, setDoc } from '@firebase/firestore';

import './TodoCard.scss';

interface Props {
  todo: Todo;
  todos: Todo[];
  otherTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setOtherTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todosDeleted: Todo[];
  setTodosDeleted: React.Dispatch<React.SetStateAction<Todo[]>>;
  index: number;
}

const TodoCard: React.FC<Props> = ({
  todo,
  todos,
  otherTodos,
  setTodos,
  setOtherTodos,
  todosDeleted,
  setTodosDeleted,
  index
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodoText, setEditTodoText] = useState<string>(todo.todo);
  const [editTodoNote, setEditTodoNote] = useState<string>('');
  const [expanded, setExpanded] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputNoteRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSwap = async (id: number) => {
    setTodos(
      // todos.map((todo) =>
      //   todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      // )
      todos.filter((todo) => todo.id !== id)
    );

    const todo: Todo | undefined = todos.find((todo) => todo.id === id);
    if (todo) {
      const newTodo: Todo = { ...todo, id: Date.now(), isDone: !todo.isDone };
      setOtherTodos([...otherTodos, newTodo]);

      // await deleteDoc(doc(firestore, 'tasks', id.toString()));
      // setDoc(
      //   doc(firestore, 'tasks', newTodo.id.toString()),
      //   { isDone: newTodo.isDone, id: newTodo.id, todo: newTodo.todo },
      //   { merge: true }
      // );
    }
  };

  const handleDelete = async (id: number) => {
    // await deleteDoc(doc(firestore, 'tasks', id.toString()));
    setTodos(todos.filter((todo) => todo.id !== id));

    const deletedTodo: Todo | undefined = [...todos, ...otherTodos].find(
      (todo) => todo.id === id
    );
    if (deletedTodo) setTodosDeleted([...todosDeleted, deletedTodo]);
  };

  const handleEdit = async (e: React.FormEvent, id: number) => {
    console.log('aa');
    e.preventDefault();
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              todo: editTodoText,
              ...(editTodoNote ? { note: editTodoNote } : {})
            }
          : todo
      )
    );
    setEdit(false);

    // setDoc(
    //   doc(firestore, 'tasks', id.toString()),
    //   { todo: editTodoText },
    //   { merge: true }
    // );
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  return (
    <form
      className="todo-card"
      ref={formRef}
      onSubmit={(e) => handleEdit(e, todo.id)}
      onClick={(e) => setExpanded(!expanded)}
    >
      {edit ? (
        <div className="todo-card__inputs">
          <span>
            Title:{' '}
            <input
              ref={inputRef}
              value={editTodoText}
              placeholder="Task's title"
              onChange={(e) => setEditTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit(e, todo.id)}
              className={`todo-card__text ${edit ? '-edit' : ''}`}
            />
          </span>
          <span>
            Note:{' '}
            <input
              ref={inputNoteRef}
              value={editTodoNote}
              placeholder="Task's note"
              onChange={(e) => setEditTodoNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit(e, todo.id)}
              className={`todo-card__note ${edit ? '-edit' : ''}`}
            />
          </span>
        </div>
      ) : todo.isDone ? (
        <div>
          <s className="todo-card__text">{todo.todo}</s>
          {expanded && todo.note && (
            <Fragment>
              <br />
              <s className="todo-card__note">{todo.note}</s>
            </Fragment>
          )}
        </div>
      ) : (
        <div>
          <span className="todo-card__text">{todo.todo}</span>
          {expanded && todo.note && (
            <Fragment>
              <br />
              <span className="todo-card__note">{todo.note}</span>
            </Fragment>
          )}
        </div>
      )}

      <div>
        {!todo.isDone && (
          <span
            className="icon"
            onClick={() => {
              if (!edit) setEdit(!edit);
            }}
          >
            <AiFillEdit />
          </span>
        )}
        <span className="icon" onClick={() => handleDelete(todo.id)}>
          <AiFillDelete />
        </span>
        <span className="icon" onClick={() => handleSwap(todo.id)}>
          <IoSwapHorizontalOutline />
        </span>
      </div>
    </form>
  );
};

export default TodoCard;
