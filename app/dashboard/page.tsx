import { StatsRingCard } from "@/components/StatsCard/StatsRingCard";
import { CardWithStats } from "@/components/CategoryCard/CardWithStats";
import React from "react";
import { fetchData } from "@/utils"
import { titleCategory } from "@/utils";
// Client component uses the relative path to the API route
// Server component uses the absolute path to the API route


export default async function Dashboard() {
    const items = await fetchData();

    // Extract unique category names
    const uniqueCategories = Array.from(new Set(items.map(item => item.category))).sort();

    // For each category, compute the total number of items and completed items
    const categoryStats = uniqueCategories.map(category => {
        const CategoryItems = items.filter(item => item.category === category);
        const totalItems = CategoryItems.length;
        const totalCompleted = CategoryItems.filter(item => item.completed).length;
        const percComplete = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;
        return { category, percComplete, totalItems, totalCompleted };
    })
    
    const statsTotalItems = items.length;
    const statsTotalCompleted = items.filter(item => item.completed).length;
    const statsTotalRemaining = statsTotalItems - statsTotalCompleted;
    const statsPercComplete = statsTotalItems > 0 ? Math.round((statsTotalCompleted / statsTotalItems) * 100) : 0;

    

    return (
        <div className="w-full flex justify-center">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3">
                <StatsRingCard 
                    statsTotalItems={statsTotalItems}
                    statsTotalRemaining={statsTotalRemaining}
                    statsTotalCompleted={statsTotalCompleted}
                    statsPercComplete={statsPercComplete}/>
                </div>

                {/* For each unique category, render a CardWithStats component */}

                {categoryStats.map(({ category, percComplete, totalItems, totalCompleted }) => {
                    const categoryTitle = titleCategory(category);
                    return (
                        <CardWithStats
                        key={category}
                        category={categoryTitle}
                        percComplete={percComplete}
                        totalItems={totalItems}
                        totalCompleted={totalCompleted}
                        />
                    );
                })}

            </div>
        </div>

      );
}