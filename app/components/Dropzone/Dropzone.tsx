"use client";
import { useEffect } from "react";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import type { DragDropEvent } from "@tauri-apps/api/webview";
import type { Event } from "@tauri-apps/api/event";
import { useAtom } from "jotai";
import { filePathsAtom, filesBinaryAtom } from "../../atom";

export default function Dropzone() {
  const [filePaths, setFilePaths] = useAtom(filePathsAtom);
  const [filesBinary, setFilesBinary] = useAtom(filesBinaryAtom);

  useEffect(() => {
    // ドラッグ＆ドロップリスナーを設定する非同期関数
    const setupDragDropListener = async () => {
      // 現在のWebviewからドラッグ＆ドロップイベントをリッスン
      const unlisten = await getCurrentWebview().onDragDropEvent(
        async (event: Event<DragDropEvent>) => {
          // イベントのペイロードからタイプを取得
          const { type } = event.payload;
          // ドロップイベントの場合
          if (type === "drop") {
            // ドロップされたパスを取得
            const paths = event.payload.paths;
            // パスが配列であるか確認
            if (Array.isArray(paths)) {
              // 既存のパスに新しいパスを追加し、重複を排除
              setFilePaths((prevPaths) => {
                const allPaths = [...prevPaths, ...paths]; // 既存のパスと新しいパスを結合
                const uniquePaths = Array.from(new Set(allPaths)); // 重複を排除
                return uniquePaths; // ユニークなパスを返す
              });
            } else {
              // パスが配列でない場合のエラーメッセージ
              console.error("Dropped paths is not an array:", paths);
            }
          }
        }
      );

      // コンポーネントがアンマウントされる際にリスナーを解除するための関数を返す
      return unlisten;
    };

    // ドラッグ＆ドロップリスナーを設定
    const unlisten = setupDragDropListener();

    // クリーンアップ関数を返す
    return () => {
      unlisten.then((fn) => fn()); // Promiseからunlisten関数を呼び出す
    };
  }, []);

  return <div>Dropzone</div>;
}