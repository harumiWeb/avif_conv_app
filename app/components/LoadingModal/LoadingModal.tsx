"use client";
import { useAtom } from "jotai";
import { isProcessingAtom , extensionTypeAtom} from "@/app/atom";
import { Spin } from "antd";

export default function LoadingModal() {
  const [isProcessing] = useAtom(isProcessingAtom);
  const [extensionType] = useAtom(extensionTypeAtom);
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 top-0 bg-black/50 flex justify-center items-center z-50 ${isProcessing ? "block" : "hidden"}`}
    >
      <div  className="bg-white rounded-lg px-6 py-6 min-w-[300px] flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <Spin size="large"></Spin>
          <p className="text-lg font-medium text-[#00b96b]">Processing...</p>
        </div>
        <p className="text-sm text-gray-500 text-center">
        Please do not close this window.
        <br />
        {extensionType === "avif" ? "There may be delays when converting to AVIF." : ""}
        </p>
      </div>
    </div>
  );
}
