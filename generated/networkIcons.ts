import React from 'react';
import { SvgProps } from 'react-native-svg';

import i1 from 'kraken-wallet-network-icons/src/arbitrum.svg';
import i2 from 'kraken-wallet-network-icons/src/aurora.svg';
import i3 from 'kraken-wallet-network-icons/src/avalanche.svg';
import i4 from 'kraken-wallet-network-icons/src/base.svg';
import i5 from 'kraken-wallet-network-icons/src/binance.svg';
import i6 from 'kraken-wallet-network-icons/src/bitcoin.svg';
import i7 from 'kraken-wallet-network-icons/src/blast.svg';
import i8 from 'kraken-wallet-network-icons/src/celo.svg';
import i9 from 'kraken-wallet-network-icons/src/cronos.svg';
import i10 from 'kraken-wallet-network-icons/src/doge.svg';
import i11 from 'kraken-wallet-network-icons/src/ethereum-goerli.svg';
import i12 from 'kraken-wallet-network-icons/src/ethereum-sepolia.svg';
import i13 from 'kraken-wallet-network-icons/src/ethereum.svg';
import i14 from 'kraken-wallet-network-icons/src/evmos.svg';
import i15 from 'kraken-wallet-network-icons/src/fantom.svg';
import i16 from 'kraken-wallet-network-icons/src/gnosis.svg';
import i17 from 'kraken-wallet-network-icons/src/harmony.svg';
import i18 from 'kraken-wallet-network-icons/src/linea.svg';
import i19 from 'kraken-wallet-network-icons/src/moonriver.svg';
import i20 from 'kraken-wallet-network-icons/src/optimism.svg';
import i21 from 'kraken-wallet-network-icons/src/polygon.svg';
import i22 from 'kraken-wallet-network-icons/src/solana-devnet.svg';
import i23 from 'kraken-wallet-network-icons/src/solana.svg';

export const networkIcons = {
  'arbitrum': i1,
  'aurora': i2,
  'avalanche': i3,
  'base': i4,
  'binance': i5,
  'bitcoin': i6,
  'blast': i7,
  'celo': i8,
  'cronos': i9,
  'doge': i10,
  'ethereum-goerli': i11,
  'ethereum-sepolia': i12,
  'ethereum': i13,
  'evmos': i14,
  'fantom': i15,
  'gnosis': i16,
  'harmony': i17,
  'linea': i18,
  'moonriver': i19,
  'optimism': i20,
  'polygon': i21,
  'solana-devnet': i22,
  'solana': i23,
};

const mapNetworkNameToNetworkIconName = (networkName: string) => {
  let networkIconName = networkName;

  
  switch (networkName) {
    case 'hdsegwitbech32':
      networkIconName = 'bitcoin';
      break;
    case 'ethereumtestnetsepolia':
      networkIconName = 'ethereum-sepolia';
      break;
    case 'solanadevnet':
      networkIconName = 'solana-devnet';
      break;
    case 'dogecoin':
      networkIconName = 'doge';
      break;
  }

  return networkIconName;
};

export const getNetworkIcon = (networkName: string): React.FC<SvgProps> | undefined => networkIcons[mapNetworkNameToNetworkIconName(networkName.toLowerCase()) as keyof typeof networkIcons];
