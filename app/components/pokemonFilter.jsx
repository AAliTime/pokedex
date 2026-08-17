"use client";

export default function TypeFilter({ selectedType, onSelectType }) {

  if (loading) return <p className="text-sm">Cargando tipos...</p>;
  if (error) return null;

  return (
    <div className="my-4 flex items-center gap-2">
      <label htmlFor="type-select" className="font-semibold text-sm">
        Filtrar por Tipo:
      </label>
      <select
        id="type-select"
        value={selectedType}
        onChange={(e) => onSelectType(e.target.value)}
        className="p-2 border rounded bg-white capitalize text-sm"
      >
        <option value="">Todos los tipos</option>
        {data?.results?.map((t) => (
          <option key={t.name} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}