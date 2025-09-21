import { useState } from "react";
import { useNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useNotes(
    debouncedSearchText,
    currentPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchText} onChange={handleSearchChange} />

        {!isLoading && data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </header>

      <main>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading notes.</p>}

        {!isLoading && data && data.notes.length > 0 ? (
          <NoteList notes={data.notes} />
        ) : (
          !isLoading && <p>No notes found.</p>
        )}
      </main>

      <footer>
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </footer>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
