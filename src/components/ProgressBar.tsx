import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, calculateProgress } from '../utils/helpers';

interface ProgressBarProps {
  current: number;
  target: number;
  color?: string;
  showPercentage?: boolean;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  color = colors.primary,
  showPercentage = true,
  height = 8,
}) => {
  const progress = calculateProgress(current, target);

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{progress.toFixed(0)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
  percentage: {
    marginLeft: spacing.sm,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 36,
    textAlign: 'right',
  },
});

export default ProgressBar;
