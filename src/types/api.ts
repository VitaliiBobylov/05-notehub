import type { Note } from "./note";

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  notes: Note[];
}
