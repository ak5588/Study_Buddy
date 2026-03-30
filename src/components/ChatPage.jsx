import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ScrollArea } from './ui/ScrollArea';
import { ArrowLeft, Send, UploadCloud } from 'lucide-react';
import { summarizeText, generateQuiz, generateQuestions } from '../lib/api';
const API_BASE_URL = "http://localhost:5002";


export function ChatPage() {
  const { service } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState(null);
  const [pageRange, setPageRange] = useState({ start: 1, end: 1 });

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `Welcome to the ${service} service! How can I help you today?`
      }
    ]);
  }, [service]);

  // Helper function to extract text from file/url for non-summary services
  const extractTextFromSource = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      if (fileType === 'pdf' || fileType === 'pptx') {
        formData.append('start_page', pageRange.start);
        formData.append('end_page', pageRange.end);
      }
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data?.summary) {
        return data.summary; // Use summary as extracted text
      }
      throw new Error(data?.error || 'Failed to extract text from file');
    } else if (url) {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (data?.summary) {
        return data.summary; // Use summary as extracted text
      }
      throw new Error(data?.error || 'Failed to extract text from URL');
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() && !file && !url) return;

    setIsLoading(true);

    try {
      let data;
      let textContent = input.trim();
      
      // Extract text from file/URL if provided
      if (!textContent && (file || url)) {
        textContent = await extractTextFromSource();
        if (!textContent) {
          throw new Error('Failed to extract text from source');
        }
        setMessages(prev => [
          ...prev,
          { role: 'user', content: file ? `Uploaded file: ${file.name}` : `URL: ${url}` }
        ]);
      } else if (textContent) {
        setMessages(prev => [
          ...prev,
          { role: 'user', content: textContent }
        ]);
      }

      // Route to correct endpoint based on service
      if (service === 'summary') {
        // Summary service
        if (file) {
        const formData = new FormData();
        formData.append('file', file);
        if (fileType === 'pdf' || fileType === 'pptx') {
          formData.append('start_page', pageRange.start);
          formData.append('end_page', pageRange.end);
        }
        const response = await fetch(`${API_BASE_URL}/summarize`, {
          method: 'POST',
          body: formData,
        });
        data = await response.json();
      } else if (url) {
        const response = await fetch(`${API_BASE_URL}/summarize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });
        data = await response.json();
        } else {
          data = await summarizeText(textContent);
      }

      if (data?.summary) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.summary }
        ]);
      } else {
          throw new Error(data?.error || 'Error generating summary');
        }
        
      } else if (service === 'quiz') {
        // Quiz service - use quiz model
        data = await generateQuiz(textContent);
        
        if (data?.question || data?.raw_output) {
          const quizContent = data.question 
            ? `Question: ${data.question}\n\nOptions:\n${data.options?.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n') || 'N/A'}\n\nCorrect Answer: ${data.correct_answer || 'See raw output'}`
            : `Generated Quiz:\n${data.raw_output}`;
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: quizContent }
          ]);
        } else {
          throw new Error(data?.error || 'Error generating quiz');
        }
        
      } else if (service === 'questions') {
        // Question generation service - use question model
        data = await generateQuestions(textContent);
        
        if (data?.questions) {
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: `Generated Questions:\n\n${data.questions}` }
          ]);
        } else if (data?.answer) {
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: `Answer: ${data.answer}` }
          ]);
        } else {
          throw new Error(data?.error || 'Error generating questions');
        }
        
      } else {
        throw new Error(`Unknown service: ${service}`);
      }
      
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Error: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
      setUrl('');
      setFile(null);
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.name.split('.').pop().toLowerCase();
      setFileType(type);
      setFile(file);
      setMessages(prev => [
        ...prev,
        { role: 'user', content: `Uploaded file: ${file.name}` }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Button
        onClick={() => navigate('/')}
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 text-white hover:bg-zinc-800"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8 text-center">
          {service.charAt(0).toUpperCase() + service.slice(1)} Service
        </h1>

        <div className="w-full flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' ? 'bg-blue-600' : 'bg-zinc-800'}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-zinc-800 rounded-lg p-3">Processing...</div>
              </div>
            )}
          </ScrollArea>

          <div className="space-y-4">
            {(fileType === 'pdf' || fileType === 'pptx') && (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={pageRange.start}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    setPageRange(prev => ({ 
                      ...prev, 
                      start: value,
                      end: Math.max(value, prev.end)
                    }));
                  }}
                  placeholder="Start page"
                  className="w-1/2"
                  min="1"
                />
                <Input
                  type="number"
                  value={pageRange.end}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    setPageRange(prev => ({ 
                      ...prev, 
                      end: value,
                      start: Math.min(value, prev.start)
                    }));
                  }}
                  placeholder="End page"
                  className="w-1/2"
                  min="1"
                />
              </div>
            )}


            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message or URL..."
                className="w-full bg-zinc-900 border-zinc-700 text-white h-12 pr-12"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() && !file && !url}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-2 p-3 bg-zinc-800 rounded-lg">
                <label className="text-sm font-medium text-zinc-300">
                  Upload File (PDF, DOCX, PPTX)
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer flex items-center gap-2 p-2 bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors flex-1">
                    <UploadCloud className="h-5 w-5" />
                    <span className="text-sm">
                      {file ? file.name : 'Choose a file...'}
                    </span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.docx,.pptx"
                    />
                  </label>
                  <Button
                    onClick={handleSend}
                    disabled={!file}
                    className="bg-transparent hover:bg-transparent p-2"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>

              </div>

              <div className="flex flex-col gap-2 p-3 bg-zinc-800 rounded-lg">
                <label className="text-sm font-medium text-zinc-300">
                  Or Enter URL
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-zinc-700 border-zinc-600 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!url}
                    className="bg-transparent hover:bg-transparent p-2"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
