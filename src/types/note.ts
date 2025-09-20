export interface Note {
  id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  createdAt: string;
  updatedAt: string;
}

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  notes: Note[];
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: Note["tag"];
}
