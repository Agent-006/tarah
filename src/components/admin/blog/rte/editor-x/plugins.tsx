import { useState } from "react"

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { ContentEditable } from "@/components/admin/blog/rte/editor/editor-ui/content-editable"
import { ActionsPlugin } from "@/components/admin/blog/rte/editor/plugins/actions/actions-plugin"
import { ClearEditorActionPlugin } from "@/components/admin/blog/rte/editor/plugins/actions/clear-editor-plugin"
import { AutoLinkPlugin } from "@/components/admin/blog/rte/editor/plugins/auto-link-plugin"
import { AutocompletePlugin } from "@/components/admin/blog/rte/editor/plugins/autocomplete-plugin"
import { CodeActionMenuPlugin } from "@/components/admin/blog/rte/editor/plugins/code-action-menu-plugin"
import { CodeHighlightPlugin } from "@/components/admin/blog/rte/editor/plugins/code-highlight-plugin"
import { ComponentPickerMenuPlugin } from "@/components/admin/blog/rte/editor/plugins/component-picker-menu-plugin"
import { ContextMenuPlugin } from "@/components/admin/blog/rte/editor/plugins/context-menu-plugin"
import { DraggableBlockPlugin } from "@/components/admin/blog/rte/editor/plugins/draggable-block-plugin"
import { AutoEmbedPlugin } from "@/components/admin/blog/rte/editor/plugins/embeds/auto-embed-plugin"
import { TwitterPlugin } from "@/components/admin/blog/rte/editor/plugins/embeds/twitter-plugin"
import { YouTubePlugin } from "@/components/admin/blog/rte/editor/plugins/embeds/youtube-plugin"
import { EmojiPickerPlugin } from "@/components/admin/blog/rte/editor/plugins/emoji-picker-plugin"
import { EmojisPlugin } from "@/components/admin/blog/rte/editor/plugins/emojis-plugin"
import { FloatingLinkEditorPlugin } from "@/components/admin/blog/rte/editor/plugins/floating-link-editor-plugin"
import { FloatingTextFormatToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/floating-text-format-plugin"
import { LinkPlugin } from "@/components/admin/blog/rte/editor/plugins/link-plugin"
import { ListMaxIndentLevelPlugin } from "@/components/admin/blog/rte/editor/plugins/list-max-indent-level-plugin"
import { AlignmentPickerPlugin } from "@/components/admin/blog/rte/editor/plugins/picker/alignment-picker-plugin"
import { BulletedListPickerPlugin } from "@/components/admin/blog/rte/editor/plugins/picker/bulleted-list-picker-plugin"
import { CodePickerPlugin } from "@/components/admin/blog/rte/editor/plugins/picker/code-picker-plugin"
import { DividerPickerPlugin } from "@/components/admin/blog/rte/editor/plugins/picker/divider-picker-plugin"
import { EmbedsPickerPlugin } from "@/components/admin/blog/rte/editor/plugins/picker/embeds-picker-plugin"
import { HeadingPickerPlugin } from "@/components/admin/blog/rte/editor/plugins/picker/heading-picker-plugin"
import { NumberedListPickerPlugin } from "@/components/admin/blog/rte/editor/plugins/picker/numbered-list-picker-plugin"
import { ParagraphPickerPlugin } from "@/components/admin/blog/rte/editor/plugins/picker/paragraph-picker-plugin"
import { QuotePickerPlugin } from "@/components/admin/blog/rte/editor/plugins/picker/quote-picker-plugin"
import { TabFocusPlugin } from "@/components/admin/blog/rte/editor/plugins/tab-focus-plugin"
import { BlockFormatDropDown } from "@/components/admin/blog/rte/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatBulletedList } from "@/components/admin/blog/rte/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCodeBlock } from "@/components/admin/blog/rte/editor/plugins/toolbar/block-format/format-code-block"
import { FormatHeading } from "@/components/admin/blog/rte/editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/components/admin/blog/rte/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatParagraph } from "@/components/admin/blog/rte/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatQuote } from "@/components/admin/blog/rte/editor/plugins/toolbar/block-format/format-quote"
import { BlockInsertPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/block-insert-plugin"
import { InsertEmbeds } from "@/components/admin/blog/rte/editor/plugins/toolbar/block-insert/insert-embeds"
import { ClearFormattingToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/clear-formatting-toolbar-plugin"
import { CodeLanguageToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/code-language-toolbar-plugin"
import { ElementFormatToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/element-format-toolbar-plugin"
import { FontBackgroundToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/font-background-toolbar-plugin"
import { FontColorToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/font-color-toolbar-plugin"
import { FontFamilyToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/font-family-toolbar-plugin"
import { FontFormatToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/font-format-toolbar-plugin"
import { FontSizeToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/font-size-toolbar-plugin"
import { HistoryToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/history-toolbar-plugin"
import { LinkToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/link-toolbar-plugin"
import { SubSuperToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/subsuper-toolbar-plugin"
import { ToolbarPlugin } from "@/components/admin/blog/rte/editor/plugins/toolbar/toolbar-plugin"
import { Separator } from "@/components/ui/separator"

const placeholder = "Press / for commands..."

export function Plugins({}) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
            <HistoryToolbarPlugin />
            <Separator orientation="vertical" className="h-8" />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCodeBlock />
              <FormatQuote />
            </BlockFormatDropDown>
            {blockType === "code" ? (
              <CodeLanguageToolbarPlugin />
            ) : (
              <>
                <FontFamilyToolbarPlugin />
                <FontSizeToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <FontFormatToolbarPlugin format="bold" />
                <FontFormatToolbarPlugin format="italic" />
                <FontFormatToolbarPlugin format="underline" />
                <FontFormatToolbarPlugin format="strikethrough" />
                <Separator orientation="vertical" className="h-8" />
                <SubSuperToolbarPlugin />
                <LinkToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <ClearFormattingToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <FontColorToolbarPlugin />
                <FontBackgroundToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <ElementFormatToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <BlockInsertPlugin>
                  <InsertEmbeds />
                </BlockInsertPlugin>
              </>
            )}
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-[830px] min-h-72 min-h-full overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <ClickableLinkPlugin />
        <HorizontalRulePlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <HashtagPlugin />
        <HistoryPlugin />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        <EmojisPlugin />
        <AutoEmbedPlugin />
        <TwitterPlugin />
        <YouTubePlugin />
        <CodeHighlightPlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
        <TabFocusPlugin />
        <AutocompletePlugin />
        <AutoLinkPlugin />
        <LinkPlugin />

        <ComponentPickerMenuPlugin
          baseOptions={[
            ParagraphPickerPlugin(),
            HeadingPickerPlugin({ n: 1 }),
            HeadingPickerPlugin({ n: 2 }),
            HeadingPickerPlugin({ n: 3 }),
            NumberedListPickerPlugin(),
            BulletedListPickerPlugin(),
            QuotePickerPlugin(),
            CodePickerPlugin(),
            DividerPickerPlugin(),
            EmbedsPickerPlugin({ embed: "tweet" }),
            EmbedsPickerPlugin({ embed: "youtube-video" }),
            AlignmentPickerPlugin({ alignment: "left" }),
            AlignmentPickerPlugin({ alignment: "center" }),
            AlignmentPickerPlugin({ alignment: "right" }),
            AlignmentPickerPlugin({ alignment: "justify" }),
          ]}
        />

        <ContextMenuPlugin />
        <EmojiPickerPlugin />

        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
        <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />

        <ListMaxIndentLevelPlugin />
      </div>
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-end">
            <>
              <ClearEditorActionPlugin />
              <ClearEditorPlugin />
            </>
          </div>
        </div>
      </ActionsPlugin>
    </div>
  )
}
