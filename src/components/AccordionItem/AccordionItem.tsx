import type React from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { useState } from 'react';
import { type LayoutChangeEvent, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import Animated, { Easing, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

interface Props {
  isExpanded: SharedValue<boolean>;
  children: React.ReactNode | undefined;
  style?: StyleProp<ViewStyle>;
  duration?: number;
}

export function AccordionItem({ isExpanded, children, style, duration = 300 }: Props) {
  const height = useSharedValue(0);
  const [layoutMeasured, setLayoutMeasured] = useState(false);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
      easing: Easing.in(Easing.linear),
    }),
  );

  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    if (layoutMeasured) {
      return;
    }

    height.value = e.nativeEvent.layout.height;
    setLayoutMeasured(true);
  };

  return (
    <Animated.View style={[styles.animatedView, bodyStyle, style]}>
      <View onLayout={onLayout} style={styles.wrapper}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'absolute',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
});
