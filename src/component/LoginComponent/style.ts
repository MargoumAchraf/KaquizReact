import { StyleSheet } from 'react-native';

const ORANGE = '#E8631C';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  headerSafeArea: { flex: 1, backgroundColor: ORANGE },
  header: { backgroundColor: ORANGE, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 90 },
  title: { fontSize: 44, fontWeight: '700', color: '#fff', marginTop: 24 },
  subtitle: { fontSize: 22, color: '#fff', marginTop: 16 },
  card: { backgroundColor: '#fff', marginTop: 60, marginHorizontal: 20, borderRadius: 24, paddingHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  input: { flex: 1, fontSize: 17, color: '#333', padding: 0 },
  eyeIcon: { fontSize: 20 },
  errorText: { color: '#D14343', fontSize: 13, textAlign: 'center', marginTop: 12, marginHorizontal: 20 },
  divider: { height: 1, backgroundColor: '#EDEDED' },
  forgotWrap: { alignItems: 'center', marginTop: 24 },
  forgotText: { color: '#9B9B9B', fontSize: 15 },
  loginButton: { backgroundColor: ORANGE, marginHorizontal: 20, marginTop: 24, borderRadius: 30, paddingVertical: 18, alignItems: 'center', shadowColor: ORANGE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  signupWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 28, marginBottom: 24 },
  signupText: { color: '#9B9B9B', fontSize: 15 },
  signupLink: { color: ORANGE, fontSize: 15, fontWeight: '700' },
});
