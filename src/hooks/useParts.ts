import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  query,
  limit,
  startAfter,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Parts } from "@/types/parts";
import { DocumentSnapshot } from "firebase/firestore";

export const useParts = (pageSize: number = 12) => {
  const [parts, setParts] = useState<Parts[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [loadingPartById, setLoadingPartById] = useState(false);
  const partCache = useRef<Map<string, Parts>>(new Map());

  const colRef = collection(db, "parts");
  // ✅ First page
  const fetchParts = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(colRef, orderBy("createdAt", "desc"), limit(pageSize));
      const snapshot = await getDocs(q);

      const list: Parts[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Parts, "id">),
      }));

      // warm cache
      list.forEach((p) => {
        if (p.id) partCache.current.set(p.id, p);
      });

      setParts(list);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === pageSize);
    } catch (err: unknown) {
      console.error("❌ Error fetching parts:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [pageSize, colRef]);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  const fetchMore = async () => {
    if (!lastDoc) return;
    try {
      setLoadingMore(true);
      const q = query(
        colRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
      const snapshot = await getDocs(q);

      const more: Parts[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Parts, "id">),
      }));

      more.forEach((p) => {
        if (p.id) partCache.current.set(p.id, p);
      });

      setParts((prev) => [...prev, ...more]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === pageSize);
    } catch (err) {
      console.error("❌ Error fetching more parts:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // ✅ Add
  const addPart = async (
    part: Omit<Parts, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setSaving(true);
      await addDoc(colRef, {
        ...part,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await fetchParts();
    } catch (err) {
      console.error("❌ Error adding part:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Update
  const updatePart = async (id: string, updatedData: Partial<Parts>) => {
    try {
      setSaving(true);
      await updateDoc(doc(db, "parts", id), {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });
      setParts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
      );
      const cached = partCache.current.get(id);
      if (cached) {
        partCache.current.set(id, { ...cached, ...updatedData });
      }
    } catch (err) {
      console.error("❌ Error updating part:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete (+ optional cloudinary)
  const deletePart = async (id: string, publicIds?: string[]) => {
    try {
      setSaving(true);
      if (publicIds?.length) {
        await Promise.all(
          publicIds.map((pid) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/cloudinary-delete`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ public_id: pid }),
            })
          )
        );
      }
      await deleteDoc(doc(db, "parts", id));
      partCache.current.delete(id);
      setParts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("❌ Error deleting part:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Get by id (with cache)
  const getPartById = useCallback(async (id: string): Promise<Parts | null> => {
    try {
      setLoadingPartById(true);
      const cached = partCache.current.get(id);
      if (cached) return cached;

      const snap = await getDoc(doc(db, "parts", id));
      if (!snap.exists()) return null;

      const part: Parts = {
        id: snap.id,
        ...(snap.data() as Omit<Parts, "id">),
      };
      partCache.current.set(id, part);
      return part;
    } catch (err) {
      console.error("❌ Error fetching part by id:", err);
      return null;
    } finally {
      setLoadingPartById(false);
    }
  }, []);

  return {
    parts,
    loading,
    saving,
    error,
    fetchParts,
    fetchMore,
    loadingMore,
    hasMore,
    addPart,
    updatePart,
    deletePart,

    // single
    getPartById,
    loadingPartById,
  };
};
