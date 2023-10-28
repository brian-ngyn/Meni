import { type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

type MeniEditTextProps = {
  onChange: (e: any) => void;
  onBlur?: (e: any) => void;
  autoFocus?: boolean;
  type?: string;
  name?: string;
  value: string | number;
  className?: string;
  multiline?: boolean;
  title?: string;
  children?: ReactNode;
  field?: string;
};

export default function MeniEditText(props: MeniEditTextProps) {
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
  const id = uuidv4();
  return (
    <div className="h-full w-full">
      {multiline ? (
        <textarea
          onChange={onChange}
          onBlur={onBlur}
          autoFocus={autoFocus}
          name={name}
          value={value}
          className="peer h-24 w-full border-none bg-grey p-2 placeholder:text-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm lg:h-20"
          id={id}
          placeholder={title}
          required
          rows={4}
        >
          {children}
        </textarea>
      ) : (
        <input
          type={`${type ? type : "text"}`}
          inputMode={`${type === "number" ? "decimal" : "text"}`}
          onChange={onChange}
          onBlur={onBlur}
          autoFocus={autoFocus}
          name={name}
          value={value}
          className="peer h-full w-full border-none bg-grey p-2 placeholder:text-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm lg:h-9"
          id={id}
          placeholder={title}
          required
        >
          {children}
        </input>
      )}
    </div>
  );
}
