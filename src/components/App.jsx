import React, { useEffect, useState } from "react";
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const API_URL = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  // GET /toys (on page load)
  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((toyArray) => setToys(toyArray));
  }, []);

  // POST /toys (create)
  function handleCreateToy(formData) {
    const newToy = {
      name: formData.name,
      image: formData.image,
      likes: 0, // required by lab
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newToy),
    })
      .then((r) => r.json())
      .then((createdToy) => setToys((prev) => [...prev, createdToy]));
  }

  // DELETE /toys/:id (donate)
  function handleDonateToy(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setToys((prev) => prev.filter((toy) => toy.id !== id));
      }
    });
  }

  // PATCH /toys/:id (like)
  function handleLikeToy(id) {
    const toyToLike = toys.find((t) => t.id === id);
    if (!toyToLike) return;

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: toyToLike.likes + 1 }),
    })
      .then((r) => r.json())
      .then((updatedToy) => {
        // maintain order by mapping, not sorting
        setToys((prev) =>
          prev.map((toy) => (toy.id === updatedToy.id ? updatedToy : toy))
        );
      });
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onCreateToy={handleCreateToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onLike={handleLikeToy} onDonate={handleDonateToy} />
    </>
  );
}

export default App;