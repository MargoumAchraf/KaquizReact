import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outer: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    padding: 12,
  },
  inner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
  },
  label: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  errorText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
  },
});
