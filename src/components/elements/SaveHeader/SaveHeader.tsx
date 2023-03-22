import { setDoc, deleteDoc, doc } from '@firebase/firestore';
import React, { useRef, useState, useEffect } from 'react';
import { Todo } from '../../model';
import { firestore } from '../../../utils/firebase';
import './SaveHeader.scss';

interface Props {
  todos: Todo[];
  completedTodos: Todo[];
  todosDeleted: Todo[];
}

// const SaveHeader = ({ todo, setTodo }: Props) => {
const SaveHeader: React.FC<Props> = ({
  todos,
  completedTodos,
  todosDeleted
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [openPasswordInput, setOpenPasswordInput] = useState<boolean>(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);

  useEffect(() => {
    if (openPasswordInput) inputRef.current?.focus();
  }, [openPasswordInput]);

  useEffect(() => {
    if (isPasswordCorrect) setTimeout(() => setIsPasswordCorrect(false), 2400);
  }, [isPasswordCorrect]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (passwordValue === import.meta.env.VITE_SAVE_PASSWORD) {
      // save tasks to firecloud if password is correct
      setIsPasswordCorrect(true);

      for (const todo of [...todos, ...completedTodos]) {
        if (todo.id && todo.id.toString()) {
          setDoc(
            doc(firestore, 'tasks', todo.id.toString()),
            {
              isDone: todo.isDone,
              id: todo.id,
              todo: todo.todo,
              ...(todo.note ? { note: todo.note } : {})
            },
            { merge: true }
          );
        }
      }

      for (const todo of todosDeleted) {
        await deleteDoc(doc(firestore, 'tasks', todo.id.toString()));
      }

      inputRef.current?.blur();
    } else {
      setIsPasswordCorrect(false);
    }

    setPasswordValue('');
    setOpenPasswordInput(false);
  };

  const onClickSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValue) setOpenPasswordInput(!openPasswordInput);
    else onSubmit();
  };

  return (
    <form className="save-header" onSubmit={onSubmit}>
      <input
        ref={inputRef}
        value={passwordValue}
        type="password"
        placeholder={
          passwordValue && isPasswordCorrect
            ? 'Saving changes...'
            : 'Enter the password to save changes.'
        }
        onChange={(e) => setPasswordValue(e.target.value)}
        className={`save-header__input ${openPasswordInput ? '-opened' : ''}`}
      />
      <button type="submit" className="save-header__save" onClick={onClickSave}>
        {!openPasswordInput
          ? isPasswordCorrect
            ? 'Saved'
            : 'Not Saved'
          : 'Save'}
      </button>
    </form>
  );
};

export default SaveHeader;
