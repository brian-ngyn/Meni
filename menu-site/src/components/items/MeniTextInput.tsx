import { type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

type MeniTextInputProps = {
  onChange: (e: any) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  type?: string;
  name?: string;
  value: string | number;
  className?: string;
  multiline?: boolean;
  title?: string;
  children?: ReactNode;
};

export default function MeniTextInput(props: MeniTextInputProps) {
  const {
    onChange,
    onBlur,
    autoFocus,
    value,
    className,
    multiline,
    title,
    name,
    type,
    children,
  } = props;
  const id: string = uuidv4();
  return (
    <label
      htmlFor={id}
      className="bg-grey relative block overflow-hidden fill-transparent pt-3 font-sans shadow-sm focus-within:ring-1 focus-within:ring-white hover:cursor-text"
    >
      <input
        type={type ? type : "text"}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus={autoFocus}
        name={name}
        value={value}
        className="bg-grey peer w-full border-none p-0 font-sans placeholder:text-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm lg:h-9 lg:pl-6"
        id={id}
        placeholder={title}
        required
      >
        {children}
      </input>
      {title ? (
        <span className="xs:left-1 xs:top-2 absolute -translate-y-1/2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs sm:left-2 md:left-2 lg:left-3 lg:top-3">
          {title}
        </span>
      ) : null}
    </label>
  );
}
