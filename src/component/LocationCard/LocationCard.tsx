import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './style';

interface LocationCardProps {
  locationLabel: string;
}

export default function LocationCard() {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.row}>
          <Text style={styles.value}>New York, NY</Text>
        </View>
      </View>
    </View>
  );
}
