import { useMemo } from "react";
import { applyAdminData, baseCategories } from "../fandom/catalog";
import { useAdminData } from "./adminStore";

/* The catalog exactly as the admin sees it: live edits, custom items and hidden items included. */
export default function useAdminCatalog() {
  const adminData = useAdminData();
  return useMemo(() => {
    const categories = applyAdminData(baseCategories, adminData);
    return { adminData, categories, items: categories.flatMap((category) => category.items) };
  }, [adminData]);
}
