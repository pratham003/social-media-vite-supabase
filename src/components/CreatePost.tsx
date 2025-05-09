import { ChangeEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { Community, fetchCommunities } from "./CommunityList";
import { AiContentAssistant } from "./AiContentAssistant";
import { ContentSuggestion } from "../services/gemini-service";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [communityId, setCommunityId] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleApplySuggestion = (suggestion: ContentSuggestion) => {
    setTitle(suggestion.title);
    setContent(suggestion.content);
  };

  const handleEnhanceContent = (enhancedContent: string) => {
    setContent(enhancedContent);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-2 font-medium">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            rows={5}
            required
          />
        </div>

        <div>
          <label> Select Community</label>
          <select
            id="community"
            onChange={handleCommunityChange}
            className="w-full bg-gray-800 text-white border border-white/10 p-2 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value={""}> -- Choose a Community -- </option>
            {communities?.map((community, key) => (
              <option key={key} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="image" className="block mb-2 font-medium">
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-200"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer">
          {isPending ? "Creating..." : "Create Post"}
        </button>

        {isError && <p className="text-red-500"> Error creating post.</p>}
      </form>
      
      {/* AI Content Assistant */}
      <div className="mt-8 mb-6">
        <div className="border-t border-gray-700 pt-6 mt-6">
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">AI-Powered Content Assistance</h3>
          <AiContentAssistant 
            onApplySuggestion={handleApplySuggestion}
            onEnhanceContent={handleEnhanceContent}
            currentContent={content}
          />
        </div>
      </div>
    </div>
  );
};
