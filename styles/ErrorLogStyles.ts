// styles/ErrorLogStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    marginTop: 16,
  },
  errorLogItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorLogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorLogDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  statusBadge: {
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusActual: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  statusFixed: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
  },
  solutionText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  fixContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  solutionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  createForm: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});