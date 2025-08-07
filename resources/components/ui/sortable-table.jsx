import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sortable table row component
function SortableTableRow({ children, id, className, ...props }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={cn(
                'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
                isDragging && 'opacity-50 bg-muted/80',
                className
            )}
            {...props}
        >
            {children}
        </tr>
    );
}

// Sortable table cell with drag handle
function SortableTableCell({ children, className, dragHandle = false, ...props }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <td
            ref={setNodeRef}
            style={style}
            className={cn(
                'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                className
            )}
            {...props}
        >
            {dragHandle && (
                <div
                    {...attributes}
                    {...listeners}
                    className="inline-flex items-center justify-center w-4 h-4 cursor-grab active:cursor-grabbing mr-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <GripVertical size={14} />
                </div>
            )}
            {children}
        </td>
    );
}

// Main sortable table component
export function SortableTable({ 
    items, 
    onSort, 
    children, 
    className,
    dragHandleColumn = true,
    ...props 
}) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            
            const newItems = arrayMove(items, oldIndex, newIndex);
            onSort(newItems);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className={cn("relative w-full overflow-x-auto", className)}>
                <table className="w-full caption-bottom text-sm" {...props}>
                    {children}
                </table>
            </div>
        </DndContext>
    );
}

// Sortable table body
export function SortableTableBody({ items, children, className, ...props }) {
    return (
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
            <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
                {children}
            </tbody>
        </SortableContext>
    );
}

export { SortableTableRow, SortableTableCell }; 