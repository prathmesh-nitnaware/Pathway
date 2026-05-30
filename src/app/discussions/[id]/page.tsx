"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, MessageSquareReply, User } from "lucide-react";
import toast from "react-hot-toast";

export default function DiscussionDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestion = async () => {
    try {
      const res = await fetch(`/api/discussions/${id}`);
      if (!res.ok) {
        throw new Error("Question not found");
      }
      const data = await res.json();
      setQuestion(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchQuestion();
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/discussions/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to post answer");

      toast.success("Reply posted!");
      setContent("");
      fetchQuestion(); // Refresh answers
    } catch (error) {
      toast.error("Failed to post reply.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Discussion not found</h2>
        <Link href="/discussions" className="text-blue-600 hover:underline">
          Return to discussions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/discussions" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Discussions
      </Link>

      {/* Main Question */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{question.title}</h1>
        
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            {question.author?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <span className="font-medium text-gray-900 block">{question.author?.name || 'Anonymous'}</span>
            <span>{new Date(question.createdAt).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
          {question.content}
        </div>
      </div>

      {/* Answers Section */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          {question.answers.length} {question.answers.length === 1 ? 'Reply' : 'Replies'}
        </h3>
        
        <div className="space-y-6">
          {question.answers.map((answer: any) => (
            <div key={answer.id} className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-gray-900 block">{answer.author?.name || 'Anonymous'}</span>
                  <span>{new Date(answer.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{answer.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquareReply className="w-5 h-5 text-blue-600" />
          Add a Reply
        </h3>
        
        {session ? (
          <form onSubmit={handleReply}>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your answer here..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none mb-4"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Post Reply
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-600 mb-4">You must be signed in to reply to this discussion.</p>
            <Link href="/api/auth/signin" className="bg-gray-900 hover:bg-black text-white font-medium py-2.5 px-6 rounded-xl transition-all inline-block">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
