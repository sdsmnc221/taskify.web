import React from 'react';
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
  return (
    <div className="container">
      <div className="todos">
        <span className="todos__heading">Active tasks</span>
        <Droppable droppableId="todosList">
          {(provided, snapshot) => (
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
      <div className="todos remove">
        <span className="todos__heading">Completed tasks</span>
        <Droppable droppableId="completedTodosList">
          {(provided) => (
            <div
              className={`todos-list snapshot.isDraggingOver ? 'drag-completed' : ''`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {completedTodos.map((task, index) => (
                <TodoCard
                  todo={task}
                  todos={todos}
                  setTodos={setCompletedTodos}
                  otherTodos={todos}
                  setOtherTodos={setTodos}
                  index={index}
                  key={task.id}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default TodosList;
