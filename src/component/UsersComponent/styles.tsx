import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    friendRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 12,
},
friendAvatar: {
  width: 44,
  height: 44,
  borderRadius: 22,
  marginRight: 12,
},
friendInfo: {
  flex: 1,
},
friendName: {
  fontSize: 15,
  fontWeight: '600',
  color: '#0f172a',
},
friendEmail: {
  fontSize: 13,
  fontWeight: '400',
  color: '#64748b',
},
addButton: {
  backgroundColor: '#2563eb',
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 8,
  minWidth: 64,
  alignItems: 'center',
  justifyContent: 'center',
},
addButtonSent: {
  backgroundColor: '#94a3b8', // muted, since it's now disabled/done
},
addButtonError: {
  backgroundColor: '#dc2626', // signals retry needed
},
addButtonText: {
  color: '#ffffff',
  fontSize: 13,
  fontWeight: '600',
},


})