import { type Note } from "../../types/note";
import { useDeleteNote } from "../../services/noteService";
import { useQueryClient } from "@tanstack/react-query";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const deleteNoteMutation = useDeleteNote();

  const handleDelete = (id: string) => {
    deleteNoteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      },
      onError: (error) => {
        console.error("Error deleting note:", error);
      },
    });
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
