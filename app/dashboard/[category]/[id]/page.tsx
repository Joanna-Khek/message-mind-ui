"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Item } from '@/utils/fetchData';
import { Button, TextInput, Textarea, Group } from '@mantine/core';
import { toast } from 'react-toastify';
import { fetchData } from "@/utils"
import { SelectCreatable } from '@/components/SelectOption/SelectCreatable';

export default function EditItemPage() {
    const router = useRouter();
    const { id, category } = useParams(); // Get dynamic route parameters
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        details: '',
        summary: '',
        category: '',
    });
    const [categories, setCategories] = useState<string[]>([]);


    // Fetch item data
    useEffect(() => {
        async function fetchItem() {
            try {
                // Fetch item specific to the id
                const res = await fetch(`/api/dashboard/${id}`);
                if (!res.ok) throw new Error('Failed to fetch item');
                const data: Item = await res.json();
                setItem(data);
                setFormData({
                    title: data.title ?? '',
                    details: data.details ?? '',
                    summary: data.summary ?? '',
                    category: data.category ?? '',
                });

                // Fetch all items from database
                const items = await fetchData();
    
                // Extract unique categories
                const uniqueCategories = Array.from(
                    new Set(items.map((item) => item.category).filter((cat): cat is string => !!cat))
                );
                setCategories(uniqueCategories);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load item');
                setLoading(false);
            }
        }
        fetchItem();
    }, [id]);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle category change
    const handleCategoryChange = (value: string | null) => {
        setFormData({ ...formData, category: value || '' });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/dashboard/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed to update item');
            toast.success('Item updated successfully');
            router.push(`/dashboard/${category}`); // Redirect back to dashboard
        } catch (error) {
            toast.error('Failed to update item');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!item) return <div>Item not found</div>;

    return (
        <div className="p-4">
            <h1>Edit Item</h1>
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <TextInput
                    label="Details (Link)"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                />
                <Textarea
                    label="Summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    required
                />
                <SelectCreatable 
                    label="Category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    categories={categories}
                />
                <Group>
                    <Button type="submit" mt="md">
                        Save Changes
                    </Button>
                    <Button
                        variant="outline"
                        mt="md"
                        onClick={() => router.push(`/dashboard/${category}`)}
                    >
                        Cancel
                    </Button>
                </Group>
            </form>
        </div>
    );
}