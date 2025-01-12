import { Chip, Stack } from "@mui/material";

import { cn } from "~/lib/hooks";

type IMenuTextFieldProps = {
  field?: string;
  textClass?: string;
  children?: string | number | string[];
  tags?: string[];
  id: string;
};
export function MenuTextField(props: IMenuTextFieldProps) {
  const { field, children, textClass, tags } = props;

  return (
    <div className="flex w-full">
      <div
        className={cn("group inline-flex border-transparent p-1", {
          "w-full": field === "menuFooter",
        })}
      >
        {tags !== undefined ? (
          <div>
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
            ) : null}
          </div>
        ) : (
          <p className={textClass}>{children}</p>
        )}
      </div>
    </div>
  );
}
