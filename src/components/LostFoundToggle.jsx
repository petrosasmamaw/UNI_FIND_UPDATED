"use client";
import React, { useState } from 'react';
import ItemsList from '@/components/ItemsList';
import ItemForm from '@/components/ItemForm';

const CATEGORIES = ['Electronics', 'Documents', 'Clothing', 'Accessories', 'Other'];

export default function LostFoundToggle({ type, userId, formTitle, formIcon }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleFormCreated = () => {
    setShowForm(false);
  };

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Form Section - Collapsible */}
      {showForm && (
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '32px', border: '0.5px solid #ebe9e4', maxWidth: '600px', margin: '0 auto 48px', width: '100%' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
            <span style={{ fontSize: '24px' }}>{formIcon}</span>
            <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1a1a' }}>{formTitle}</h2>
          </div>
          <ItemForm defaultType={type} userId={userId} onCreated={handleFormCreated} />
        </div>
      )}

      {/* Category Filter */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px', fontWeight: '500' }}>Filter by</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '6px 15px',
              borderRadius: '40px',
              border: selectedCategory === null ? 'none' : '0.5px solid #ddd',
              background: selectedCategory === null ? '#0d9e6e' : '#ffffff',
              color: selectedCategory === null ? '#ffffff' : '#777',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== null) e.target.style.background = '#f9f9f9';
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== null) e.target.style.background = '#ffffff';
            }}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 15px',
                borderRadius: '40px',
                border: selectedCategory === cat ? 'none' : '0.5px solid #ddd',
                background: selectedCategory === cat ? '#0d9e6e' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : '#777',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat) e.target.style.background = '#f9f9f9';
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat) e.target.style.background = '#ffffff';
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div>
        <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '16px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {selectedCategory ? `${selectedCategory}` : `All ${type === 'lost' ? 'Lost' : 'Found'} Items`}
        </div>
        <ItemsList type={type} {...(selectedCategory && { category: selectedCategory })} userId={userId} gridLayout={true} />
      </div>
    </div>
  );
}
