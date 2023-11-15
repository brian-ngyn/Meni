import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";

import { api } from "~/utils/api";

interface Suggestion {
  id: number;
  address: string;
}

export default function MeniAddressSuggester() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      debounceSearch.cancel();
    };
  });

  const onSearchChange = (newInputValue: string) => {
    setSearch(newInputValue);
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const debounceSearch = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return debounce(onSearchChange, 500);
  }, []);

  return (
    <Autocomplete
      id="address-autocomplete"
      filterOptions={(x) => x}
      sx={{ width: "100%" }}
      onChange={(event: any, newValue: Suggestion | null) => {
        console.log(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        if (newInputValue) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          debounceSearch(newInputValue);
        }
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.address === value.address}
      getOptionLabel={(option) => option.address}
      options={options ? (options as readonly Suggestion[]) : []}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Address"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
