"use client";

import { Anchor, Table, TableScrollContainer, TableThead, TableTr, TableTh, TableTd, TableTbody } from '@mantine/core';
import { Item } from '@/utils/fetchData';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { IconCircleCheckFilled, IconCircleDashedCheck, IconPencilPlus, IconTrash } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TableReviewsProps {
    items: Item[];
}


export function TableReviews({ items: initialItems }: TableReviewsProps) {
    const [items, setItems] = useState<Item[]>(initialItems);
    const router = useRouter();


    const handleClick = async (id: string, currentStatus: boolean) => {
        const updatedItems = items.map((item) =>
            item._id === id ? { ...item, completed: !currentStatus } : item
          );
          setItems(updatedItems);

        try {
            const res = await fetch('/api/dashboard', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, completed: !currentStatus }),
            });

            if (!res.ok) {
                // Revert optimistic update on failure
                setItems(items);
                throw new Error("Failed to update status");
            }
                toast.success(`Marked as ${!currentStatus ? 'completed' : 'incomplete'}`);
            } catch (error) {
                toast.error('Failed to update');
            }
        };


    const handleEdit = (id: string, category: string) => {
        router.push(`/dashboard/${category}/${id}`);

    }

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/dashboard/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete item');
            setItems(items.filter((item) => item._id !== id));
            toast.success('Item deleted successfully');
        } catch (error) {
            toast.error('Failed to delete item');
        }

    }

    const rows = items.map((row) => {
        const date = new Date(row.date_detail);
        const sgtDate = toZonedTime(date, 'Asia/Singapore');
        const formattedDate = format(sgtDate, 'dd MMM yyyy, HH:mm');

        return (
            <TableTr key={row._id}>
                <TableTd>{formattedDate}</TableTd>
                <TableTd>{row.title}</TableTd>
                <TableTd>
                    <Anchor href={row.details} target="_blank" rel="noopener noreferrer" fz="sm">
                        Link
                    </Anchor>
                </TableTd>
                <TableTd>{row.summary}</TableTd>
                <TableTd className="text-center">
                    <button
                        onClick={() => handleClick(row._id, row.completed)}
                        className="p-1 rounded hover:bg-gray-100 transition"
                        title={row.completed ? "Completed" : "Incomplete"}
                    >
                        {row.completed ? (
                            <IconCircleCheckFilled size={24} color="green" />
                        ) : (
                            <IconCircleDashedCheck size={24} color="grey" />
                        )}
                    </button>
                </TableTd>

                <TableTd className="text-center">
                    <div className="inline-flex justify-center items-center gap-2">
                        <button
                            onClick={() => handleEdit(row._id, row.category)}
                            className="p-1 rounded hover:bg-gray-100 transition"
                        >
                            <IconPencilPlus size={24} color="blue"/>
                        </button>

                        <button
                            onClick={() => handleDelete(row._id)}
                            className="p-1 rounded hover:bg-gray-100 transition"
                        >  
                            <IconTrash size={24} color="red"/>
                        </button>
                    </div>
                </TableTd>
            </TableTr>
        );
    });

    return (
        <TableScrollContainer minWidth={800}>
        <Table verticalSpacing="xs">
            <TableThead>
            <TableTr>
                <TableTh>Date</TableTh>
                <TableTh>Title</TableTh>
                <TableTh>Link</TableTh>
                <TableTh>Summary</TableTh>
                <TableTh className="text-center">Completed</TableTh>
                <TableTh className="text-center">Actions</TableTh>
            </TableTr>
            </TableThead>
            <TableTbody>{rows}</TableTbody>
        </Table>
        </TableScrollContainer>
    );
    }

