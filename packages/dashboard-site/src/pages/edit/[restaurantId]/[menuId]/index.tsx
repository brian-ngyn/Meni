import { useRouter } from "next/router";

import { EditableMenuContextProvider } from "~/context/EditableMenuContext";

import EditContainer from "~/components/editMenu/EditContainer";

export default function EditMenu(props: any) {
  const router = useRouter();
  const { restaurantId, menuId } = router.query;

  return (
    <>
      <EditableMenuContextProvider>
        <EditContainer
          menuId={menuId as string}
          restaurantId={restaurantId as string}
        />
      </EditableMenuContextProvider>
    </>
  );
}
