import { useState } from "react";
import { useAsync, useAsyncFn } from "react-use";

import "./styles.css";

export default function App() {
  const [notes, setNotes] = useState([]);

  const { loading, value: customer } = useAsync(async () => {
    const response = await window.fetch("/customer");
    const result = await response.json();
    setNotes(result.notes);
    return result;
  }, []);

  const [_state, updateNote] = useAsyncFn(
    async (noteId: number, customerId: number) => {
      const data = {
        noteId,
        customerId,
        description: "Updated Note"
      };
      const response = await window.fetch("/notes", {
        body: JSON.stringify(data),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      setNotes(result);
      return result;
    }
  );

  return (
    <div className="App">
      {loading ? (
        "Loading..."
      ) : (
        <>
          {notes?.map(({ id, description }: any) => (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <p
                style={{
                  marginRight: "1rem"
                }}
              >
                {description}
              </p>
              <button onClick={() => updateNote(id, customer.id)}>
                Update Note
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
