import React, { useRef, useState, useEffect } from 'react';
import { Todo } from '../../model';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { IoSwapHorizontalOutline } from 'react-icons/io5';
import { Draggable } from 'react-beautiful-dnd';
import { firestore } from '../../../utils/firebase';
import { deleteDoc, doc, setDoc } from '@firebase/firestore';

import './TodoCard.scss';

interface Props {
  todo: Todo;
  todos: Todo[];
  otherTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setOtherTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  index: number;
}

const TodoCard: React.FC<Props> = ({
  todo,
  todos,
  otherTodos,
  setTodos,
  setOtherTodos,
  index
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodoText, setEditTodoText] = useState<string>(todo.todo);

  const inputRef = useRef<HTMLInputElement>(null);

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

      await deleteDoc(doc(firestore, 'tasks', id.toString()));
      setDoc(
        doc(firestore, 'tasks', newTodo.id.toString()),
        { isDone: newTodo.isDone, id: newTodo.id, todo: newTodo.todo },
        { merge: true }
      );
    }
  };

  const handleDelete = async (id: number) => {
    await deleteDoc(doc(firestore, 'tasks', id.toString()));
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEdit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, todo: editTodoText } : todo
      )
    );
    setEdit(false);

    setDoc(
      doc(firestore, 'tasks', id.toString()),
      { todo: editTodoText },
      { merge: true }
    );
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <form
          className={`todo-card ${snapshot.isDragging ? 'dragging' : ''}`}
          onSubmit={(e) => handleEdit(e, todo.id)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {edit ? (
            <input
              ref={inputRef}
              value={editTodoText}
              onChange={(e) => setEditTodoText(e.target.value)}
              className="todo-card__text"
            />
          ) : todo.isDone ? (
            <s className="todo-card__text">{todo.todo}</s>
          ) : (
            <span className="todo-card__text">{todo.todo}</span>
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
      )}
    </Draggable>
  );
};

export default TodoCard;
