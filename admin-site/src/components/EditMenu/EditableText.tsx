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
  const { editableMenuState, updateField, addTag, setCurrentEditId } =
    useEditableMenu();
  const fieldIdentifier = field !== undefined ? id + field : id;
  const [prevValue, setPrevValue] = useState<typeof children>(children);

  const updateItemTag = (event: any, values: string[]) => {
    addTag(values);
    updateField(id, values, field);
  };
  const updateItem = (text: string | number | string[]) => {
    updateField(id, text, field);
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
    <div className="flex w-full">
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
              onBlur={() => undoChanges()}
              value={children as string | number}
              multiline={field === "description"}
            />
          )}
          <div className="ml-1 grid">
            <CheckIcon
              className={textClass + "h-full w-full"}
              onClick={() => setCurrentEditId("")}
            />
            <ClearIcon
              className={textClass + "h-full w-full"}
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
                      sx={{ backgroundColor: "#505050", color: "#F7F7F7" }}
                    />
                  ))}
                </Stack>
              ) : (
                <Chip
                  key={id}
                  label="Add Tags"
                  variant="filled"
                  sx={{ backgroundColor: "#505050", color: "#F7F7F7" }}
                />
              )}
            </div>
          ) : (
            <p className={textClass} onClick={openForEdit}>
              {children === "" ? "Add " + field : children}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
