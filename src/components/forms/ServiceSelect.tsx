import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown } from 'lucide-react';
import { predefinedServices } from '../../data/services';
import type { PredefinedService, Gender } from '../../data/services';

interface ServiceSelectProps {
  gender: Gender;
  value: string;
  onChange: (serviceName: string, price: number) => void;
}

export const ServiceSelect: React.FC<ServiceSelectProps> = ({ gender, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        const portal = document.getElementById('service-select-portal');
        if (portal && portal.contains(e.target as Node)) return;
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openDropdown = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropH = 320;
    const showAbove = spaceBelow < dropH + 8 && rect.top > dropH;
    setDropdownStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(showAbove
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
    setIsOpen(true);
  };

  const [selectedGender, setSelectedGender] = useState<Gender>(gender);

  useEffect(() => { setSelectedGender(gender); }, [gender]);

  const filteredServices = predefinedServices.filter(s =>
    s.gender === selectedGender &&
    (!searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedServices = filteredServices.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {} as Record<string, PredefinedService[]>);

  const handleSelect = (service: PredefinedService) => {
    onChange(service.name, service.price);
    setSearchTerm('');
    setIsOpen(false);
  };

  const dropdown = isOpen && createPortal(
    <div id="service-select-portal" style={{
      ...dropdownStyle,
      background: 'var(--surface-color)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      maxHeight: '320px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'fadeIn 0.15s ease',
    }}>
      <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)' }}>
        <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          autoFocus
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.83rem', color: 'var(--text-primary)', fontFamily: 'var(--font-family)' }}
        />
        <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
          {(['Male', 'Female'] as Gender[]).map(g => (
            <button key={g} onMouseDown={e => { e.preventDefault(); setSelectedGender(g); }} style={{
              padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font-family)', transition: 'all 0.15s',
              border: `1.5px solid ${selectedGender === g ? (g === 'Male' ? 'var(--primary)' : 'var(--secondary)') : 'var(--border-color)'}`,
              background: selectedGender === g ? (g === 'Male' ? 'var(--primary)' : 'var(--secondary)') : 'transparent',
              color: selectedGender === g ? 'white' : 'var(--text-tertiary)',
            }}>{g}</button>
          ))}
        </div>
      </div>
      <div style={{ overflowY: 'auto', flex: 1, padding: '0.4rem 0' }}>
        {Object.keys(groupedServices).length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.83rem' }}>No services found.</div>
        ) : (
          Object.entries(groupedServices).map(([category, svcs]) => (
            <div key={category}>
              <div style={{ padding: '0.35rem 0.9rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {category}
              </div>
              {svcs.map(svc => (
                <div key={svc.id} onMouseDown={() => handleSelect(svc)} style={{ padding: '0.55rem 0.9rem', cursor: 'pointer', fontSize: '0.83rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontWeight: 500 }}>{svc.name}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>₹{svc.price}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>,
    document.body
  );

  return (
    <div ref={triggerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        className="form-control"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderColor: isOpen ? 'var(--primary)' : 'var(--border-color)', boxShadow: isOpen ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none', userSelect: 'none' }}
        onClick={() => isOpen ? setIsOpen(false) : openDropdown()}
      >
        <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: value ? 500 : 400, fontSize: '0.85rem' }}>
          {value || 'Select a service'}
        </span>
        <ChevronDown size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>
      {dropdown}
    </div>
  );
};
