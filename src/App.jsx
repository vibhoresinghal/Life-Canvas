import { useState, useEffect, useRef, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Plus, Square, Type, Image as ImageIcon, X } from 'lucide-react';
import Item from './components/Item';
import Modal from './components/Modal';

function App() {
    const [items, setItems] = useState([]);
    const [activeView, setActiveView] = useState('today');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Dragging state to distinguish click vs drag
    const isDragging = useRef(false);

    const SECTIONS = [
        { id: 'today', label: 'Today' },
        { id: 'month', label: 'This Month' },
        { id: 'year', label: 'This Year' },
        { id: 'life', label: 'This Life' },
        { id: 'past', label: 'Past' },
    ];

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('lifeCanvasItems');
        if (saved) {
            setItems(JSON.parse(saved));
        } else {
            // Initial demo data
            setItems([
                { id: 1, type: 'sticky', content: 'Singapore Fuji-Film Recepie\n\nClassic Chrome\nDynamic Range: DR400\nHighlight: -1\nShadow: -1\nColor: +2', color: 'yellow', tags: ['photo', 'recipe'], emoji: '📸', createdAt: new Date().toISOString(), x: 100, y: 100 },
                { id: 2, type: 'photo', content: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', tags: ['camera'], emoji: '🎞️', createdAt: new Date().toISOString(), x: 400, y: 150 },
                { id: 3, type: 'sticky', content: 'Remember to buy film rolls for the trip!', color: 'pink', tags: ['todo'], emoji: '✈️', createdAt: new Date().toISOString(), x: 700, y: 100 }
            ]);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('lifeCanvasItems', JSON.stringify(items));
    }, [items]);

    const handleSaveItem = (newItem) => {
        setItems(prev => {
            const exists = prev.find(i => i.id === newItem.id);
            if (exists) {
                return prev.map(i => i.id === newItem.id ? { ...i, ...newItem } : i);
            }
            // New item: Place in center of screen (approx)
            const x = 100 + Math.random() * 200;
            const y = 100 + Math.random() * 100;
            return [...prev, { ...newItem, x, y }];
        });
    };

    const handleDeleteItem = (id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const handleDragStart = () => {
        isDragging.current = false;
    };

    const handleDrag = () => {
        isDragging.current = true;
    };

    const handleDragStop = (id, data) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, x: data.x, y: data.y } : item
        ));

        // Reset dragging state after a short delay to allow onClick to check it
        setTimeout(() => {
            isDragging.current = false;
        }, 100);
    };

    const handleItemClick = (item) => {
        if (!isDragging.current) {
            setEditingItem(item);
            setIsModalOpen(true);
        }
    };

    const openNewModal = (type = 'sticky') => {
        setEditingItem({ type }); // Pre-set type
        setIsModalOpen(true);
    };

    // Filter Logic
    const filteredItems = useMemo(() => {
        const now = new Date();
        return items.filter(item => {
            const itemDate = new Date(item.createdAt);

            switch (activeView) {
                case 'today':
                    return itemDate.toDateString() === now.toDateString();
                case 'month':
                    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                case 'year':
                    return itemDate.getFullYear() === now.getFullYear();
                case 'life':
                    return true; // All items
                case 'past':
                    return itemDate < new Date(now.setHours(0, 0, 0, 0)); // Before today
                default:
                    return true;
            }
        });
    }, [items, activeView]);

    return (
        <div className="h-screen w-screen overflow-hidden bg-white relative flex flex-col font-sans text-neutral-900">

            {/* Top Tabs */}
            <div className="flex justify-center border-b border-neutral-100 bg-white/90 backdrop-blur z-20 pt-4 pb-0">
                <div className="flex gap-8">
                    {SECTIONS.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveView(section.id)}
                            className={`pb-4 text-lg font-medium transition-colors relative ${activeView === section.id ? 'text-black' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            {section.label}
                            {activeView === section.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative overflow-auto bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:20px_20px]">
                <div className="min-w-[2000px] min-h-[2000px] relative p-10">
                    {filteredItems.map(item => (
                        <Draggable
                            key={item.id}
                            defaultPosition={{ x: item.x || 0, y: item.y || 0 }}
                            position={{ x: item.x || 0, y: item.y || 0 }}
                            onStart={handleDragStart}
                            onDrag={handleDrag}
                            onStop={(e, data) => handleDragStop(item.id, data)}
                            bounds="parent"
                        >
                            <div className="absolute"> {/* Wrapper div for Draggable to avoid ref issues */}
                                <Item item={item} onClick={() => handleItemClick(item)} />
                            </div>
                        </Draggable>
                    ))}

                    {filteredItems.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-neutral-400">No items in this view.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Toolbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-2xl flex gap-6 items-center z-50 transition-transform hover:scale-105">
                <button onClick={() => openNewModal('sticky')} className="hover:text-neutral-300 transition-colors" title="Add Sticky">
                    <Square size={20} fill="currentColor" className="text-yellow-200" />
                </button>
                <div className="w-px h-4 bg-neutral-700"></div>
                <button onClick={() => openNewModal('text')} className="hover:text-neutral-300 transition-colors" title="Add Text">
                    <Type size={24} />
                </button>
                <div className="w-px h-4 bg-neutral-700"></div>
                <button onClick={() => openNewModal('photo')} className="hover:text-neutral-300 transition-colors" title="Add Photo">
                    <ImageIcon size={24} />
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={editingItem}
                onSave={handleSaveItem}
                onDelete={handleDeleteItem}
            />
        </div>
    );
}

export default App;
