import axios, { type AxiosResponse } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import type { Note, FetchNotesResponse, CreateNotePayload } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string
): Promise<FetchNotesResponse> => {
  try {
    const res: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
      params: { page, perPage, search },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch notes");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createNoteTask = async (payload: CreateNotePayload): Promise<Note> => {
  try {
    const res: AxiosResponse<Note> = await api.post("/notes", payload);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create note");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete note");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const useNotes = (search: string, page: number, perPage = 12) => {
  const [debouncedSearch] = useDebounce(search, 500);

  return useQuery<FetchNotesResponse>({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newNote: CreateNotePayload) => createNoteTask(newNote),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
};