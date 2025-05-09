import { useState } from "react";
import { generateContentSuggestion, enhanceContent, ContentSuggestion } from "../services/gemini-service";

interface AiContentAssistantProps {
  onApplySuggestion: (suggestion: ContentSuggestion) => void;
  onEnhanceContent: (enhancedContent: string) => void;
  currentContent: string;
}

export const AiContentAssistant = ({
  onApplySuggestion,
  onEnhanceContent,
  currentContent
}: AiContentAssistantProps) => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [suggestion, setSuggestion] = useState<ContentSuggestion | null>(null);
  const [enhancedContent, setEnhancedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSuggestion = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to generate content");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateContentSuggestion(topic);
      setSuggestion(result);
      setEnhancedContent(null);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceContent = async () => {
    if (!currentContent.trim()) {
      setError("Please enter some content to enhance");
      return;
    }

    setIsEnhancing(true);
    setError(null);
    try {
      const result = await enhanceContent(currentContent);
      setEnhancedContent(result);
      setSuggestion(null);
    } catch (err) {
      setError("Failed to enhance content. Please try again.");
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleApplySuggestion = () => {
    if (suggestion) {
      onApplySuggestion(suggestion);
      setSuggestion(null);
    }
  };

  const handleApplyEnhancement = () => {
    if (enhancedContent) {
      onEnhanceContent(enhancedContent);
      setEnhancedContent(null);
    }
  };

  return (
    <div className="bg-gray-900 border border-purple-500/30 rounded-lg p-4 mt-4">
      <h3 className="text-xl font-bold mb-3 text-purple-400">AI Content Assistant</h3>
      
      {/* Generate content section */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic for content ideas"
            className="flex-1 border border-white/10 bg-gray-800 p-2 rounded"
          />
          <button
            onClick={handleGenerateSuggestion}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
        <p className="text-sm text-gray-400">Enter a topic to get AI-powered content suggestions</p>
      </div>

      {/* Enhance content section */}
      <div className="mb-4">
        <button
          onClick={handleEnhanceContent}
          disabled={isEnhancing || !currentContent.trim()}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        >
          {isEnhancing ? "Enhancing your content..." : "Enhance my content"}
        </button>
        <p className="text-sm text-gray-400 mt-1">
          Let AI make your current content more engaging
        </p>
      </div>

      {/* Results section */}
      {error && (
        <div className="text-red-500 mb-3 text-sm p-2 bg-red-900/20 rounded">
          {error}
        </div>
      )}

      {suggestion && (
        <div className="mb-3 p-3 border border-purple-500/30 rounded bg-purple-900/20">
          <h4 className="font-bold text-purple-300 mb-1">Suggested Content:</h4>
          <div className="mb-2">
            <p className="font-bold">{suggestion.title}</p>
            <p className="text-gray-300">{suggestion.content}</p>
          </div>
          <button
            onClick={handleApplySuggestion}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Apply Suggestion
          </button>
        </div>
      )}

      {enhancedContent && (
        <div className="mb-3 p-3 border border-pink-500/30 rounded bg-pink-900/20">
          <h4 className="font-bold text-pink-300 mb-1">Enhanced Content:</h4>
          <p className="text-gray-300 mb-2">{enhancedContent}</p>
          <button
            onClick={handleApplyEnhancement}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Apply Enhancement
          </button>
        </div>
      )}
    </div>
  );
};
