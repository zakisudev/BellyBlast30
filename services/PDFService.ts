import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import type { ServiceResult } from "@/types/models";

export class PDFService {
  static async exportSummary(title: string, sections: string[]): Promise<ServiceResult<string>> {
    try {
      const html = `
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; padding: 24px;">
            <h1>${title}</h1>
            ${sections.map((section) => `<p>${section}</p>`).join("")}
          </body>
        </html>
      `;

      const result = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, { mimeType: "application/pdf" });
      }

      return { ok: true, data: result.uri };
    } catch {
      return {
        ok: false,
        error: {
          code: "unknown_error",
          message: "Unable to generate PDF export."
        }
      };
    }
  }
}
