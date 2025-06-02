import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [cars, setCars] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get("http://localhost:5000/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Xatolik: ", err);
    }
  };

  const resetForm = () => {
    setBrand("");
    setModel("");
    setYear("");
    setImage(null);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brand || !model || !year) {
      alert("Iltimos, barcha maydonlarni to‘ldiring");
      return;
    }

    const formData = new FormData();
    formData.append("brand", brand);
    formData.append("model", model);
    formData.append("year", year);
    if (image) formData.append("image", image);

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/cars/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:5000/cars", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchCars();
      resetForm();
    } catch (err) {
      console.error("Xatolik: ", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Rostdan o'chirmoqchimisiz?")) {
      try {
        await axios.delete(`http://localhost:5000/cars/${id}`);
        fetchCars();
      } catch (err) {
        console.error("Xatolik: ", err);
      }
    }
  };

  const handleEdit = (car) => {
    setBrand(car.brand);
    setModel(car.model);
    setYear(car.year);
    setEditId(car.id);
  };

  return (
    <div className="container">
      <h1>Mashinalar ro'yxati</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Brend"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Yil"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">{editId ? "Tahrirlash" : "Qo'shish"}</button>
        {editId && (
          <button type="button" className="cancel" onClick={resetForm}>
            Bekor qilish
          </button>
        )}
      </form>
      <div>
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            {car.image_url && (
              <img src={car.image_url} alt={car.brand} />
            )}
            <b>{car.brand} {car.model} — {car.year}</b>
            <div>
              <button onClick={() => handleEdit(car)}>Tahrirlash</button>
              <button className="cancel" onClick={() => handleDelete(car.id)}>O'chirish</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;