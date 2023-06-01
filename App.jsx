import React from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { nanoid } from 'nanoid';
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { notesCollection, db } from './firebase';

export default function App() {
  const [notes, setNotes] = React.useState([]);

  const [currentNoteId, setCurrentNoteId] = React.useState('');

  // To be able to use debouncing, we need to use useEffect() on tempNoteText (A copy of the currentNote.body)
  const [tempNoteText, setTempNoteText] = React.useState('');

  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];

  const sortedNotes = notes.toSorted((a, b) => b.updatedAt - a.updatedAt);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      // Sync up our local notes array with the snapshot data

      const newArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));

      setNotes(newArr);

      return unsubscribe;
    });
  }, []);

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  // Sync tempNoteText to currentNote.body (visually)
  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  // Debouncing logic, updateNote() set tempNoteText to the currentNote.body (modified element) syncing both of them (In the notes array and in Firestore)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tempNoteText]);

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  async function updateNote(text) {
    const docRef = doc(db, 'notes', currentNoteId);
    await setDoc(
      docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true }
    );
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, 'notes', noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction='horizontal' className='split'>
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />

          <Editor
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText}
          />
        </Split>
      ) : (
        <div className='no-notes'>
          <h1>You have no notes</h1>
          <button className='first-note' onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
