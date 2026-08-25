import { StyleSheet } from 'react-native';

const ORANGE = '#E8631C';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  headerSafeArea: { backgroundColor: ORANGE },
  header: { backgroundColor: ORANGE, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 90 },
  title: { fontSize: 44, fontWeight: '700', color: '#fff', marginTop: 24 },
  subtitle: { fontSize: 22, color: '#fff', marginTop: 16 },
  avatarWrap: { alignItems: 'center', marginTop: -50, marginBottom: 8 },
  avatarButton: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#fff', borderWidth: 3, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholderText: { fontSize: 40, color: ORANGE, fontWeight: '300' },
  avatarLabel: { marginTop: 8, fontSize: 13, color: '#9B9B9B' },
  card: { backgroundColor: '#fff', marginTop: 12, marginHorizontal: 20, borderRadius: 24, paddingHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  input: { flex: 1, fontSize: 17, color: '#333', padding: 0 },
  eyeIcon: { fontSize: 20 },
  errorText: { color: '#D14343', fontSize: 13, paddingHorizontal: 4, paddingTop: 2, paddingBottom: 6 },
  divider: { height: 1, backgroundColor: '#EDEDED' },
  registerButton: { backgroundColor: ORANGE, marginHorizontal: 20, marginTop: 28, borderRadius: 30, paddingVertical: 18, alignItems: 'center', shadowColor: ORANGE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 },
  registerButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  loginWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 28, marginBottom: 24 },
  loginText: { color: '#9B9B9B', fontSize: 15 },
  loginLink: { color: ORANGE, fontSize: 15, fontWeight: '700' },
});
