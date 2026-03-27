import BaseLayout from "@/components/base-layout";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children?: ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>;
}
