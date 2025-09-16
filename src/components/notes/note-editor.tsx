'use client'

import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Dynamischer Import, um SSR-Probleme zu vermeiden
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
};

export function NoteEditor() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');

    return (
        <div className="space-y-4">
             <div>
                <Label htmlFor="note-title">Titel</Label>
                <Input 
                    id="note-title" 
                    placeholder="Titel deiner Notiz" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="text-lg"
                />
            </div>
            <div className="bg-white dark:bg-card">
                 <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent}
                    modules={modules}
                    className='[&_.ql-editor]:min-h-[200px]'
                 />
            </div>
             <div>
                <Label htmlFor="note-tags">Tags (kommagetrennt)</Label>
                <Input 
                    id="note-tags" 
                    placeholder="z.B. projekt-x, idee, wichtig" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                />
            </div>
        </div>
    )
}
