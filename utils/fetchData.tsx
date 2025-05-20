export interface Item {
    _id: string;
    date_saved: string;
    date_detail: string;
    title: string;
    details: string;
    description: string;
    category: string;
    reasoning: string;
    summary: string;
    completed: boolean;
  }

export default async function fetchData(): Promise<Item[]> {
    console.log('Fetching from:', process.env.NEXT_PUBLIC_API_URL);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        console.error('Fetch failed with status:', res.status, res.statusText);
        throw new Error('Failed to fetch data');
    }

    return res.json();
}