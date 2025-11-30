import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, item, onSave, onDelete }) => {
    if (!isOpen) return null;

    const [content, setContent] = useState(item?.content || '');
    const [type, setType] = useState(item?.type || 'sticky');
    const [color, setColor] = useState(item?.color || 'yellow');
    const [tags, setTags] = useState(item?.tags?.join(', ') || '');
    const [emoji, setEmoji] = useState(item?.emoji || '');

    useEffect(() => {
        if (item) {
            setContent(item.content);
            setType(item.type);
            setColor(item.color || 'yellow');
            setTags(item.tags ? item.tags.join(', ') : '');
            setEmoji(item.emoji || '');
        } else {
            // Defaults for new item
            setContent('');
            setType('sticky');
            setColor('yellow');
            setTags('');
            setEmoji('');
        }
    }, [item, isOpen]);

    const handleSave = () => {
        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
        onSave({
            id: item?.id || Date.now(),
            content,
            type,
            color,
            tags: tagArray,
            emoji,
            createdAt: item?.createdAt || new Date().toISOString(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-neutral-900">{item ? 'Edit Item' : 'New Item'}</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                    {/* Type Selection */}
                    <div className="flex gap-2 bg-neutral-100 p-1 rounded-lg">
                        {['sticky', 'photo', 'text'].map(t => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={`flex-1 py-2 rounded-md text-sm font-medium capitalize transition-colors ${type === t ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Content Input */}
                    <div>
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-neutral-500 mb-1">Icon (Emoji)</label>
                            <input
                                type="text"
                                placeholder="e.g. 📸"
                                value={emoji}
                                onChange={e => setEmoji(e.target.value)}
                                className="w-16 bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-center text-xl focus:ring-2 focus:ring-black/5 outline-none"
                                maxLength={2}
                            />
                        </div>

                        {type === 'photo' ? (
                            <input
                                type="text"
                                placeholder="Image URL..."
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-black/5 outline-none"
                            />
                        ) : (
                            <textarea
                                placeholder="Write your thoughts..."
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                rows={4}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-black/5 outline-none resize-none font-sans"
                            />
                        )}
                    </div>

                    {/* Color Selection (Sticky only) */}
                    {type === 'sticky' && (
                        <div className="flex gap-3">
                            {['yellow', 'blue', 'pink', 'green'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-black' : 'border-transparent'}`}
                                    style={{ backgroundColor: c === 'yellow' ? '#fff9c4' : c === 'blue' ? '#e3f2fd' : c === 'pink' ? '#fce4ec' : '#e8f5e9' }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Tags */}
                    <input
                        type="text"
                        placeholder="Tags (comma separated)..."
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-black/5 outline-none text-sm"
                    />

                    <div className="flex gap-3 pt-4">
                        {item && (
                            <button onClick={() => { onDelete(item.id); onClose(); }} className="px-4 py-2 text-red-500 hover:text-red-700 text-sm font-medium">
                                Delete
                            </button>
                        )}
                        <button onClick={handleSave} className="flex-1 bg-black text-white py-2 rounded-lg font-semibold hover:bg-neutral-800 transition-colors">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
