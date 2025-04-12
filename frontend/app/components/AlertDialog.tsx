import React from 'react';
import { Dialog, Paragraph, Button } from 'react-native-paper';

interface AlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'info' | 'error' | 'success' | 'warning';
  onDismiss: () => void;
  onConfirm?: () => void;
  isDarkMode: boolean;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  title,
  message,
  type = 'info',
  onDismiss,
  onConfirm,
  isDarkMode
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'error': return '#FF6B6B';
      case 'success': return '#00b894';
      case 'warning': return '#FFD93D';
      default: return '#45B7D1';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'error': return 'alert-circle';
      case 'success': return 'check-circle';
      case 'warning': return 'alert';
      default: return 'information';
    }
  };

  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={{
        backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
        borderRadius: 20,
        marginHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 12,
        elevation: 6,
      }}
    >
      <Dialog.Icon 
        icon={getTypeIcon()} 
        size={44} 
        color={getTypeColor()}
      />

      <Dialog.Title
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 22,
          color: isDarkMode ? '#fff' : '#2d3436',
          marginBottom: 10,
        }}
      >
        {title}
      </Dialog.Title>

      <Dialog.Content style={{ alignItems: 'center' }}>
        <Paragraph
          style={{
            fontSize: 16,
            color: isDarkMode ? '#ccc' : '#636e72',
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          {message}
        </Paragraph>
      </Dialog.Content>

      <Dialog.Actions style={{ justifyContent: 'center', paddingBottom: 12 }}>
        <Button
          mode="contained"
          onPress={() => {
            if (onConfirm) {
              onConfirm();
            }
            onDismiss();
          }}
          buttonColor={getTypeColor()}
          textColor="#fff"
          style={{ borderRadius: 10, paddingHorizontal: 28 }}
          labelStyle={{ fontWeight: '600' }}
        >
          OK
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default AlertDialog;