import { BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect } from '@react-navigation/native';
import { BarcodeScanningResult, PermissionStatus, useCameraPermissions } from 'expo-camera';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

import { BottomSheetModalRef } from '@/components/BottomSheet';
import { Camera } from '@/components/Camera';
import { CloseButton } from '@/components/CloseButton';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { useRealm } from '@/realm/RealmContext';
import { REALM_TYPE_WALLET, RealmWallet } from '@/realm/wallets';
import { NavigationProps, NoParamsRoute } from '@/Routes';
import { Routes } from '@/Routes';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';
import { navigationStyle } from '@/utils/navigationStyle';

import { ConnectedApps } from './components/ConnectedApps';
import { handleWalletConnectUri } from './components/handleWalletConnectUri';

import loc from '/loc';

export type ScanQRCodeParams = {
  successRoute?: NoParamsRoute;
};

const UseDeepLinkWcUri = ({ handleData, wcUri }: { handleData: (data: string) => void; wcUri: string }) => {
  let decodedWcUri: string;

  try {
    decodedWcUri = decodeURIComponent(wcUri);
  } catch (e) {
    decodedWcUri = wcUri;
  }

  if (!decodedWcUri.startsWith('wc:')) {
    decodedWcUri = 'wc:' + decodedWcUri;
  }

  useEffect(() => {
    handleData(decodedWcUri);
  }, [decodedWcUri, handleData, wcUri]);

  return null;
};

export const ConnectAppQRScanScreen = ({ navigation, route }: NavigationProps<'ConnectAppQRScan'>) => {
  const realm = useRealm();
  const { getSeed } = useSecuredKeychain();
  const { height } = useSafeAreaFrame();
  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);
  const [permissionResponse, requestPermission] = useCameraPermissions();

  const handleData = useCallback(
    (data: string) => {
      handleWalletConnectUri(data, realm, navigation.dispatch, getSeed);
      bottomSheetModalRef?.current?.close();
      if (route.params?.successRoute) {
        navigation.replace(route.params.successRoute);
      } else {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.replace(Routes.Home);
        }
      }
    },
    [navigation, realm, route.params, getSeed],
  );

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => handleData(data);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useFocusEffect(
    useCallback(() => {
      bottomSheetModalRef.current?.present();
      const ref = bottomSheetModalRef.current;
      return () => ref?.close();
    }, []),
  );

  const onPasteAddress = useCallback(async () => {
    const code = await Clipboard.getString();
    handleData(code);
  }, [handleData]);

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <FloatingBottomButtons
          primary={{
            onPress: onPasteAddress,
            text: loc.scan.paste,
            testID: 'ScanQRCode_paste_address',
          }}
        />
      </BottomSheetFooter>
    ),
    [onPasteAddress],
  );

  const insets = useSafeAreaInsets();

  const minSheetHeight = (height - insets.bottom) / 2;
  const hasDeepLinkWcUri = !!route.path;

  const initialWalletsCount = realm.objects<RealmWallet>(REALM_TYPE_WALLET).snapshot().length;
  const isOnboarding = initialWalletsCount === 0;

  if (isOnboarding) {
    navigation.navigate(Routes.Onboarding, { screen: 'OnboardingIntro' });
    return null;
  }

  return (
    <GradientScreenView insetHeaderHeight={false}>
      {!hasDeepLinkWcUri && permissionResponse?.status === PermissionStatus.DENIED ? (
        <Label style={styles.missingPermission}>{loc.scan.missingPermission}</Label>
      ) : (
        <>
          {hasDeepLinkWcUri && <UseDeepLinkWcUri wcUri={route.path} handleData={handleData} />}
          <Camera onBarcodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFill} />
          <View
            style={[
              styles.overlay,
              {
                top: insets.top,
                height: height - minSheetHeight - insets.top,
              },
            ]}>
            <Svg viewBox="0 0 330 330" width={'100%'} height={'100%'} fillOpacity={0}>
              <Path
                d="M281.063 102.266V65.1875C281.063 53.486 271.577 44 259.875 44H214.473M281.063 218.797V255.875C281.063 267.577 271.577 277.063 259.875 277.063H214.473M114.589 44H69.1875C57.486 44 48 53.486 48 65.1875V102.266M48 218.797V255.875C48 267.577 57.486 277.063 69.1875 277.063H114.589"
                stroke="#fff"
                strokeOpacity={0.5}
                strokeWidth={8}
                strokeLinecap="round"
              />
            </Svg>
          </View>
        </>
      )}
      <ConnectedApps ref={bottomSheetModalRef} minHeight={minSheetHeight} footerComponent={renderFooter} />
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    paddingTop: 24,
  },
  missingPermission: {
    marginTop: 250,
    marginHorizontal: 24,
    textAlign: 'center',
  },
});

ConnectAppQRScanScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
  headerRight: () => <CloseButton goBackOnly />,
  headerLeft: () => null,
  headerStyle: {
    backgroundColor: 'transparent',
  },
});
