import { useState, useEffect } from 'react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

export default function ProjectFilters({
  onSearchChange,
  onStatusChange,
  onSortChange,
  initialSearch = '',
  initialStatus = 'active',
  initialSort = 'created_at'
}) {
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [sort, setSort] = useState(initialSort)

  // Debounce search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search, onSearchChange])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleStatusChange = (e) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    onStatusChange(newStatus)
  }

  const handleSortChange = (e) => {
    const newSort = e.target.value
    setSort(newSort)
    onSortChange(newSort)
  }

  return (
    <div className="mb-8 space-y-4" data-testid="project-filters">
      {/* Search Bar */}
      <Input
        type="search"
        placeholder="Rechercher un projet par titre ou description..."
        value={search}
        onChange={handleSearchChange}
        data-testid="search-input"
      />

      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Statut"
            value={status}
            onChange={handleStatusChange}
            data-testid="status-filter"
          >
            <option value="all">Tous les projets</option>
            <option value="active">Actifs</option>
            <option value="completed">Terminés</option>
            <option value="failed">Échoués</option>
            <option value="draft">Brouillons</option>
          </Select>
        </div>

        {/* Sort Options */}
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Trier par"
            value={sort}
            onChange={handleSortChange}
            data-testid="sort-select"
          >
            <option value="created_at">Plus récents</option>
            <option value="created_at_asc">Plus anciens</option>
            <option value="goal_amount_asc">Budget (croissant)</option>
            <option value="goal_amount_desc">Budget (décroissant)</option>
            <option value="deadline_asc">Date limite (proche)</option>
            <option value="deadline_desc">Date limite (lointaine)</option>
          </Select>
        </div>
      </div>
    </div>
  )
}
