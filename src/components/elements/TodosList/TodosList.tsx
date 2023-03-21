import React, { Fragment } from 'react';
import { Todo } from '../../model';
import TodoCard from '../TodoCard/TodoCard';
import './TodosList.scss';

interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  completedTodos: Todo[];
  setCompletedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todosDeleted: Todo[];
  setTodosDeleted: React.Dispatch<React.SetStateAction<Todo[]>>;
}
const TodosList: React.FC<Props> = ({
  todos,
  setTodos,
  completedTodos,
  setCompletedTodos,
  todosDeleted,
  setTodosDeleted
}) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const target = e.target as HTMLDivElement;
    target.style.setProperty('--translate-y', `${target.scrollTop}px`);
  };

  return (
    <div className="container">
      <div className="todos" onScroll={handleScroll}>
        <span className="todos__heading">Active tasks</span>
        <Fragment>
          <div className="todos-list">
            {todos.map((task, index) => (
              <TodoCard
                todo={task}
                todos={todos}
                setTodos={setTodos}
                otherTodos={completedTodos}
                setOtherTodos={setCompletedTodos}
                todosDeleted={todosDeleted}
                setTodosDeleted={setTodosDeleted}
                index={index}
                key={task.id}
              />
            ))}
          </div>
          <div className="overflow"></div>
        </Fragment>
      </div>
      <div className="spine">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="todos remove" onScroll={handleScroll}>
        <span className="todos__heading">Completed tasks</span>

        <Fragment>
          <div className="todos-list">
            {completedTodos.map((task, index) => (
              <TodoCard
                todo={task}
                todos={completedTodos}
                setTodos={setCompletedTodos}
                otherTodos={todos}
                setOtherTodos={setTodos}
                todosDeleted={todosDeleted}
                setTodosDeleted={setTodosDeleted}
                index={index}
                key={task.id}
              />
            ))}
          </div>
          <div className="overflow"></div>
        </Fragment>
      </div>
    </div>
  );
};

export default TodosList;
