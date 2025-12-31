import React, { useState, useEffect, useRef } from 'react';
import { CrisisManifesto, Language } from '../types';

interface Annotation {
  id: string;
  crisisSlug: string;
  textRange: {
    start: number;
    end: number;
    text: string;
  };
  content: string;
  author: string;
  timestamp: string;
  type: 'comment' | 'correction' | 'question' | 'insight';
  votes: number;
  replies: Annotation[];
}

interface AnnotationSystemProps {
  crisis: CrisisManifesto;
  lang: Language;
  onAnnotationSelect?: (annotation: Annotation) => void;
}

export const AnnotationSystem: React.FC<AnnotationSystemProps> = ({
  crisis,
  lang,
  onAnnotationSelect
}) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState({
    content: '',
    type: 'comment' as Annotation['type']
  });

  // Load annotations from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`annotations_${crisis.id}_${lang}`);
    if (stored) {
      try {
        setAnnotations(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load annotations:', error);
      }
    }
  }, [crisis.id, lang]);

  // Save annotations to localStorage
  const saveAnnotations = (newAnnotations: Annotation[]) => {
    localStorage.setItem(`annotations_${crisis.id}_${lang}`, JSON.stringify(newAnnotations));
    setAnnotations(newAnnotations);
  };

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const selectedText = selection.toString().trim();
      if (selectedText.length > 10) { // Minimum selection length
        setSelectedText(selectedText);
        setShowAnnotationForm(true);
      }
    }
  };

  // Add new annotation
  const addAnnotation = () => {
    if (!newAnnotation.content.trim()) return;

    const selection = window.getSelection();
    let textRange = null;

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      textRange = {
        start: range.startOffset,
        end: range.endOffset,
        text: selectedText
      };
    }

    const annotation: Annotation = {
      id: `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      crisisSlug: crisis.id,
      textRange: textRange || { start: 0, end: 0, text: selectedText },
      content: newAnnotation.content,
      author: 'Anonymous Researcher', // In real app, would be user auth
      timestamp: new Date().toISOString(),
      type: newAnnotation.type,
      votes: 0,
      replies: []
    };

    saveAnnotations([...annotations, annotation]);
    setNewAnnotation({ content: '', type: 'comment' });
    setShowAnnotationForm(false);
    setSelectedText('');
  };

  // Vote on annotation
  const voteAnnotation = (annotationId: string, vote: number) => {
    const updatedAnnotations = annotations.map(ann =>
      ann.id === annotationId
        ? { ...ann, votes: ann.votes + vote }
        : ann
    );
    saveAnnotations(updatedAnnotations);
  };

  // Add reply to annotation
  const addReply = (parentId: string, content: string) => {
    const reply: Annotation = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      crisisSlug: crisis.id,
      textRange: { start: 0, end: 0, text: '' },
      content,
      author: 'Anonymous Researcher',
      timestamp: new Date().toISOString(),
      type: 'comment',
      votes: 0,
      replies: []
    };

    const updatedAnnotations = annotations.map(ann =>
      ann.id === parentId
        ? { ...ann, replies: [...ann.replies, reply] }
        : ann
    );
    saveAnnotations(updatedAnnotations);
  };

  return (
    <div className="annotation-system">
      {/* Annotation Toggle */}
      <div className="flex items-center justify-between mb-6 p-4 border border-white/10 bg-white/[0.01]">
        <div className="flex items-center gap-4">
          <span className="mono text-[10px] uppercase tracking-[0.4em] text-white/40">
            KOLLABORATIVE ANNOTATIONEN
          </span>
          <span className="mono text-[9px] text-white/30">
            {annotations.length} ANNOTATIONEN
          </span>
        </div>

        <button
          onClick={handleTextSelection}
          className="mono text-[10px] uppercase tracking-[0.2em] border border-white/20 px-3 py-1 hover:bg-white hover:text-black transition-all"
        >
          TEXT MARKIEREN
        </button>
      </div>

      {/* Annotation Form */}
      {showAnnotationForm && (
        <div className="mb-6 p-4 border border-red-500/30 bg-red-500/5">
          <div className="mb-3">
            <div className="mono text-[9px] text-white/60 mb-1">MARKIERTER TEXT:</div>
            <div className="mono text-[11px] text-white/80 bg-black/20 p-2 border border-white/10">
              "{selectedText}"
            </div>
          </div>

          <div className="mb-3">
            <select
              value={newAnnotation.type}
              onChange={(e) => setNewAnnotation(prev => ({ ...prev, type: e.target.value as Annotation['type'] }))}
              className="mono text-[10px] bg-black border border-white/20 px-2 py-1 text-white mr-3"
            >
              <option value="comment">KOMMENTAR</option>
              <option value="correction">KORREKTUR</option>
              <option value="question">FRAGE</option>
              <option value="insight">EINBLICK</option>
            </select>
          </div>

          <textarea
            value={newAnnotation.content}
            onChange={(e) => setNewAnnotation(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Ihre Annotation..."
            className="w-full h-20 mono text-[11px] bg-black border border-white/20 p-2 text-white resize-none"
          />

          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowAnnotationForm(false)}
              className="mono text-[10px] uppercase tracking-[0.2em] border border-white/20 px-3 py-1 text-white/60 hover:text-white"
            >
              ABBRECHEN
            </button>
            <button
              onClick={addAnnotation}
              className="mono text-[10px] uppercase tracking-[0.2em] bg-white text-black px-3 py-1 hover:bg-white/90"
            >
              SPEICHERN
            </button>
          </div>
        </div>
      )}

      {/* Annotations List */}
      <div className="space-y-4">
        {annotations.map((annotation) => (
          <AnnotationCard
            key={annotation.id}
            annotation={annotation}
            onVote={(vote) => voteAnnotation(annotation.id, vote)}
            onReply={(content) => addReply(annotation.id, content)}
            onSelect={() => onAnnotationSelect?.(annotation)}
          />
        ))}
      </div>
    </div>
  );
};

// Annotation Card Component
interface AnnotationCardProps {
  annotation: Annotation;
  onVote: (vote: number) => void;
  onReply: (content: string) => void;
  onSelect: () => void;
}

const AnnotationCard: React.FC<AnnotationCardProps> = ({
  annotation,
  onVote,
  onReply,
  onSelect
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const getTypeColor = (type: Annotation['type']) => {
    switch (type) {
      case 'comment': return 'border-blue-500/30 bg-blue-500/5';
      case 'correction': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'question': return 'border-green-500/30 bg-green-500/5';
      case 'insight': return 'border-purple-500/30 bg-purple-500/5';
      default: return 'border-white/10 bg-white/[0.01]';
    }
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className={`p-4 border ${getTypeColor(annotation.type)}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="mono text-[8px] uppercase tracking-[0.3em] text-white/40">
            {annotation.type.toUpperCase()}
          </span>
          <span className="mono text-[9px] text-white/50">
            {annotation.author}
          </span>
          <span className="mono text-[9px] text-white/30">
            {new Date(annotation.timestamp).toLocaleDateString('de-DE')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onVote(-1)}
            className="mono text-[10px] text-white/40 hover:text-red-400"
          >
            ▼
          </button>
          <span className="mono text-[10px] text-white/60 min-w-[20px] text-center">
            {annotation.votes}
          </span>
          <button
            onClick={() => onVote(1)}
            className="mono text-[10px] text-white/40 hover:text-green-400"
          >
            ▲
          </button>
        </div>
      </div>

      {/* Selected Text */}
      {annotation.textRange.text && (
        <div className="mb-3 p-2 bg-black/20 border border-white/10">
          <div className="mono text-[9px] text-white/40 mb-1">MARKIERT:</div>
          <div className="mono text-[10px] text-white/70 italic">
            "{annotation.textRange.text}"
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mono text-[11px] text-white/80 leading-relaxed mb-3">
        {annotation.content}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="mono text-[9px] uppercase tracking-[0.2em] text-white/50 hover:text-white"
        >
          ANTWORTEN ({annotation.replies.length})
        </button>

        <button
          onClick={onSelect}
          className="mono text-[9px] uppercase tracking-[0.2em] text-white/50 hover:text-white"
        >
          ZUM TEXT
        </button>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Ihre Antwort..."
            className="w-full h-16 mono text-[10px] bg-black/20 border border-white/10 p-2 text-white resize-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowReplyForm(false)}
              className="mono text-[9px] uppercase tracking-[0.2em] border border-white/20 px-2 py-1 text-white/60 hover:text-white"
            >
              ABBRECHEN
            </button>
            <button
              onClick={handleReply}
              className="mono text-[9px] uppercase tracking-[0.2em] bg-white text-black px-2 py-1 hover:bg-white/90"
            >
              SENDEN
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {annotation.replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {annotation.replies.map((reply) => (
            <div key={reply.id} className="pl-4 border-l border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="mono text-[8px] text-white/50">
                  {reply.author}
                </span>
                <span className="mono text-[8px] text-white/30">
                  {new Date(reply.timestamp).toLocaleDateString('de-DE')}
                </span>
              </div>
              <div className="mono text-[10px] text-white/70">
                {reply.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
