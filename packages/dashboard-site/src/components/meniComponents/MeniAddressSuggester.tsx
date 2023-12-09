import { type FocusEvent, type ReactNode, useEffect, useState } from "react";

import LocationOnIcon from "@mui/icons-material/LocationOn";

import { api } from "~/utils/api";

interface Suggestion {
  id: number;
  address: string;
}

interface MeniAddressSuggesterProps {
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
}

export default function MeniAddressSuggester(props: MeniAddressSuggesterProps) {
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

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(
    undefined,
  );

  const {
    data: options,
    refetch: fetchAddressSuggestions,
    isLoading: isLoadingSuggestions,
  } = api.getters.getAddressSuggestions.useQuery(
    {
      address: search,
    },
    { enabled: false },
  );

  useEffect(() => {
    console.log(options);
  }, [options]);

  const loading = isLoadingSuggestions && open && search !== "";

  useEffect(() => {
    if (search !== "") {
      void fetchAddressSuggestions();
    }
  }, [fetchAddressSuggestions, search]);

  const handleSearchChange = (newSearch: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setSearch(newSearch);
    }, 500);
    setTimeoutId(newTimeoutId);
  };

  const [error, setError] = useState("");

  const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
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
  };

  return (
    <div className="flex w-full flex-col ">
      <div className="relative w-full">
        <label
          htmlFor={id}
          className="relative block overflow-hidden bg-grey fill-transparent pt-3 font-sans shadow-sm focus-within:ring-1 focus-within:ring-white hover:cursor-text"
        >
          <input
            type={type ? type : "text"}
            onChange={(e) => {
              onChange(e);
              handleSearchChange(e.target.value);
            }}
            onFocus={() => setOpen(true)}
            onBlur={(e) => {
              setOpen(false);
              handleBlur(e);
            }}
            autoFocus={autoFocus}
            name={name}
            value={value}
            className="peer w-full border-none bg-grey font-sans placeholder:text-transparent focus:border-transparent focus:outline-none focus:ring-0 xs:pl-3 sm:text-sm md:pl-6 lg:h-9 lg:pl-6"
            id={id}
            placeholder={title}
            pattern={pattern}
            required
          >
            {children}
          </input>
          {title ? (
            <span className="absolute -translate-y-1/2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs xs:left-1 xs:top-2 sm:left-2 md:left-2 lg:left-3 lg:top-3">
              {title}
            </span>
          ) : null}
        </label>
        {!loading && options && options.length > 0 && open && (
          <ul className="absolute z-50 mt-1 max-h-[200px] w-full overflow-y-auto rounded-lg border-[1px] bg-grey px-2 py-1 shadow-lg">
            {options.map((option: Suggestion, index: number) => {
              return (
                <li
                  key={index}
                  className="min-h-10 w-full cursor-pointer border-b-[1px] border-solid border-l-gray-300 py-2 last:border-b-0"
                  onMouseDown={() => {
                    const fakeE = {
                      target: {
                        name: "address",
                        value: option.address,
                      },
                    };
                    onChange(fakeE);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <LocationOnIcon /> {option.address}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {loading && (
          <ul className="absolute z-50 mt-1 max-h-[200px] w-full overflow-y-auto rounded-lg border-[1px] bg-grey px-2 py-1 shadow-lg">
            <li className="min-h-10 w-full border-b-[1px] border-solid border-l-gray-300 py-2 last:border-b-0">
              Loading...
            </li>
          </ul>
        )}
        {open && search === "" && (
          <ul className="absolute z-50 mt-1 max-h-[200px] w-full overflow-y-auto rounded-lg border-[1px] bg-grey px-2 py-1 shadow-lg">
            <li className="min-h-10 w-full border-b-[1px] border-solid border-l-gray-300 py-2 last:border-b-0">
              Begin typing to see address suggestions...
            </li>
          </ul>
        )}
      </div>
      {error && (
        <div className="relative-absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
