"use client";

import { Card, Group, RingProgress, Text, useMantineTheme } from '@mantine/core';
import classes from './StatsRingCard.module.css';


interface Props {
  statsTotalItems: number;
  statsTotalRemaining: number;
  statsTotalCompleted: number;
  statsPercComplete: number;
}

export function StatsRingCard({ statsTotalItems, statsTotalRemaining, statsTotalCompleted, statsPercComplete }: Props) {
  const theme = useMantineTheme();

  const stats = [
    { value: statsTotalRemaining.toString(), label: 'Remaining' },
    { value: statsTotalCompleted.toString(), label: 'Completed' },
  ];

  
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="xs" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder p="xl" radius="md" className={classes.card}>
      <div className={classes.inner}>
        <div>
          <Text fz="xl" className={classes.label}>
            Project tasks
          </Text>
          <div>
            <Text className={classes.lead} mt={30}>
              {statsTotalItems}
            </Text>
            <Text fz="xs" c="dimmed">
              Total Items
            </Text>
          </div>
          <Group mt="lg">{items}</Group>
        </div>

        <div className={classes.ring}>
          <RingProgress
            roundCaps
            thickness={6}
            size={150}
            sections={[{ value: statsPercComplete, color: theme.primaryColor }]}
            label={
              <div>
                <Text ta="center" fz="lg" className={classes.label}>
                  {statsPercComplete}%
                </Text>
                <Text ta="center" fz="xs" c="dimmed">
                  Completed
                </Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
}