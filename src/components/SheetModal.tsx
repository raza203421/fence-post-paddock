import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { SCREEN_H, TIMING } from '../constants/config';
import theme from '../constants/theme';
import IconButton from './IconButton';

interface Props {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Shared bottom sheet for the four menu panels. */
export function SheetModal({ title, visible, onClose, children }: Props) {
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      slide.setValue(0);
      return;
    }
    Animated.timing(slide, {
      toValue: 1,
      duration: TIMING.sheetSlide,
      useNativeDriver: true,
    }).start();
  }, [visible, slide]);

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [90, 0] });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close panel" />
        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheet, { opacity: slide, transform: [{ translateY }] }]}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <IconButton onPress={onClose} label="Close" size={44} tone="oat">
              <X size={20} color={theme.colors.text.primary} strokeWidth={2.4} />
            </IconButton>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.ui.scrim },
  sheet: {
    maxHeight: SCREEN_H * 0.78,
    backgroundColor: theme.colors.bg.primary,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 3,
    borderTopColor: theme.colors.earth.wood,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 26,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.ui.border,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: theme.colors.text.primary,
  },
  scroll: { flexGrow: 0 },
  scrollContent: { paddingBottom: 8, gap: 10 },
});

export default SheetModal;
