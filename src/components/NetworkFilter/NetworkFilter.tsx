import React, { ReactElement, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import { Label } from '@/components/Label';
import { NetworkIcon } from '@/components/NetworkIcon';
import { Pill } from '@/components/Pill';

import { Touchable } from '@/components/Touchable';
import { useLocalStateUpdate } from '@/hooks/useLocalStateUpdate';
import { FeatureFlag, NEW_NETWORKS, useFeatureFlagEnabled } from '@/utils/featureFlags';

import { getNetworkFilters } from './getNetworkFilters';
import { NETWORK_FILTERS, UINetworkFilters } from './types';

import loc from '/loc';

type UIFilterData = { uiLabel: () => string; icon: ReactElement | null; networkFilter: UINetworkFilters };
const UI_FILTER_DATA: UIFilterData[] = [
  { uiLabel: () => loc.coins.allNetworks, icon: null, networkFilter: 'all' },
  { uiLabel: () => loc.network.ethereum, icon: <NetworkIcon networkName="ethereum" size={16} />, networkFilter: NETWORK_FILTERS.ethereum },
  { uiLabel: () => loc.network.polygon, icon: <NetworkIcon networkName="polygon" size={16} />, networkFilter: NETWORK_FILTERS.polygon },
  { uiLabel: () => loc.network.arbitrum, icon: <NetworkIcon networkName="arbitrum" size={16} />, networkFilter: NETWORK_FILTERS.arbitrum },
  { uiLabel: () => loc.network.optimism, icon: <NetworkIcon networkName="optimism" size={16} />, networkFilter: NETWORK_FILTERS.optimism },
  { uiLabel: () => loc.network.base, icon: <NetworkIcon networkName="base" size={16} />, networkFilter: NETWORK_FILTERS.base },
  { uiLabel: () => loc.network.blast, icon: <NetworkIcon networkName="blast" size={16} />, networkFilter: NETWORK_FILTERS.blast },
  { uiLabel: () => loc.network.solana, icon: <NetworkIcon networkName="solana" size={16} />, networkFilter: NETWORK_FILTERS.solana },
  { uiLabel: () => loc.network.linea, icon: <NetworkIcon networkName="linea" size={16} />, networkFilter: NETWORK_FILTERS.linea },
];

const BTC_AND_DOGE_UI_FILTER_DATA: UIFilterData[] = [
  { uiLabel: () => loc.network.bitcoin, icon: <NetworkIcon networkName="HDsegwitBech32" size={16} />, networkFilter: NETWORK_FILTERS.HDsegwitBech32 },
  { uiLabel: () => loc.network.dogecoin, icon: <NetworkIcon networkName="dogecoin" size={16} />, networkFilter: NETWORK_FILTERS.doge },
];

type Props = {
  networkFilter: NETWORK_FILTERS[];
  setNetworkFilter: React.Dispatch<React.SetStateAction<NETWORK_FILTERS[]>>;
  withBtcAndDoge?: boolean;
};

const isNewNetworkFilter = (filter: UIFilterData) => NEW_NETWORKS.some(network => filter.networkFilter.includes(network));
const isNetworkFilterEnabled = (filter: UIFilterData) => !isNewNetworkFilter(filter);

const getNetworkFiltersLength = (uiFilterData: UIFilterData[]) => uiFilterData.length - 1;

export const NetworkFilter = ({ networkFilter, setNetworkFilter, withBtcAndDoge }: Props) => {
  const isNewNetworksEnabled = useFeatureFlagEnabled(FeatureFlag.NewNetworksEnabled);
  const uiFilterData = useMemo<UIFilterData[]>(() => {
    const uiFilters = isNewNetworksEnabled ? UI_FILTER_DATA : UI_FILTER_DATA.filter(isNetworkFilterEnabled);
    return withBtcAndDoge ? uiFilters.concat(BTC_AND_DOGE_UI_FILTER_DATA) : uiFilters;
  }, [withBtcAndDoge, isNewNetworksEnabled]);

  const [localFilter, updateFilter] = useLocalStateUpdate(networkFilter, setNetworkFilter);

  const onPress = (d: UIFilterData) => {
    const filter = getNetworkFilters(d.networkFilter, localFilter, getNetworkFiltersLength(uiFilterData));
    updateFilter(filter);
  };

  return (
    <ScrollView horizontal style={styles.container} contentContainerStyle={styles.contentContainer} showsHorizontalScrollIndicator={false}>
      {uiFilterData.map((d, i) => {
        const isSelected = d.networkFilter === 'all' ? localFilter.length === 0 : localFilter.includes(d.networkFilter);
        return (
          <Touchable onPress={() => onPress(d)} key={d.networkFilter + i}>
            <Pill backgroundColor={isSelected ? 'light8' : 'dark15'}>
              {d.icon}
              <Label color="light100" type="boldCaption1" style={styles.label}>
                {d.uiLabel()}
              </Label>
            </Pill>
          </Touchable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 60, 
  },
  contentContainer: {
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  label: {
    lineHeight: 16,
  },
});
