import React, { useRef, useState, useEffect } from 'react';
import './SaveHeader.scss';

// const SaveHeader = ({ todo, setTodo }: Props) => {
const SaveHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [openPasswordInput, setOpenPasswordInput] = useState<boolean>(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);

  useEffect(() => {
    if (openPasswordInput) inputRef.current?.focus();
  }, [openPasswordInput]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (passwordValue === import.meta.env.VITE_SAVE_PASSWORD) {
      // Todo: save tasks to firecloud
      setIsPasswordCorrect(true);

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
        Save
      </button>
    </form>
  );
};

export default SaveHeader;
