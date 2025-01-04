"use client";

import { useAtom } from "jotai";
import {
  filesBinaryAtom,
  fileInfosAtom,
  processedFilePathsAtom,
  processedFilesBinaryAtom,
  processedFileInfosAtom,
  processedFilePathsSortedAtom,
  checkboxSelectedAtom,
} from "@/app/atom";
import File from "./File";
import { useEffect } from "react";
import { getFileInfo } from "../SelectFiles/utils";
import { FileInfo } from "../SelectFiles";
import { invoke } from "@tauri-apps/api/core";

export default function ProcessedFiles() {
  const [filesBinary] = useAtom(filesBinaryAtom);
  const [fileInfos] = useAtom(fileInfosAtom);
  const [processedFilePaths] = useAtom(processedFilePathsAtom);
  const [processedFilesBinary, setProcessedFilesBinary] = useAtom(
    processedFilesBinaryAtom
  );
  const [processedFileInfos, setProcessedFileInfos] = useAtom(
    processedFileInfosAtom
  );
  const [processedFilePathsSorted, setProcessedFilePathsSorted] = useAtom(
    processedFilePathsSortedAtom
  );
  const [checkboxSelected, setCheckboxSelected] = useAtom(checkboxSelectedAtom);

  useEffect(() => {
    const processedInfos: FileInfo[] = getFileInfo(processedFilePaths);

    // fileInfosの順番に基づいてprocessedInfosを整列
    const sortedProcessedInfos = fileInfos
      .map((fileInfo) =>
        processedInfos.find(
          (processedInfo) => processedInfo.file_name === fileInfo.file_name
        )
      )
      .filter((info) => info !== undefined) as FileInfo[];

    // fileInfosの順番に基づいてprocessedFilePathsを整列
    const sortedProcessedFilePaths = fileInfos
      .map((fileInfo) =>
        processedFilePaths.find((processedFilePath) =>
          processedFilePath.includes(fileInfo.file_name)
        )
      )
      .filter((filePath) => filePath !== undefined) as string[];

    setProcessedFileInfos(sortedProcessedInfos);
    setProcessedFilePathsSorted(sortedProcessedFilePaths);
  }, [processedFilePaths]);

  useEffect(() => {
    const fetchProcessedFiles = async () => {
      const processedFilesBinary: Uint8Array[] = (await invoke(
        "get_files_binary",
        {
          filePaths: processedFilePathsSorted,
        }
      )) as Uint8Array[];
      setProcessedFilesBinary(processedFilesBinary);
    };

    fetchProcessedFiles();

    // チェックボックスの選択状態を更新
    setCheckboxSelected([]);
    processedFilePathsSorted.forEach((_, index) => {
      setCheckboxSelected((prev) => [
        ...prev,
        { index: index, checked: true },
      ]);
    });
  }, [processedFilePathsSorted]);

  return (
    <div>
      {processedFileInfos.length > 0 &&
        processedFileInfos.map((fileInfo, index) => (
          <File
            index={index}
            key={fileInfo.file_name_with_extension}
            fileInfo={fileInfo}
            binary={filesBinary[index]}
            processedFileBinary={processedFilesBinary[index]}
          />
        ))}
    </div>
  );
}