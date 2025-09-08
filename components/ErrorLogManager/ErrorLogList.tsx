import { styles } from '@/styles/ErrorLogStyles';
import React from 'react';
import { FlatList } from 'react-native';
import { ErrorLog } from '../../types/ErrorLog';
import { ErrorLogItem } from './ErrorLogItem';

interface ErrorLogListProps {
  errorLogs: ErrorLog[];
  onMarkAsFixed: (errorLogId: number, solution: string) => Promise<void>;
  onToggleStopStatus: (errorLog: ErrorLog) => Promise<void>;
}

export const ErrorLogList: React.FC<ErrorLogListProps> = ({
  errorLogs,
  onMarkAsFixed,
  onToggleStopStatus
}) => {
  return (
    <FlatList
      data={errorLogs}
      renderItem={({ item }) => (
        <ErrorLogItem
          item={item}
          onMarkAsFixed={onMarkAsFixed}
          onToggleStopStatus={onToggleStopStatus}
        />
      )}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      style={styles.list}
    />
  );
};