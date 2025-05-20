"use client";

import { Anchor, Group, Progress, Table, Text, TableScrollContainer, TableThead, TableTr, TableTh, TableTd, TableTbody } from '@mantine/core';
import { Item } from '@/utils/fetchData';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { IconCircleCheckFilled, IconCircleDashedCheck } from '@tabler/icons-react';
import classes from './TableReviews.module.css';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface TableReviewsProps {
    items: Item[];
}
export function TableReviews({ items: initialItems }: TableReviewsProps) {
    const [items, setItems] = useState<Item[]>(initialItems);

    const handleClick = async (id: string) => {
        const updatedItems = items.map((item) =>
            item._id === id ? { ...item, completed: true } : item
          );
          setItems(updatedItems);

        try {
            const res = await fetch('/api/dashboard', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                // Revert optimistic update on failure
                setItems(items);
                throw new Error("Failed to update status");
            }
                toast.success('Marked as completed');
            } catch (error) {
                toast.error('Failed to update');
            }
        };

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
            <TableTd className="flex justify-center items-center">
                <button
                    onClick={() => handleClick(row._id)} // Replace with your own handler
                    className="p-1 rounded hover:bg-gray-100 transition"
                    disabled={row.completed}
                    title={row.completed ? "Completed" : "Incomplete"}
                >
                    {row.completed ? (
                    <IconCircleCheckFilled size={24} color="green" />
                    ) : (
                    <IconCircleDashedCheck size={24} color="grey" />
                    )}
                </button>
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
                <TableTh>Completed</TableTh>
            </TableTr>
            </TableThead>
            <TableTbody>{rows}</TableTbody>
        </Table>
        </TableScrollContainer>
    );
    }

