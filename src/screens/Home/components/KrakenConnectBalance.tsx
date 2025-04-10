import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import { Label } from '@/components/Label';
import { Skeleton } from '@/components/Skeleton';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useDeviceSize } from '@/hooks/useDeviceSize';
import { useKrakenConnectBalance } from '@/reactQuery/hooks/krakenConnect/useKrakenConnectBalance';
import { useIsConnectedWithExchange } from '@/realm/krakenConnect/useIsConnectedWithExchange';
import { useAppCurrency } from '@/realm/settings';
import { Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';

import { KrakenIcon } from '../../../components/KrakenIcon';

import loc from '/loc';

export const KRAKEN_CONNECT_BALANCE_FULL_HEIGHT = 44;
export const KRAKEN_CONNECT_BALANCE_FULL_HEIGHT_SMALL_DEVICE = 36;
const MARGIN_TOP = 12;
const MARGIN_TOP_SMALL_DEVICE = 4;

export const KrakenConnectBalance = () => {
  const isConnectedWithExchange = useIsConnectedWithExchange();
  const { data, isLoading, isFetched } = useKrakenConnectBalance();
  const { currency } = useAppCurrency();
  const balanceFormatted = useBalanceDisplay(formatCurrency(data || 0, { currency }));
  const { colors } = useTheme();
  const { size } = useDeviceSize();
  const navigation = useNavigation();

  if (!isConnectedWithExchange) {
    return null;
  }

  const balance = `${balanceFormatted} ${loc.krakenConnect.balanceOnKraken}`;
  const style =
    size === 'small'
      ? {
          height: KRAKEN_CONNECT_BALANCE_FULL_HEIGHT_SMALL_DEVICE - MARGIN_TOP_SMALL_DEVICE,
          marginTop: MARGIN_TOP_SMALL_DEVICE,
        }
      : {
          height: KRAKEN_CONNECT_BALANCE_FULL_HEIGHT - MARGIN_TOP,
          marginTop: MARGIN_TOP,
        };

  const handleOnPress = () => {
    navigation.navigate(Routes.KrakenConnectTransfer);
  };

  return (
    <Touchable style={[styles.container, style, { backgroundColor: colors.purple_20 }]} onPress={handleOnPress}>
      <KrakenIcon />
      {isLoading || !isFetched ? (
        <Skeleton style={styles.skeleton} />
      ) : (
        <Label type="boldCaption1" style={styles.label} color="light75">
          {balance}
        </Label>
      )}

      <SvgIcon name="chevron-right" color="light75" size={16} />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderRadius: 16,
  },
  label: {
    marginLeft: 4,
    lineHeight: 16,
  },
  skeleton: {
    paddingVertical: 8,
    borderRadius: 8,
    height: '100%',
    width: 102,
    marginLeft: 4,
  },
});
