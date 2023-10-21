import { useRouter } from "next/router";
import { useState } from "react";

import {
  EditableMenuContextProvider,
  useEditableMenu,
} from "~/context/EditableMenuContext";
import { useMeniContext } from "~/context/meniContext";

import EditContainer from "~/components/EditMenu/EditContainer";

export default function EditMenu(props: any) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <EditableMenuContextProvider>
        <EditContainer menuId={id as string} />
      </EditableMenuContextProvider>
    </>
  );
}
