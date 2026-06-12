import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaUsers } from 'react-icons/fa';
import './DeveloperMultiFilter.css';

function DeveloperMultiFilter({
  options = [],
  selectedIds = [],
  onChange,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const selectedSet = new Set(selectedIds.map(String));
  const allSelected = options.length > 0 && selectedIds.length === options.length;
  const noneSelected = selectedIds.length === 0;
  const isFiltered = !allSelected && !noneSelected;

  useEffect(() => {
    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  function toggleMember(id) {
    const key = String(id);
    if (selectedSet.has(key)) {
      onChange(selectedIds.filter((value) => String(value) !== key));
      return;
    }
    onChange([...selectedIds, key]);
  }

  function selectAll() {
    onChange(options.map((member) => String(member.id)));
  }

  function clearAll() {
    onChange([]);
  }

  function getTriggerLabel() {
    if (noneSelected || allSelected) {
      return `All pod (${options.length})`;
    }
    if (selectedIds.length === 1) {
      const member = options.find((m) => String(m.id) === selectedIds[0]);
      return member?.name ?? '1 developer';
    }
    return `${selectedIds.length} developers`;
  }

  return (
    <div className="dev-multi-filter" ref={rootRef}>
      <p className="analytics-filter-label">Developers</p>
      <button
        type="button"
        className={`dev-multi-filter__trigger${isFiltered ? ' dev-multi-filter__trigger--active' : ''}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
      >
        <FaUsers size={12} aria-hidden="true" />
        <span>{getTriggerLabel()}</span>
        <FaChevronDown
          size={10}
          className={`dev-multi-filter__chevron${isOpen ? ' dev-multi-filter__chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && !disabled && (
        <div className="dev-multi-filter__panel" role="listbox" aria-multiselectable="true">
          <div className="dev-multi-filter__actions">
            <button type="button" className="dev-multi-filter__action" onClick={selectAll}>
              Select all
            </button>
            <button type="button" className="dev-multi-filter__action" onClick={clearAll}>
              Clear
            </button>
          </div>
          <ul className="dev-multi-filter__list">
            {options.map((member) => {
              const id = String(member.id);
              const checked = selectedSet.has(id);
              return (
                <li key={member.id}>
                  <label className="dev-multi-filter__option">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMember(member.id)}
                    />
                    <span className="dev-multi-filter__check" aria-hidden="true" />
                    <span className="dev-multi-filter__name">{member.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DeveloperMultiFilter;
