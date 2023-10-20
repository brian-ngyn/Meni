import * as React from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { useEditableMenu } from "~/context/EditableMenuContext";

type IMeniMultiSelect = {
  value: string[];
  onChange: (e: any, values: any) => void;
  options: string[];
};
export default function MeniMultiSelect(props: IMeniMultiSelect) {
  const { value, onChange, options } = props;

  return (
    <Stack spacing={3} className="w-full">
      <Autocomplete
        fullWidth
        multiple
        freeSolo
        id="tags-filled"
        options={options}
        value={value}
        onChange={onChange}
        getOptionLabel={(value) => value}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              sx={{ color: "#F7F7F7", backgroundColor: "#505050" }}
              variant="filled"
              label={option}
              {...getTagProps({ index })}
              key={index}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Tags"
            sx={{
              "& fieldset.MuiOutlinedInput-notchedOutline": {
                borderColor: "#505050",
              },
              "& .MuiOutlinedInput-root": {
                color: "#f7f7f7",
                "&:hover fieldset": {
                  borderColor: "#707070",
                },
              },
            }}
          />
        )}
        PaperComponent={({ children }) => (
          <Paper
            sx={{
              marginTop: "8px",
              backgroundColor: "#282828",
              color: "#f7f7f7",
              borderRadius: "4px",
              "& .MuiAutocomplete-option": {
                color: "#f7f7f7",
                '&[aria-selected="true"]': {
                  backgroundColor: "#353535",
                  "&:hover": {
                    backgroundColor: "#303030",
                  },
                },
                "&:hover": {
                  backgroundColor: "#505050",
                },
              },
            }}
          >
            {children}
          </Paper>
        )}
      />
    </Stack>
  );
}
