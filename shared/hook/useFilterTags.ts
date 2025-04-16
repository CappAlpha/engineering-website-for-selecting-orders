import { Api } from "../../services/api-client";
import { useEffect, useState } from "react";
import { Tag } from "@prisma/client";
import { useSet } from "./useSet";

interface ReturnProps {
  items: Tag[];
  loading: boolean;
  selectedIds: Set<string>;
  onAddId: (id: string) => void;
}

export const useFilterTags = (): ReturnProps => {
  const [items, setItems] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, { toggle }] = useSet<string>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await Api.tags.getAll();
        setItems(response);
      } catch (error) {
        console.error("Ошибка при запросе тегов:", error);
        setItems([]);
      }
      finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { items, loading, onAddId: toggle, selectedIds };
};
