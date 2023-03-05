import React, { useRef } from 'react';
import './InputField.scss';

interface Props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAddTask: (e: React.FormEvent) => void;
}

// const InputField = ({ todo, setTodo }: Props) => {
const InputField: React.FC<Props> = ({ todo, setTodo, handleAddTask }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="input-field"
      onSubmit={(e) => {
        handleAddTask(e);
        inputRef.current?.blur();
      }}
    >
      <input
        ref={inputRef}
        type="input"
        placeholder="Enter a task..."
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        onBlur={() => setTodo('')}
        className="input-field__box"
      />
    </form>
  );
};

export default InputField;
