"use client";

import SettingsMenu from "./components/SettingsMenu/SettingsMenu";
import LoadingModal from "./components/LoadingModal/LoadingModal";
import InputTab from "./components/InputTab/InputTab";
import OutputTab from "./components/OutputTab/OutputTab";
import InputTabButton, {
  OutputTabButton,
} from "./components/TabButton/TabButton";
import { LicenseDialog } from "./components/Dialog/Dialog";

export default function Home() {
  return (
    <>
      <LoadingModal />
      <LicenseDialog />
      <div className="flex w-screen h-[calc(100vh-30px)] relative">
        <div className="min-w-[230px] h-[calc(100vh-30px)]">
          <SettingsMenu />
        </div>
        <div className="flex-1 min-h-[calc(100vh-30px)] bg-gray-200 pt-[36px] relative">
          <InputTabButton />
          <OutputTabButton />
          <InputTab />
          <OutputTab />
        </div>
      </div>
    </>
  );
}
