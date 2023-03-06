import React, { Fragment } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Todo } from '../../model';
import TodoCard from '../TodoCard/TodoCard';
import './TodosList.scss';

interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  completedTodos: Todo[];
  setCompletedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}
const TodosList: React.FC<Props> = ({
  todos,
  setTodos,
  completedTodos,
  setCompletedTodos
}) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const target = e.target as HTMLDivElement;
    target.style.setProperty('--translate-y', `${target.scrollTop}px`);
  };

  return (
    <div className="container">
      <div className="todos" onScroll={handleScroll}>
        <span className="todos__heading">Active tasks</span>
        <Droppable droppableId="todosList">
          {(provided, snapshot) => (
            <Fragment>
              <div
                className={`todos-list ${
                  snapshot.isDraggingOver ? 'drag-active' : ''
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {todos.map((task, index) => (
                  <TodoCard
                    todo={task}
                    todos={todos}
                    setTodos={setTodos}
                    otherTodos={completedTodos}
                    setOtherTodos={setCompletedTodos}
                    index={index}
                    key={task.id}
                  />
                ))}
                {provided.placeholder}
              </div>
              <div className="overflow"></div>
            </Fragment>
          )}
        </Droppable>
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
        <Droppable droppableId="completedTodosList">
          {(provided) => (
            <Fragment>
              <div
                className={`todos-list snapshot.isDraggingOver ? 'drag-completed' : ''`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {completedTodos.map((task, index) => (
                  <TodoCard
                    todo={task}
                    todos={completedTodos}
                    setTodos={setCompletedTodos}
                    otherTodos={todos}
                    setOtherTodos={setTodos}
                    index={index}
                    key={task.id}
                  />
                ))}
                {provided.placeholder}
              </div>
              <div className="overflow"></div>
            </Fragment>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default TodosList;
