import React, { useRef, useState, useEffect } from 'react';
import { Todo } from '../../model';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { MdDone } from 'react-icons/md';
import { Draggable } from 'react-beautiful-dnd';

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

  const handleDone = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );

    const todo: Todo | undefined = todos.find((todo) => todo.id === id);
    if (todo) setOtherTodos([...otherTodos, todo]);
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, todo: editTodoText } : todo
      )
    );
    setEdit(false);
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
            <span
              className="icon"
              onClick={() => {
                if (!edit && !todo.isDone) setEdit(!edit);
              }}
            >
              <AiFillEdit />
            </span>
            <span className="icon" onClick={() => handleDelete(todo.id)}>
              <AiFillDelete />
            </span>
            <span className="icon" onClick={() => handleDone(todo.id)}>
              <MdDone />
            </span>
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default TodoCard;
