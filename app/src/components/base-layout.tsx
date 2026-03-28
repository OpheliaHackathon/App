import { Slot } from "expo-router";

/**
 * Involucro radice per gruppi di route.
 * L’aspetto della status bar va impostato in nativo (es. iOS `Info.plist`: `UIStatusBarStyle`, `UIViewControllerBasedStatusBarAppearance`).
 */
export default function BaseLayout({
  children = <Slot />,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
