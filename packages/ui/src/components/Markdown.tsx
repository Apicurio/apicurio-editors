import {
  Button,
  ClipboardCopy,
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Content,
  ContentVariants,
  Form,
  FormGroup,
  List,
  ListComponent,
  ListItem,
  OrderType,
  Title,
} from "@patternfly/react-core";
import { useState } from "react";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import { JSX } from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  CodeEditor,
  CodeEditorControl,
  Language,
} from "@patternfly/react-code-editor";
import { CheckIcon } from "@patternfly/react-icons";
import { useDarkMode } from "./isDarkMode.ts";
import { noop } from "lodash";
import IntrinsicElements = JSX.IntrinsicElements;

export function Markdown({
  children,
  label,
  editing = false,
  searchTerm,
  onChange,
}: {
  children: string;
  label?: string;
  onChange?: (value: string) => void;
  searchTerm?: string;
  editing?: boolean;
}) {
  const darkMode = useDarkMode();
  const highlightedMarkdown = searchTerm
    ? highlightText(children, searchTerm)
    : children;
  return !editing ? (
    <ReactMarkdown
      components={{
        h1: H1Md,
        h2: H2Md,
        h3: H3Md,
        h4: H4Md,
        h5: H5Md,
        h6: H6Md,
        p: TextMd,
        code: CodeBlockMd,
        ul: UnorderedListMd,
        ol: OrderedListMd,
        li: ListItemMd,
      }}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className={"pf-v6-c-content"}
    >
      {highlightedMarkdown}
    </ReactMarkdown>
  ) : (
    <Form onSubmit={noop}>
      <FormGroup type="text" fieldId="edit-value" label={label}>
        {children ? (
          <CodeEditor
            customControls={[
              <CodeEditorControl
                key={"save"}
                icon={<CheckIcon />}
                aria-label="Save changes"
                tooltipProps={{ content: "Save changes" }}
                onClick={() => {}}
                // isDisabled={isDisabled || source === code}
              />,
            ]}
            isLanguageLabelVisible={false}
            isLineNumbersVisible={false}
            // onChange={(code) => setCode(code)}
            language={Language.markdown}
            height={"sizeToFit"}
            // onEditorDidMount={onEditorDidMount}
            isDarkTheme={darkMode}
            code={children}
            onChange={onChange ?? (() => {})}
          />
        ) : (
          <Button variant={"tertiary"}>Add a {label}</Button>
        )}
      </FormGroup>
    </Form>
  );
}

const highlightText = (markdown: string, searchTerm: string) => {
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return markdown.replace(regex, "<mark>$1</mark>");
};

function TextMd({ children, ...props }: IntrinsicElements["p"] & ExtraProps) {
  return (
    <Content component={ContentVariants.p} {...props}>
      {children}
    </Content>
  );
}

function CodeBlockMd({ children }: IntrinsicElements["code"] & ExtraProps) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");
  const isMultiline = code.split("\n").length > 1;

  const onClick = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  const actions = (
    <CodeBlockAction>
      <ClipboardCopyButton
        id="basic-copy-button"
        textId="code-content"
        aria-label="Copy to clipboard"
        onClick={onClick}
        exitDelay={copied ? 1500 : 600}
        maxWidth="110px"
        variant="plain"
        onTooltipHidden={() => setCopied(false)}
      >
        {copied ? "Successfully copied to clipboard!" : "Copy to clipboard"}
      </ClipboardCopyButton>
    </CodeBlockAction>
  );

  return isMultiline ? (
    <CodeBlock actions={actions}>
      <CodeBlockCode id="code-content">{code}</CodeBlockCode>
    </CodeBlock>
  ) : (
    <ClipboardCopy
      hoverTip="Copy"
      clickTip="Copied"
      variant="inline-compact"
      isCode
    >
      {code}
    </ClipboardCopy>
  );
}

function ListItemMd({ children }: IntrinsicElements["li"] & ExtraProps) {
  return <ListItem>{children}</ListItem>;
}

function OrderedListMd({ children }: IntrinsicElements["ol"] & ExtraProps) {
  return (
    <List component={ListComponent.ol} type={OrderType.number}>
      {children}
    </List>
  );
}

function UnorderedListMd({ children }: IntrinsicElements["ul"] & ExtraProps) {
  return <List>{children}</List>;
}

function H1Md({ children }: IntrinsicElements["h1"] & ExtraProps) {
  return <Title headingLevel={"h1"}>{children}</Title>;
}
function H2Md({ children }: IntrinsicElements["h2"] & ExtraProps) {
  return <Title headingLevel={"h2"}>{children}</Title>;
}
function H3Md({ children }: IntrinsicElements["h3"] & ExtraProps) {
  return <Title headingLevel={"h3"}>{children}</Title>;
}
function H4Md({ children }: IntrinsicElements["h4"] & ExtraProps) {
  return <Title headingLevel={"h4"}>{children}</Title>;
}
function H5Md({ children }: IntrinsicElements["h5"] & ExtraProps) {
  return <Title headingLevel={"h5"}>{children}</Title>;
}
function H6Md({ children }: IntrinsicElements["h6"] & ExtraProps) {
  return <Title headingLevel={"h6"}>{children}</Title>;
}
