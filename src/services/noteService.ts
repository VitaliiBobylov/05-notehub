import axios, { type AxiosResponse } from "axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type { Note, CreateNotePayload } from "../types/note";
import type { FetchNotesResponse } from "../types/api";

const API_URL = "https://notehub-public.goit.study/api/notes";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export function useNotes(search: string, page: number) {
  return useQuery<FetchNotesResponse>({
    queryKey: ["notes", search, page],
    queryFn: async () => {
      const { data }: AxiosResponse<FetchNotesResponse> =
        await axiosInstance.get("", { params: { search, page, perPage: 12 } });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newNote: CreateNotePayload) =>
      axiosInstance.post<Note>("", newNote).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete<Note>(`/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
