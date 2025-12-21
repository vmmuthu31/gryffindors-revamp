"use client";

import { forwardRef, useRef } from "react";
import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import { cn } from "@/lib/utils";

export const MarkdownEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);

    return (
      <div className="w-full">
        <div ref={editorRef} className={cn("w-full")}>
          <MDXEditor
            {...props}
            markdown={props.markdown || ""}
            ref={ref}
            className={cn(
              "rounded-md border border-border_grey",
              props.className
            )}
            contentEditableClassName={cn(
              "min-h-32",
              props.contentEditableClassName
            )}
          />
        </div>
      </div>
    );
  }
);

MarkdownEditor.displayName = "MarkdownEditor";
