"use client"

import { useState } from "react"
import jsPDF from "jspdf"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function PDFExamGeneratorPage() {
  const [school, setSchool] = useState("")
  const [city, setCity] = useState("")
  const [examContent, setExamContent] = useState("")
  const [loading, setLoading] = useState(false)

  // Helper function to split examContent for multi-line rendering
  const splitContent = (text: string) => {
    return text.split("\n").filter(Boolean)
  }

  // Generate & Download PDF
  const handleGeneratePDF = () => {
    setLoading(true)
    const doc = new jsPDF()
    let y = 20

    doc.setFontSize(18)
    doc.text(school || "SCHOOL NAME", 105, y, { align: "center" })
    y += 10
    doc.setFontSize(12)
    doc.text((city ? city + " - " : "") + "Exam Paper", 105, y, { align: "center" })
    y += 15
    
    doc.setLineWidth(0.5)
    doc.line(15, y - 8, 195, y - 8)

    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text("Instructions:", 15, y)
    y += 8
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text("- Write your answers clearly and legibly.", 15, y)
    y += 8
    doc.text("- Answer all questions.", 15, y)
    y += 12
    doc.setTextColor(10, 10, 10)

    // Render main exam content
    const contentLines = splitContent(examContent)
    contentLines.forEach((line) => {
      if (y > 275) {
        doc.addPage()
        y = 20
      }
      doc.text(line, 15, y)
      y += 8
    })

    doc.save(
      `${school || "Exam_Paper"}_${city ? city + "_" : ""}ksrlearner_exam.pdf`
    )
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <Header />

      <main className="max-w-3xl mx-auto p-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-3">
            Automatic PDF Exam Paper Generator
          </h1>
          <div className="text-slate-400 max-w-xl mx-auto">
            Paste your exam content and details, and instantly generate a professional, printable PDF for your school.
          </div>
        </div>

        <form className="space-y-6 bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg">
          <div>
            <label className="block text-slate-300 mb-2 font-semibold">School Name</label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              maxLength={100}
              value={school}
              onChange={e => setSchool(e.target.value)}
              placeholder="e.g. St. Ann's High School"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2 font-semibold">City / Town / Village</label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              maxLength={100}
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g. Penumantra, Hyderabad, etc."
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2 font-semibold">Exam Paper Content</label>
            <textarea
              className="w-full px-4 py-2 min-h-[180px] rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={examContent}
              onChange={e => setExamContent(e.target.value)}
              placeholder={`Paste the exam here...\nEg:\nQ1. What is photosynthesis?\nQ2. Explain Newton's First Law.\n...`}
              required
            />
          </div>
          <div className="text-right mt-8">
            <button
              onClick={e => {
                e.preventDefault()
                handleGeneratePDF()
              }}
              disabled={loading || !examContent}
              className="inline-flex items-center px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white disabled:bg-slate-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? (
                <span className="animate-spin mr-2 h-4 w-4 inline-block border-b-2 border-white rounded-full" />
              ) : (
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              )}
              Generate & Download PDF
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}

