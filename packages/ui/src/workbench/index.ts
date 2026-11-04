// @skripta/ui/workbench — right panel with tabs, PDF source viewer (needs `pdfjs-dist`).
export { Workbench, SourcePane, sourceTab, type WorkbenchTab } from './Workbench'
export { PdfPage, loadPdf, setPdfWorker } from './PdfPage'
export { PdfViewer } from './PdfViewer'
export { WorkbenchProvider, useWorkbench, type WorkbenchCtx, type WorkbenchPayload, type SourceView } from './context'
