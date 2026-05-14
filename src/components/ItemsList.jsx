"use client";
import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchItems, updateItemStatus } from '@/store/itemsSlice';
import { fetchChatsByItem, fetchChatCounts, createChatRoom, setSelectedItem } from '@/store/chatsSlice';
import { setUserId, openChatModal, setTogglingStatus, clearTogglingStatus, setCreatingRoom, clearCreatingRoom } from '@/store/uiSlice';
import ItemChatsModal from './ItemChatsModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ItemsList({ type, category, userId: propUserId, gridLayout = false, isDashboard = false }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const lastFetchKeyRef = useRef('');

  // Redux selectors
  const { items, status, error } = useSelector((s) => s.items);
  const { userId, chatModalOpen, selectedItemForChats, togglingStatus, creatingRoom } = useSelector((s) => s.ui);
  const { chatCounts, newRoom } = useSelector((s) => s.chats);

  const fetchParams = useMemo(() => {
    const params = {};

    if (type) params.type = type;
    if (category) params.category = category;
    if (!type && !category && userId) params.userId = userId;

    return params;
  }, [type, category, userId]);

  const fetchKey = useMemo(() => JSON.stringify(fetchParams), [fetchParams]);

  // Initialize user ID
  useEffect(() => {
    if (propUserId) {
      dispatch(setUserId(propUserId));
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/get-session');
        if (res.ok && mounted) {
          const data = await res.json();
          dispatch(setUserId(data?.user?.id || null));
        }
      } catch (err) {
        console.error('Failed to get session:', err);
        if (mounted) dispatch(setUserId(null));
      }
    })();
    return () => { mounted = false; };
  }, [propUserId, dispatch]);

  // Fetch items
  useEffect(() => {
    if (!fetchKey || lastFetchKeyRef.current === fetchKey) return;

    lastFetchKeyRef.current = fetchKey;
    dispatch(fetchItems(fetchParams));
  }, [dispatch, fetchKey, fetchParams]);

  // Fetch chat counts for dashboard items
  useEffect(() => {
    if (isDashboard && items.length > 0 && userId) {
      dispatch(fetchChatCounts({ items, userId }));
    }
  }, [isDashboard, items, userId, dispatch]);

  // Handle room creation and navigation
  useEffect(() => {
    if (newRoom && creatingRoom) {
      router.push(`/chat/${newRoom._id}`);
      dispatch(clearCreatingRoom());
    }
  }, [newRoom, creatingRoom, dispatch, router]);

  // Handlers
  const handleMessageClick = (item) => {
    if (!userId) {
      alert('Please log in to message');
      return;
    }
    if (item.userId === userId) {
      alert('You cannot message yourself');
      return;
    }
    dispatch(setCreatingRoom(item._id));
    dispatch(createChatRoom({ itemId: item._id, userId }));
  };

  const handleToggleStatus = (item) => {
    if (!userId || item.userId !== userId) {
      alert('Unauthorized: Only item creator can update status');
      return;
    }
    dispatch(setTogglingStatus(item._id));
    const newStatus = item.status === 'not-delivered' ? 'delivered' : 'not-delivered';
    dispatch(updateItemStatus({ itemId: item._id, userId, status: newStatus })).then(() => {
      dispatch(clearTogglingStatus());
      dispatch(fetchItems({
        ...(type && { type }),
        ...(category && { category }),
        ...(userId && { userId })
      }));
    });
  };

  const handleViewChats = (item) => {
    if (!userId || item.userId !== userId) {
      alert('Unauthorized: Only item creator can view chats');
      return;
    }
    dispatch(setSelectedItem(item._id));
    dispatch(fetchChatsByItem({ itemId: item._id, userId }));
    dispatch(openChatModal(item));
  };

  const getStatusBadge = (itemStatus) => {
    if (itemStatus === 'delivered') {
      return (
        <span style={{
          fontSize: '11px',
          fontWeight: '500',
          borderRadius: '20px',
          padding: '3px 9px',
          background: '#eff6ff',
          color: '#1d4ed8',
          border: '0.5px solid #bfdbfe'
        }}>
          ✓ Delivered
        </span>
      );
    }
    return (
      <span style={{
        fontSize: '11px',
        fontWeight: '500',
        borderRadius: '20px',
        padding: '3px 9px',
        background: '#fffbeb',
        color: '#b45309',
        border: '0.5px solid #fde68a'
      }}>
        ⏳ Still waiting
      </span>
    );
  };

  if (status === 'loading') return <div className="p-8 text-center text-slate-400"><div className="inline-block animate-spin">⏳</div> Loading items...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium">Error: {error}</div>;

  const containerClass = gridLayout
    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
    : "space-y-4";

  return (
    <>
      <div className={containerClass}>
        {items.length === 0 && <div className="text-center p-12 text-slate-400 text-sm col-span-full">No items found yet.</div>}
        {items.map((it) => (
          <article key={it._id || it.id} style={{ background: '#ffffff', borderRadius: '18px', padding: '18px', border: '0.5px solid #ebe9e4', display: 'flex', gap: '16px', alignItems: 'flex-start', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#b8e4d3'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ebe9e4'}>
            <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#f0efe9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {it.imageUrl ? (
                <img
                  src={it.imageUrl}
                  alt={it.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-5xl">📦</div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</h3>
                  <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '4px' }}>{it.category || 'General'}</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    borderRadius: '20px',
                    padding: '3px 9px',
                    whiteSpace: 'nowrap',
                    ...(it.type === 'lost' ? { background: '#fef2f2', color: '#c0392b', border: '0.5px solid #fad5d5' } : { background: '#e8f8f2', color: '#0d7a56', border: '0.5px solid #b8e4d3' })
                  }}>
                    {it.type === 'lost' ? 'Lost' : 'Found'}
                  </span>
                  {getStatusBadge(it.status || 'not-delivered')}
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.description || 'No description'}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: '#aaa', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📍 {it.location || 'Unknown location'}</span>
                <span style={{ color: '#ddd' }}>•</span>
                <span>{new Date(it.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {isDashboard && it.userId === userId ? (
                  <>
                    <button
                      onClick={() => handleToggleStatus(it)}
                      disabled={togglingStatus === it._id}
                      style={{
                        padding: '7px 15px',
                        fontSize: '12px',
                        fontWeight: '500',
                        borderRadius: '20px',
                        background: togglingStatus === it._id ? '#ddd' : '#0d9e6e',
                        color: '#fff',
                        border: 'none',
                        cursor: togglingStatus === it._id ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => !togglingStatus && (e.target.style.background = '#0a8456')}
                      onMouseLeave={(e) => !togglingStatus && (e.target.style.background = '#0d9e6e')}
                    >
                      {togglingStatus === it._id
                        ? 'Updating...'
                        : it.status === 'delivered'
                          ? 'Mark as waiting'
                          : 'Mark as delivered'}
                    </button>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => handleViewChats(it)}
                        style={{
                          padding: '7px 15px',
                          fontSize: '12px',
                          fontWeight: '500',
                          borderRadius: '20px',
                          background: '#0d9e6e',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          gap: '6px',
                          alignItems: 'center'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#0a8456'}
                        onMouseLeave={(e) => e.target.style.background = '#0d9e6e'}
                      >
                        💬 View Chats
                      </button>
                      {chatCounts[it._id] > 0 && (
                        <span style={{ position: 'absolute', top: '-8px', right: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', fontSize: '11px', fontWeight: '700', color: '#fff', background: '#ef4444', borderRadius: '50%' }}>
                          {chatCounts[it._id]}
                        </span>
                      )}
                    </div>
                  </>
                ) : it.userId !== userId ? (
                  <button
                    onClick={() => handleMessageClick(it)}
                    disabled={creatingRoom === it._id}
                    style={{
                      padding: '7px 15px',
                      fontSize: '12px',
                      fontWeight: '500',
                      borderRadius: '20px',
                      background: creatingRoom === it._id ? '#ddd' : '#e8f8f2',
                      color: creatingRoom === it._id ? '#999' : '#0d7a56',
                      border: '0.5px solid #b8e4d3',
                      cursor: creatingRoom === it._id ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => !creatingRoom && (e.target.style.background = '#d0f0eb')}
                    onMouseLeave={(e) => !creatingRoom && (e.target.style.background = '#e8f8f2')}
                  >
                    💬 {creatingRoom === it._id ? 'Opening chat...' : 'Message'}
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
      {selectedItemForChats && (
        <ItemChatsModal
          isOpen={chatModalOpen}
          itemId={selectedItemForChats._id}
          userId={userId}
          itemTitle={selectedItemForChats.title}
        />
      )}
    </>
  );
}

