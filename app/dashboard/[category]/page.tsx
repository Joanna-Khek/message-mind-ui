import { lowercaseCategory, titleCategory } from "@/utils";
import { TableReviews } from "@/components/Tables/TableReviews";
import { fetchData } from "@/utils";

export default async function CategoryPage({ params }: { params: { category: string }}) {
    const { category } = await params; // Await params to access category
    const title = titleCategory(category);
    const formattedTitle = lowercaseCategory(category);
    const items = await fetchData();

    const categoryItems = items.filter(item => item.category === formattedTitle);
    
    return (
        <div className="w-full flex justify-center">
            <div className=" w-full p-4 flex flex-col gap-4">
                <h1 className="text-2xl font-bold">{title}</h1>
                <TableReviews items={categoryItems} />
            </div>
        </div>
    )
}