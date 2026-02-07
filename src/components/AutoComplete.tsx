import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
  useMemo,
  useCallback,
} from "react";
import { api } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";
import "./AutoComplete.css";

interface AutoCompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function AutoComplete({
  value,
  onChange,
  onSelect,
  placeholder = "Buscar produtos...",
}: AutoCompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const debounceOptions = useMemo(() => ({ maxWait: 1000 }), []);

  // ✅ FIX: Função com tipo explícito
  const handleFetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const results = await api.getSearchSuggestions(query);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Erro ao buscar sugestões:", error);
      }
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useDebounce(
    handleFetchSuggestions,
    300,
    debounceOptions,
  );

  useEffect(() => {
    fetchSuggestions.execute(value);
  }, [value, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else if (value.trim()) {
          onSelect(value);
          setIsOpen(false);
        }
        break;

      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    onSelect(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  return (
    <div className="autocomplete">
      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="autocomplete-input"
        />
        {loading && <span className="autocomplete-loading">🔄</span>}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul ref={listRef} className="autocomplete-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={`autocomplete-item ${
                index === selectedIndex ? "selected" : ""
              }`}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
