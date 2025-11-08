"use client";

import { useAutoLogout, type AutoLogoutOptions } from "@/hooks/useAutoLogout";

type Props = {
  options?: AutoLogoutOptions;
};

export default function AutoLogoutClient({ options }: Props) {
  useAutoLogout(options);
  return null;
}
