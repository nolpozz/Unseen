import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    // Validate QR code format
    if (data.startsWith('unseen://event/')) {
      const eventId = data.replace('unseen://event/', '');
      onScan(eventId);
    } else {
      Alert.alert('Invalid QR Code', 'This QR code is not recognized as an event code.');
      setScanned(false);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Ionicons name="camera-off" size={64} color={colors.textSecondary} />
        <Text style={[styles.text, { color: colors.text }]}>Camera access denied</Text>
        <Text style={[styles.subtext, { color: colors.textSecondary }]}>
          Please enable camera permissions to scan QR codes
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onClose}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.card }]}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.instructionText, { color: colors.white }]}>
            Position the QR code within the frame
          </Text>
        </View>
      </View>

      {scanned && (
        <View style={[styles.scanResult, { backgroundColor: colors.card }]}>
          <Text style={[styles.resultText, { color: colors.text }]}>
            QR Code Scanned!
          </Text>
          <View style={styles.resultButtons}>
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: colors.secondary }]}
              onPress={handleScanAgain}
            >
              <Text style={[styles.resultButtonText, { color: colors.white }]}>
                Scan Again
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: colors.primary }]}
              onPress={onClose}
            >
              <Text style={[styles.resultButtonText, { color: colors.white }]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingRight: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
  },
  cornerTopRight: {
    position: 'absolute',
    top: height * 0.3,
    right: width * 0.2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: height * 0.3,
    left: width * 0.2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: height * 0.3,
    right: width * 0.2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
  },
  footer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  scanResult: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QRScanner; 