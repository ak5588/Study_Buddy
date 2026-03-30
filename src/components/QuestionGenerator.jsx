import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ScrollArea } from './ui/ScrollArea';
import { ArrowLeft, UploadCloud, Download, X } from 'lucide-react';
import { generateQuestions } from '../lib/api';

const API_BASE_URL = "http://localhost:5002";

export function QuestionGenerator() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [textInput, setTextInput] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [numQuestions, setNumQuestions] = useState(3);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileType, setFileType] = useState(null);
  const [inputMode, setInputMode] = useState('text'); // 'text', 'file', 'url'

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.name.split('.').pop().toLowerCase());
      await extractTextFromFile(selectedFile);
    }
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileType(droppedFile.name.split('.').pop().toLowerCase());
      await extractTextFromFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const extractTextFromFile = async (fileToExtract) => {
    setIsExtracting(true);
    try {
      const formData = new FormData();
      formData.append('file', fileToExtract);

      // Use extract_text endpoint to get raw text (not summarized)
      const response = await fetch(`${API_BASE_URL}/extract_text`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data?.text) {
        setExtractedText(data.text);
      } else {
        throw new Error(data?.error || 'Failed to extract text');
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      alert(`Error extracting text: ${error.message}`);
      setFile(null);
      setExtractedText('');
    } finally {
      setIsExtracting(false);
    }
  };

  const extractTextFromUrl = async () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }

    setIsExtracting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();
      if (data?.summary) {
        // For URL, we get summary which contains extracted text
        setExtractedText(data.summary);
      } else {
        throw new Error(data?.error || 'Failed to extract text from URL');
      }
    } catch (error) {
      console.error('Error extracting text from URL:', error);
      alert(`Error extracting text: ${error.message}`);
      setExtractedText('');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerateQuestions = async () => {
    let textContent = '';
    
    // Get text based on input mode
    if (inputMode === 'text') {
      textContent = textInput.trim();
    } else if (inputMode === 'file') {
      textContent = extractedText;
    } else if (inputMode === 'url') {
      textContent = extractedText;
    }

    if (!textContent) {
      alert('Please provide text, upload a file, or enter a URL');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate multiple questions at once (like Streamlit)
      const response = await fetch(`${API_BASE_URL}/question_answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          context: textContent,
          num_questions: numQuestions
        }),
      });

      const data = await response.json();
      if (data?.question_list && Array.isArray(data.question_list)) {
        // Use the array of questions
        setGeneratedQuestions(data.question_list.slice(0, numQuestions));
      } else if (data?.questions) {
        // Handle single question or string format
        if (Array.isArray(data.questions)) {
          setGeneratedQuestions(data.questions.slice(0, numQuestions));
        } else {
          // If it's a string, try to split it
          const questions = data.questions.split(/\n+/).filter(q => q.trim().length > 10);
          setGeneratedQuestions(questions.slice(0, numQuestions));
        }
      } else {
        throw new Error(data?.error || 'No questions generated');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert(`Error generating questions: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedQuestions.length === 0) return;

    const content = generatedQuestions
      .map((q, i) => `Q${i + 1}: ${q}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeFile = () => {
    setFile(null);
    setExtractedText('');
    setFileType(null);
  };

  const clearAll = () => {
    setFile(null);
    setTextInput('');
    setUrl('');
    setExtractedText('');
    setGeneratedQuestions([]);
    setFileType(null);
  };

  const getCurrentText = () => {
    if (inputMode === 'text') return textInput.trim();
    return extractedText;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Button
        onClick={() => navigate('/')}
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 text-white hover:bg-zinc-800"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 mt-12">
          AI Question Generator
        </h1>

        {/* Input Mode Selection */}
        <div className="mb-6 flex gap-4 justify-center">
          <Button
            onClick={() => { setInputMode('text'); clearAll(); }}
            className={inputMode === 'text' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-zinc-800 hover:bg-zinc-700'}
          >
            Text Input
          </Button>
          <Button
            onClick={() => { setInputMode('file'); clearAll(); }}
            className={inputMode === 'file' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-zinc-800 hover:bg-zinc-700'}
          >
            Upload File
          </Button>
          <Button
            onClick={() => { setInputMode('url'); clearAll(); }}
            className={inputMode === 'url' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-zinc-800 hover:bg-zinc-700'}
          >
            URL
          </Button>
        </div>

        {/* Text Input Mode */}
        {inputMode === 'text' && (
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3">
              Enter Text:
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-48 p-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white resize-none focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* File Upload Mode */}
        {inputMode === 'file' && (
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3">
              Upload a PDF or DOCX file
            </label>
          
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-zinc-700 rounded-lg p-12 text-center bg-zinc-900 hover:border-zinc-600 transition-colors"
          >
            <UploadCloud className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
            <p className="text-zinc-400 mb-4">Drag and drop file here</p>
            <p className="text-sm text-zinc-500 mb-4">
              Limit 200MB per file • PDF, DOCX
            </p>
            <label className="cursor-pointer inline-block">
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
                Browse files
              </span>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.docx"
                className="hidden"
              />
            </label>
          </div>

            {file && (
              <div className="mt-4 flex items-center justify-between bg-zinc-800 p-3 rounded-lg">
                <span className="text-sm">
                  {file.name} ({((file.size / 1024).toFixed(1))} KB)
                </span>
                <button
                  onClick={removeFile}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* URL Input Mode */}
        {inputMode === 'url' && (
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3">
              Enter URL:
            </label>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="flex-1 bg-zinc-900 border-zinc-700 text-white"
                onKeyPress={(e) => e.key === 'Enter' && extractTextFromUrl()}
              />
              <Button
                onClick={extractTextFromUrl}
                disabled={!url.trim() || isExtracting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Extract
              </Button>
            </div>
          </div>
        )}

        {/* Extracted Text Section */}
        {((inputMode === 'file' && extractedText) || (inputMode === 'url' && extractedText)) && (
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3">
              Extracted Text:
            </label>
            <ScrollArea className="h-64 border-2 border-red-500 rounded-lg p-4 bg-zinc-900">
              <p className="text-sm whitespace-pre-wrap">{extractedText}</p>
            </ScrollArea>
          </div>
        )}

        {/* Number of Questions Slider */}
        {(getCurrentText() || inputMode === 'text') && (
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3">
              Number of Questions
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">1</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((numQuestions - 1) / 9) * 100}%, #3f3f46 ${((numQuestions - 1) / 9) * 100}%, #3f3f46 100%)`
                  }}
                />
              </div>
              <span className="text-sm text-zinc-400">10</span>
              <div className="w-16 text-center">
                <span className="text-2xl font-bold text-red-500">{numQuestions}</span>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        {getCurrentText() && (
          <div className="mb-6">
            <Button
              onClick={handleGenerateQuestions}
              disabled={isGenerating || !getCurrentText()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating Questions...' : 'Generate Questions'}
            </Button>
          </div>
        )}

        {/* Generated Questions Section */}
        {generatedQuestions.length > 0 && (
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3">
              Generated Questions:
            </label>
            <div className="space-y-3">
              {generatedQuestions.map((question, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 p-4 rounded-lg border border-zinc-700"
                >
                  <p className="text-white">
                    <span className="font-bold text-red-500">Q{index + 1}:</span>{' '}
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download Button */}
        {generatedQuestions.length > 0 && (
          <Button
            onClick={handleDownload}
            className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Questions
          </Button>
        )}

        {isExtracting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-zinc-800 p-6 rounded-lg">
              <p className="text-white">Extracting text from file...</p>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}

