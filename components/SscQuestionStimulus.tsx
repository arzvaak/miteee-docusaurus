import { MathText } from "@/components/MathText";
import type { SscCglQuestionStimulus } from "@/lib/exam-types";

export function SscQuestionStimulus({ stimulus }: { stimulus?: SscCglQuestionStimulus }) {
  if (!stimulus || stimulus.type !== "table") return null;

  return (
    <figure className="ssc-question-stimulus">
      {stimulus.caption ? <figcaption><MathText text={stimulus.caption} /></figcaption> : null}
      {stimulus.reconstructionNote ? <p className="ssc-question-stimulus-note"><MathText text={stimulus.reconstructionNote} /></p> : null}
      <div className="ssc-question-table-scroll">
        <table>
          <thead>
            <tr>
              {stimulus.columns.map((column) => <th scope="col" key={column}><MathText text={column} /></th>)}
            </tr>
          </thead>
          <tbody>
            {stimulus.rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}-${row.join("|")}`}>
                {stimulus.columns.map((_, columnIndex) => (
                  <td key={`${rowIndex}-${columnIndex}`}>
                    <MathText text={row[columnIndex] ?? ""} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
