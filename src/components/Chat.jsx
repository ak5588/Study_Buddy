import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ScrollArea } from './ui/ScrollArea';
import { Message } from './Message';
import { summarizeDocument } from '../lib/summarizer';
import { FileUploader } from './FileUploader';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: input }]);
      setInput('');
      setIsLoading(true);
      try {
        const summary = await summarizeDocument(input);
        setMessages((prev) => [...prev, { role: 'assistant', content: summary }]);
        setContext(summary);
      } catch {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'An error occurred while summarizing. Please try again.' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = async (summary) => {
    setMessages((prev) => [...prev, { role: 'assistant', content: summary }]);
    setContext(summary);
  };

  const handleQuestion = async () => {
    if (input.trim() && context) {
      setMessages((prev) => [...prev, { role: 'user', content: input }]);
      const question = input;
      setInput('');
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5002/question_answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ context, question }),
        });
        const data = await response.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
      } catch {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'An error occurred while answering the question. Please try again.' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {messages.length > 0 && (
        <ScrollArea className="flex-grow p-4 bg-gray-800 text-white rounded-lg shadow-md overflow-y-auto">
          {messages.map((message, index) => (
            <Message key={index} role={message.role} content={message.content} />
          ))}
        </ScrollArea>
      )}
      <div className="p-4 flex items-center gap-4 fixed bottom-0 left-0 right-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="   Type your message..."
          disabled={isLoading}
          className="flex-grow bg-black text-white border-none rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-12"
        />
        <Button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 text-lg">
          Summarize
        </Button>
        <Button onClick={handleQuestion} disabled={isLoading || !context} className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 text-lg">
          Ask
        </Button>
        <FileUploader onFileUpload={handleFileUpload} />
      </div>
    </div>
  );
}

export default Chat;