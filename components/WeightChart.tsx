import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WeightEntry, UserSettings } from '@/types';
import { formatWeight } from '@/utils/storage';

interface WeightChartProps {
  entries: WeightEntry[];
  settings: UserSettings;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 48;
const chartHeight = 200;

function getStyles(darkMode: boolean) {
  return StyleSheet.create({
    container: {
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
      marginBottom: 16,
    },
    chartContainer: {
      flexDirection: 'row',
      height: chartHeight,
      marginBottom: 16,
    },
    yAxis: {
      width: 60,
      justifyContent: 'space-between',
      paddingVertical: 20,
    },
    axisLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      textAlign: 'right',
    },
    chart: {
      flex: 1,
      position: 'relative',
    },
    gridLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: darkMode ? '#3F3F46' : '#F3F4F6',
    },
    dataPoint: {
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#3B82F6',
      borderWidth: 2,
      borderColor: darkMode ? '#27272A' : '#FFFFFF',
    },
    trendLine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    lineSegment: {
      position: 'absolute',
      height: 2,
      backgroundColor: '#3B82F6',
      transformOrigin: '0 50%',
    },
    summary: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: darkMode ? '#3F3F46' : '#F3F4F6',
    },
    summaryItem: {
      alignItems: 'center',
    },
    summaryLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: darkMode ? '#F3F4F6' : '#1F2937',
    },
    emptyChart: {
      backgroundColor: darkMode ? '#27272A' : '#FFFFFF',
      borderRadius: 16,
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: darkMode ? '#A1A1AA' : '#6B7280',
      textAlign: 'center',
    },
  });
}

export default function WeightChart({ entries, settings }: WeightChartProps) {
  const styles = getStyles(settings.darkModeEnabled);

  if (entries.length < 2) {
    return (
      <View style={styles.emptyChart}>
        <Text style={styles.emptyText}>Add more weight entries to see your progress chart</Text>
      </View>
    );
  }

  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const weights = sortedEntries.map(entry => entry.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight || 1;

  const points = sortedEntries.map((entry, index) => {
    const x = (index / (sortedEntries.length - 1)) * (chartWidth - 40);
    const y = chartHeight - 40 - ((entry.weight - minWeight) / weightRange) * (chartHeight - 80);
    return { x: x + 20, y, weight: entry.weight, date: entry.date };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Progress</Text>
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>
            {formatWeight(maxWeight, settings.useMetricWeight)}
          </Text>
          <Text style={styles.axisLabel}>
            {formatWeight((maxWeight + minWeight) / 2, settings.useMetricWeight)}
          </Text>
          <Text style={styles.axisLabel}>
            {formatWeight(minWeight, settings.useMetricWeight)}
          </Text>
        </View>
        
        <View style={styles.chart}>
          {/* Grid lines */}
          <View style={[styles.gridLine, { top: 20 }]} />
          <View style={[styles.gridLine, { top: chartHeight / 2 }]} />
          <View style={[styles.gridLine, { bottom: 20 }]} />
          
          {/* Data points */}
          {points.map((point, index) => (
            <View
              key={index}
              style={[
                styles.dataPoint,
                {
                  left: point.x - 4,
                  top: point.y - 4,
                }
              ]}
            />
          ))}
          
          {/* Trend line (simplified) */}
          <View style={styles.trendLine}>
            {points.map((point, index) => (
              index > 0 && (
                <View
                  key={index}
                  style={[
                    styles.lineSegment,
                    {
                      left: points[index - 1].x,
                      top: points[index - 1].y,
                      width: Math.sqrt(
                        Math.pow(point.x - points[index - 1].x, 2) +
                        Math.pow(point.y - points[index - 1].y, 2)
                      ),
                      transform: [{
                        rotate: `${Math.atan2(
                          point.y - points[index - 1].y,
                          point.x - points[index - 1].x
                        )}rad`
                      }]
                    }
                  ]}
                />
              )
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Start</Text>
          <Text style={styles.summaryValue}>
            {formatWeight(weights[0], settings.useMetricWeight)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Current</Text>
          <Text style={styles.summaryValue}>
            {formatWeight(weights[weights.length - 1], settings.useMetricWeight)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Change</Text>
          <Text style={[
            styles.summaryValue,
            { color: weights[0] > weights[weights.length - 1] ? '#10B981' : '#EF4444' }
          ]}>
            {weights[0] > weights[weights.length - 1] ? '-' : '+'}
            {formatWeight(Math.abs(weights[0] - weights[weights.length - 1]), settings.useMetricWeight)}
          </Text>
        </View>
      </View>
    </View>
  );
}