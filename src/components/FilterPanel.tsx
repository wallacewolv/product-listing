import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { Filters, Category } from "../types";
import "./FilterPanel.css";

interface FilterPanelProps {
  onFilterChange: (filters: Filters) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState<Filters["sortBy"]>("title");
  const [order, setOrder] = useState<Filters["order"]>("asc");

  // Carrega categorias
  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch((err) => {
        console.error("Erro ao carregar categorias:", err);
        setCategories([]);
      });
  }, []);

  // Notifica mudanças
  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      minPrice,
      maxPrice,
      sortBy,
      order,
    });
  }, [selectedCategory, minPrice, maxPrice, sortBy, order, onFilterChange]);

  return (
    <aside className="filter-panel">
      <h2>Filtros</h2>

      {/* Categoria */}
      <div className="filter-group">
        <label>Categoria</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Todas</option>
          {/* ✅ FIX: Usar slug como key e value, name como texto */}
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Preço */}
      <div className="filter-group">
        <label>Preço Mínimo: ${minPrice}</label>
        <input
          type="range"
          min="0"
          max="5000"
          step="50"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
        />
      </div>

      <div className="filter-group">
        <label>Preço Máximo: ${maxPrice}</label>
        <input
          type="range"
          min="0"
          max="10000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </div>

      {/* Ordenação */}
      <div className="filter-group">
        <label>Ordenar por</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as Filters["sortBy"])}
        >
          <option value="title">Nome</option>
          <option value="price">Preço</option>
          <option value="rating">Avaliação</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Ordem</label>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as Filters["order"])}
        >
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>
      </div>

      {/* Reset */}
      <button
        className="reset-button"
        onClick={() => {
          setSelectedCategory("all");
          setMinPrice(0);
          setMaxPrice(10000);
          setSortBy("title");
          setOrder("asc");
        }}
      >
        Limpar Filtros
      </button>
    </aside>
  );
}
