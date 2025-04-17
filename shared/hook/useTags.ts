import { Api } from "../services/api-client";
import { useEffect, useState } from "react";
import { useSet } from "./useSet";

interface ReturnProps {
  items: string[];
  loading: boolean;
  selected: Set<string>;
  onAdd: (id: string) => void;
}

export const useTags = (): ReturnProps => {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, { toggle }] = useSet<string>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await Api.tags.getAll();
        setItems(response);
      } catch (error) {
        console.error("Ошибка при запросе тегов:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { items, loading, onAdd: toggle, selected };
};
