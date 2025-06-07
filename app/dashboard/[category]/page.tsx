import { lowercaseCategory, titleCategory } from "@/utils";
import { TableReviews } from "@/components/Tables/TableReviews";
import { fetchData } from "@/utils";
import { Tabs, TabsList, TabsTab, TabsPanel } from '@mantine/core';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const title = titleCategory(category);
    const formattedTitle = lowercaseCategory(category);
    const items = await fetchData();

    const categoryItems = items.filter(item => item.category === formattedTitle);
    
    const completedItems = categoryItems.filter(item => item.completed);
    const uncompletedItems = categoryItems.filter(item => !item.completed);
    return (
        <div className="w-full flex justify-center">
            <div className=" w-full p-4 flex flex-col gap-4">
                <h1 className="text-2xl font-bold">{title}</h1>
                <Tabs defaultValue="uncompleted">
                    <TabsList>
                        <TabsTab value="uncompleted">Uncompleted</TabsTab>
                        <TabsTab value="completed">Completed</TabsTab>
                    </TabsList>

                    <TabsPanel value="uncompleted" pt="xs">
                        <TableReviews items={uncompletedItems}  />
                    </TabsPanel>

                    <TabsPanel value="completed" pt="xs">
                        <TableReviews items={completedItems} />
                    </TabsPanel>
                </Tabs>
                
            </div>
        </div>
    )
}