import type React from 'react';

import { Image, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useAppCurrency } from '@/realm/settings';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { formatCurrency } from '@/utils/formatCurrency';

import { GradientItemBackground } from '../GradientItemBackground';

import { ANIMATION_DURATION } from './DefiProtocolPositions.constants';

import type { DefiProtocolHeadingProps } from './DefiProtocolPositions.types';

import { capitalizeFirstLetter } from '/helpers/capitalizeFirstLetter';

export const DefiProtocolHeading: React.FC<DefiProtocolHeadingProps> = ({
  protocolName,
  protocolIcon,
  nOfPositions,
  totalValueInUsd,
  isExpanded,
  onToggle,
}) => {
  const protocolNameCapitalized = protocolName.split(' ').map(capitalizeFirstLetter).join(' ');

  const { currency } = useAppCurrency();

  const usdFiatRate = useCurrentUsdFiatRate();
  const valueInUserCurrency = usdFiatRate * totalValueInUsd;

  const formattedFiatAmount = useBalanceDisplay(formatCurrency(valueInUserCurrency, { currency, compact: true, hideDecimals: false }), 7);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isExpanded.value ? '-180deg' : '0deg', { duration: ANIMATION_DURATION }) }],
  }));

  const nOfPositionContainetStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isExpanded.value ? 0 : 1, {
      duration: ANIMATION_DURATION,
      easing: Easing.in(Easing.linear),
    }),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image source={{ uri: protocolIcon }} style={styles.icon} />
        <Label color="light100" type="boldTitle1">
          {protocolNameCapitalized}
        </Label>

        <Animated.View style={[styles.nOfPositionsContainer, nOfPositionContainetStyle]}>
          <GradientItemBackground style={styles.gradientItemBackground} />
          <Label color="light100" type="mediumCaption1">
            {nOfPositions}
          </Label>
        </Animated.View>
      </View>

      <View style={[styles.subContainer, styles.rightSubContainer]}>
        <Label color="light50" type="boldLargeMonospace">
          {formattedFiatAmount}
        </Label>

        <Animated.View style={chevronStyle}>
          <Touchable onPress={onToggle}>
            <SvgIcon name="chevron-down" size={24} color="light50" />
          </Touchable>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nOfPositionsContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 100,
    height: 24,
    width: 24,
  },
  gradientItemBackground: {
    borderRadius: 100,
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  rightSubContainer: {
    gap: 4,
  },
  icon: {
    height: 24,
    width: 24,
    borderRadius: 7.5,
  },
});
