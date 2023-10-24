import { useEffect, useState } from "react";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { Chip, Stack } from "@mui/material";

import { useEditableMenu } from "~/context/EditableMenuContext";

import MeniMultiSelect from "~/components/EditMenu/MeniMultiSelect";
import MeniEditText from "~/components/items/MeniEditText";

type IEditableTextProps = {
  field?: string;
  textClass?: string;
  children?: string | number | string[];
  tags?: string[];
  id: string;
};

export default function EditableText(props: IEditableTextProps) {
  const { children, textClass, id, field, tags } = props;
  const [value, setValue] = useState<typeof children>(children);
  const { editableMenuState, updateField, setCurrentEditId } =
    useEditableMenu();
  const fieldIdentifier = field !== undefined ? id + field : id;
  const [prevValue, setPrevValue] = useState<typeof children>(children);

  const updateItemTag = (event: any, values: string[]) => {
    updateField(id, values, field);
  };
  const updateItem = (text: string | number | string[]) => {
    if (field === "price") {
      if (/[a-zA-Z]/.test(text as string)) {
        return;
      }
    }
    setValue(text);
    updateField(id, text, field);
  };
  const validate = (text: string) => {
    if (field === "price") {
      const input = text.trim();
      if (input === "" || /[a-zA-Z]/.test(input)) {
        updateItem("0.00");
        updateField(id, "0.00", field);
        setCurrentEditId("");
        return;
      }
      const num = parseFloat(input);
      if (isNaN(num)) {
        updateItem("0.00");
        updateField(id, "0.00", field);
        setCurrentEditId("");
        return;
      }
      const formattedMoney = num.toFixed(2);
      updateItem(formattedMoney);
      updateField(id, formattedMoney, field);
    }
    setCurrentEditId("");
  };

  const openForEdit = () => {
    setPrevValue(children);
    setCurrentEditId(fieldIdentifier);
  };

  const undoChanges = () => {
    updateItem(prevValue as string | number | string[]);
    setCurrentEditId("");
  };
  // Allow keyboard shortcuts to cancel or save changes if on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.addEventListener("keydown", (keyEvent) => {
        if (keyEvent.key === "Escape") {
          undoChanges();
        }
      });
      window.document.addEventListener("keydown", (keyEvent) => {
        if (keyEvent.key === "Enter") {
          setCurrentEditId("");
        }
      });
    }
  }, []);

  return (
    <div className="flex w-full items-center">
      {editableMenuState.editingId === fieldIdentifier ? (
        <>
          {tags !== undefined ? (
            <MeniMultiSelect
              onChange={updateItemTag}
              value={tags}
              options={editableMenuState.menu.tags}
            />
          ) : (
            <MeniEditText
              autoFocus
              className={textClass + "truncate text-black"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateItem(e.target.value)
              }
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                validate(e.target.value)
              }
              value={value as string | number}
              multiline={field === "description"}
            />
          )}
          <div className="ml-1 grid">
            <CheckIcon
              className={textClass + "h-full w-full cursor-pointer"}
              onClick={() => setCurrentEditId("")}
            />
            <ClearIcon
              className={textClass + "h-full w-full cursor-pointer"}
              onClick={() => undoChanges()}
            />
          </div>
        </>
      ) : (
        <div className="group inline-flex truncate border-2 border-dashed border-transparent p-1 hover:cursor-text hover:border-accent">
          {tags !== undefined ? (
            <div onClick={openForEdit}>
              {tags.length > 0 ? (
                <Stack direction="row" spacing={1} className="float-left">
                  {tags.map((item: string, id) => (
                    <Chip
                      key={id}
                      label={item}
                      variant="filled"
                      sx={{
                        cursor: "pointer",
                        backgroundColor: "#505050",
                        color: "#F7F7F7",
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                <Chip
                  key={id}
                  className="cursor-pointer"
                  label="Add Tags"
                  variant="filled"
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "#505050",
                    color: "#F7F7F7",
                  }}
                />
              )}
            </div>
          ) : (
            <p className={textClass} onClick={openForEdit}>
              {value === "" ? "Add " + field : value}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
