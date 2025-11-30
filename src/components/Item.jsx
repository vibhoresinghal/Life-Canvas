import React, { forwardRef } from 'react';

const Item = forwardRef(({ item, onClick, style, className, ...props }, ref) => {
    const baseClasses = "absolute top-0 left-0 w-64 flex flex-col justify-between p-4 rounded-sm shadow-sm hover:shadow-md transition-shadow cursor-move group bg-white border border-neutral-200";

    // Merge incoming style (from Draggable) with our own
    const combinedStyle = { ...style };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const EmojiDisplay = () => {
        if (!item.emoji) return null;
        return (
            <div className="absolute -top-5 left-4 text-3xl z-10 filter drop-shadow-sm transform -rotate-6">
                {item.emoji}
            </div>
        );
    };

    if (item.type === 'photo') {
        return (
            <div ref={ref} className={`${baseClasses} p-2 bg-white`} style={combinedStyle} onClick={() => onClick(item)} {...props}>
                <EmojiDisplay />
                <div className="w-full h-48 overflow-hidden mb-2 bg-neutral-100">
                    <img src={item.content} alt="Memory" className="w-full h-full object-cover pointer-events-none" onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Invalid+Image'} />
                </div>
                <div className="flex justify-between items-end">
                    <p className="text-xs text-neutral-400">{formatDate(item.createdAt)}</p>
                    {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1">
                            {item.tags.map(tag => (
                                <span key={tag} className="text-[10px] text-neutral-400">#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Sticky & Text share similar look in the new design (cards)
    // But we can keep colors for stickies if desired. The image shows yellow stickies.
    let bgClass = "bg-white";
    if (item.type === 'sticky') {
        const colors = {
            yellow: 'bg-[#fff9c4]', // Lighter yellow
            blue: 'bg-[#e3f2fd]',
            pink: 'bg-[#fce4ec]',
            green: 'bg-[#e8f5e9]',
        };
        bgClass = colors[item.color] || 'bg-[#fff9c4]';
    }

    return (
        <div ref={ref} className={`${baseClasses} ${bgClass} min-h-[160px]`} style={combinedStyle} onClick={() => onClick(item)} {...props}>
            <EmojiDisplay />
            <div className="flex-1">
                <p className="font-medium text-neutral-900 text-sm whitespace-pre-wrap leading-relaxed">{item.content}</p>
            </div>
            <div className="mt-4 pt-2 border-t border-black/5 flex justify-between items-center">
                <p className="text-xs text-neutral-500 font-medium">{formatDate(item.createdAt)}</p>
                {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-1">
                        {item.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-neutral-500">#{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

export default Item;
