"use client";

import { Card, CardSection, Group, Image, RingProgress, Text } from '@mantine/core';
import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import classes from './CardWithStats.module.css';
import { Router } from 'next/router';


interface Props {
  category: string;
  percComplete: number;
  totalItems: number;
  totalCompleted: number;
}

export function CardWithStats({ category, percComplete, totalItems, totalCompleted }: Props) {

  const router = useRouter(); // ✅ Initialize router

  const handleClick = () => {
    router.push(`/dashboard/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`);
  
  }

  const stats = [
    { title: 'Total Articles', value: totalItems.toString() },
    { title: 'Completed', value: totalCompleted.toString() },
  ];

  const items = stats.map((stat) => (
    <div key={stat.title}>
      <Text size="xs" color="dimmed">
        {stat.title}
      </Text>
      <Text fw={500} size="sm">
        {stat.value}
      </Text>
    </div>
  ));

  return (
    <Card withBorder padding="lg" radius="md" className={classes.card}>

      <Group justify="space-between" mt="lg">
        <Text className={classes.title}>{category}</Text>
        <Group gap={5}>
          <Text fz="xs" c="dimmed">
            {percComplete}% completed
          </Text>
          <RingProgress size={18} thickness={2} sections={[{ value: percComplete, color: 'blue' }]} />
        </Group>
      </Group>
     
      <Button onClick={handleClick} className="my-5" variant="light">View</Button>
      <CardSection className={classes.footer}>{items}</CardSection>
    </Card>
  );
}