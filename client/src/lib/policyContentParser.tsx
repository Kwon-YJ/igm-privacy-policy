/*
 * Shared lightweight markdown-ish parser for privacy policy content.
 * Supports: pipe tables, "- " bullet lists, numbered lists, **bold**,
 * and "**가. 제목**" style headings.
 */

export function parseContent(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];
  let inTable = false;
  let listItems: string[] = [];
  let inList = false;
  let numberedItems: string[] = [];
  let inNumberedList = false;

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-3 ml-5 space-y-1.5">
          {listItems.map((item, i) => (
            <li key={i} className="text-[15px] leading-relaxed text-foreground/85 list-disc">
              {parseBold(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushNumberedList = () => {
    if (inNumberedList && numberedItems.length > 0) {
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-3 ml-5 space-y-1.5 list-decimal">
          {numberedItems.map((item, i) => (
            <li key={i} className="text-[15px] leading-relaxed text-foreground/85">
              {parseBold(item)}
            </li>
          ))}
        </ol>
      );
      numberedItems = [];
      inNumberedList = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableHeaders.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="my-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60">
                {tableHeaders.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 text-left font-semibold text-foreground/90 border-b border-border">
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 1 ? "bg-muted/30" : ""}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-foreground/80 border-b border-border/50">
                      {parseBold(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      flushList();
      flushNumberedList();
      const cells = line.split("|").filter((c) => c.trim() !== "");
      if (!inTable) {
        tableHeaders = cells.map((c) => c.trim());
        inTable = true;
        continue;
      }
      // Skip separator row
      if (cells.every((c) => /^[-:\s]+$/.test(c.trim()))) continue;
      tableRows.push(cells.map((c) => c.trim()));
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Numbered list
    if (/^\d+\.\s/.test(line.trim())) {
      flushList();
      flushTable();
      inNumberedList = true;
      numberedItems.push(line.trim().replace(/^\d+\.\s/, ""));
      continue;
    } else if (inNumberedList && line.trim() === "") {
      flushNumberedList();
      continue;
    }

    // Bullet list
    if (line.trim().startsWith("- ")) {
      flushTable();
      flushNumberedList();
      inList = true;
      listItems.push(line.trim().replace(/^- /, ""));
      continue;
    } else if (inList && line.trim() === "") {
      flushList();
      continue;
    }

    // Bold heading (e.g., **가. 회원 가입 및 관리**)
    if (line.trim().startsWith("**") && line.trim().endsWith("**")) {
      flushList();
      flushNumberedList();
      flushTable();
      const text = line.trim().replace(/\*\*/g, "");
      elements.push(
        <h4 key={`h4-${elements.length}`} className="mt-5 mb-2 text-[15px] font-bold text-foreground/90">
          {text}
        </h4>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      flushList();
      flushNumberedList();
      continue;
    }

    // Regular paragraph
    flushList();
    flushNumberedList();
    flushTable();
    elements.push(
      <p key={`p-${elements.length}`} className="my-2 text-[15px] leading-[1.8] text-foreground/80">
        {parseBold(line)}
      </p>
    );
  }

  flushList();
  flushNumberedList();
  flushTable();

  return elements;
}

export function parseBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground/95">
          {part.replace(/\*\*/g, "")}
        </strong>
      );
    }
    return part;
  });
}