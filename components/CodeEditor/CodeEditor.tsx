"use client";

import { useRef, useState } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { cn } from "@/lib/utils";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface CodeEditorProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  height?: string | number;
  readOnly?: boolean;
  theme?: "vs-dark" | "light";
  className?: string;
  showLineNumbers?: boolean;
  showMinimap?: boolean;
  onRun?: (code: string) => void;
  placeholder?: string;
}

export function CodeEditor({
  defaultValue = "",
  value,
  onChange,
  language = "javascript",
  height = "400px",
  readOnly = false,
  theme = "vs-dark",
  className,
  showLineNumbers = true,
  showMinimap = false,
  onRun,
  placeholder,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChange: OnChange = (value) => {
    onChange?.(value);
  };

  const handleCopy = async () => {
    const code = editorRef.current?.getValue() || "";
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    editorRef.current?.setValue(defaultValue);
    onChange?.(defaultValue);
  };

  const handleRun = () => {
    const code = editorRef.current?.getValue() || "";
    onRun?.(code);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden border border-gray-700",
        isFullscreen && "fixed inset-4 z-50",
        className
      )}
    >
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-sm ml-2">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          {onRun && (
            <button
              onClick={handleRun}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <Editor
        height={isFullscreen ? "calc(100vh - 120px)" : height}
        defaultLanguage={language}
        defaultValue={defaultValue}
        value={value}
        theme={theme}
        onMount={handleEditorDidMount}
        onChange={handleChange}
        options={{
          readOnly,
          minimap: { enabled: showMinimap },
          lineNumbers: showLineNumbers ? "on" : "off",
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          folding: true,
          lineDecorationsWidth: 10,
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          tabSize: 2,
          placeholder: placeholder,
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="animate-spin w-8 h-8 border-2 border-gray-500 border-t-white rounded-full" />
          </div>
        }
      />
    </div>
  );
}

interface CodeViewerProps {
  code: string;
  language?: string;
  height?: string | number;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeViewer({
  code,
  language = "javascript",
  height = "300px",
  className,
  showLineNumbers = true,
}: CodeViewerProps) {
  return (
    <CodeEditor
      value={code}
      language={language}
      height={height}
      readOnly={true}
      className={className}
      showLineNumbers={showLineNumbers}
      showMinimap={false}
    />
  );
}
