import {
  ActivityIndicator as RNActivityIndicator,
  FlatList as RNFlatList,
  Pressable as RNPressable,
  RefreshControl as RNRefreshControl,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
} from "react-native";
import { withUniwind } from "uniwind";
import { Image as ExpoImage } from "expo-image";

/** Primitivi di React Native con `className` applicato (Uniwind). */
export const View = withUniwind(RNView);
export const Text = withUniwind(RNText);
export const ScrollView = withUniwind(RNScrollView);
export const Pressable = withUniwind(RNPressable);
export const FlatList = withUniwind(RNFlatList);
export const ActivityIndicator = withUniwind(RNActivityIndicator);
export const RefreshControl = withUniwind(RNRefreshControl);
export const TextInput = withUniwind(RNTextInput);
export const TouchableOpacity = withUniwind(RNTouchableOpacity);
export const AppImage = withUniwind(ExpoImage);
