import { debounce } from "lodash";
import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";

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
            onBlur={() => setOpen(false)}
            autoFocus={autoFocus}
            name={name}
            value={value}
            className={`peer w-full border-none bg-grey font-sans placeholder:text-transparent focus:border-transparent focus:outline-none focus:ring-0 xs:pl-3 sm:text-sm md:pl-6 lg:h-9 lg:pl-6`}
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
        {!isLoadingSuggestions && options && options.length > 0 && open && (
          <ul className="absolute z-50 mt-2 max-h-[200px] w-full overflow-y-auto rounded-lg border-[1px] bg-grey p-2 shadow-lg">
            {options.map((option: Suggestion, index: number) => {
              if (index === options.length - 1) {
                return (
                  <li
                    key={index}
                    className="min-h-10 w-full cursor-pointer border-solid border-l-gray-300 py-2"
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
                    📍 {option.address}
                  </li>
                );
              }
              return (
                <li
                  key={index}
                  className="min-h-10 z-50 w-full cursor-pointer border-b-[1px] border-solid border-l-gray-300 py-2"
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
                  📍 {option.address}
                </li>
              );
            })}
          </ul>
        )}
        {isLoadingSuggestions && open && search !== "" && (
          <ul className="absolute z-50 mt-2 max-h-[200px] w-full overflow-y-auto rounded-lg border-[1px] bg-grey p-2 shadow-lg">
            <li className="min-h-10 w-full cursor-pointer border-solid border-l-gray-300 py-2">
              Loading...
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
