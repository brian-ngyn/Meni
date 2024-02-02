import { type ReactNode, useState } from "react";

import { cn } from "~/lib/hooks";

type MeniTextInputProps = {
  id: string;
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
  pattern?: string;
  validate?: {
    required?: boolean;
    pattern?: RegExp;
    errorMessages?: {
      required?: string;
      pattern?: string;
    };
  };
};

export default function MeniTextInput(props: MeniTextInputProps) {
  const {
    id,
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
    pattern,
    validate,
  } = props;

  const [error, setError] = useState("");

  const handleBlur = () => {
    if (validate) {
      const { required, pattern, errorMessages } = validate;
      if (required && !value) {
        setError(errorMessages?.required || "This field is required.");
      } else if (pattern && !pattern.test(value.toString())) {
        setError(errorMessages?.pattern || "Invalid input.");
      } else {
        setError("");
      }
    }
    if (onBlur) onBlur();
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="relative block overflow-hidden bg-grey fill-transparent pt-3 font-sans shadow-sm focus-within:ring-1 focus-within:ring-white hover:cursor-text"
      >
        <input
          type={type ? type : "text"}
          onChange={onChange}
          onBlur={handleBlur}
          autoFocus={autoFocus}
          name={name}
          value={value}
          className={cn(
            "peer w-full border-none bg-grey font-sans placeholder:text-transparent focus:border-transparent focus:outline-none focus:ring-0 xs:pl-3 sm:text-sm md:pl-6 lg:h-9 lg:pl-6",
            {
              "border-red-500": error,
            },
          )}
          id={id}
          placeholder={title}
          pattern={pattern}
          required
        >
          {children}
        </input>
        {title && (
          <span className="absolute -translate-y-1/2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs xs:left-1 xs:top-2 sm:left-2 md:left-2 lg:left-3 lg:top-3">
            {title}
          </span>
        )}
      </label>
      {error && (
        <div className="relative-absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
