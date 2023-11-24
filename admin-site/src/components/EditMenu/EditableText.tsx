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
  const [value, setValue] = useState<typeof children>(
    field === "tags" ? tags : children,
  );
  const { editableMenuState, updateField, setCurrentEditId } =
    useEditableMenu();
  const fieldIdentifier = field !== undefined ? id + field : id;
  const [prevValue, setPrevValue] = useState<typeof children>(
    field === "tags" ? tags : children,
  );

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
    if (field === "description" || field === "name") {
      updateItem(text.trim());
    } else if (field === "price") {
      const input = text.trim();
      if (input === "" || /[a-zA-Z]/.test(input)) {
        updateItem("0.00");
        setCurrentEditId("");
        return;
      }
      const num = parseFloat(input);
      if (isNaN(num)) {
        updateItem("0.00");
        setCurrentEditId("");
        return;
      }
      const formattedMoney = num.toFixed(2);
      updateItem(formattedMoney);
    }
    setCurrentEditId("");
  };

  const openForEdit = () => {
    setPrevValue(field === "tags" ? tags : children);
    setCurrentEditId(fieldIdentifier);
  };

  const undoChanges = () => {
    updateItem(prevValue as string | number | string[]);
    setCurrentEditId("");
  };
  // Allow keyboard shortcuts to cancel or save changes if on client side
  useEffect(() => {
    const handleEscPress = (keyEvent: KeyboardEvent) => {
      if (
        keyEvent.key === "Escape" &&
        editableMenuState.editingId === fieldIdentifier
      ) {
        undoChanges();
      }
    };
    const handleEnterPress = (keyEvent: KeyboardEvent) => {
      if (
        keyEvent.key === "Enter" &&
        editableMenuState.editingId === fieldIdentifier &&
        field !== "description"
      ) {
        setCurrentEditId("");
      }
    };

    window.addEventListener("keydown", handleEscPress);
    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEscPress);
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [editableMenuState.editingId, fieldIdentifier, setCurrentEditId]);

  return (
    <div className="flex w-full items-center">
      {editableMenuState.editingId === fieldIdentifier ? (
        <>
          {tags !== undefined ? (
            <MeniMultiSelect
              onChange={updateItemTag}
              onBlur={() => setCurrentEditId("")}
              value={tags}
              options={editableMenuState.menu.tags}
            />
          ) : (
            <MeniEditText
              autoFocus
              type={`${field === "price" ? "number" : undefined}`}
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
              onMouseDown={() => setCurrentEditId("")}
            />
            <ClearIcon
              className={textClass + "h-full w-full cursor-pointer"}
              onMouseDown={() => undoChanges()}
            />
          </div>
        </>
      ) : (
        <div className="group inline-flex overflow-scroll border-2 border-dashed border-transparent p-1 hover:cursor-text hover:border-accent">
          {tags !== undefined ? (
            <div onClick={openForEdit}>
              {tags.length > 0 ? (
                <Stack
                  direction="row"
                  spacing={0.5}
                  className="float-left overflow-scroll"
                >
                  {tags.map((item: string, id) => (
                    <Chip
                      key={id}
                      label={item}
                      variant="filled"
                      size="small"
                      className="font-sans"
                      sx={{
                        cursor: "pointer",
                        backgroundColor: "#505050",
                        color: "#F7F7F7",
                        fontFamily: "var(--font-mont);",
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
                  size="small"
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "#505050",
                    color: "#F7F7F7",
                    fontFamily: "var(--font-mont);",
                  }}
                />
              )}
            </div>
          ) : (
            <p className={textClass} onClick={openForEdit}>
              {value === ""
                ? "Add " + field?.charAt(0).toUpperCase() + field?.slice(1)
                : value}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
