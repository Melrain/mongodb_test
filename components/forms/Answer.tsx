'use client';

import { AnswerSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Stars } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '@/context/ThemeProvider';

import { createAnswer } from '@/lib/actions/answer.action';
import { usePathname } from 'next/navigation';
import { useToast } from '../ui/use-toast';

import axios from 'axios';

const type: any = 'post';

interface AnswerProps {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ question, questionId, authorId }: AnswerProps) => {
  const { toast } = useToast();
  const { mode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const editorRef = useRef(null);
  const pathname = usePathname();

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: ''
    }
  });

  const handleCeateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);
    console.log('answer button clicked');
    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname
      });

      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      toast({
        title: 'Answer posted',
        description: 'Your answer has been posted successfully'
      });
    }
  };

  const handleSubmitAI = async () => {
    if (!authorId) return;

    setIsSubmittingAI(true);
    try {
      console.log('ai button clicked');
      // TODO: make an api call use axios
      const { data } = await axios.post('http://localhost:3000/api/chatgpt', {
        question
      });

      if (editorRef.current) {
        const editor = editorRef.current as any;
        setTimeout(() => {
          editor.setContent(data.choices[0].message.content);
        }, 100); // 100ms 延迟调用 setContent()
      }
      console.log(data.choices[0].message.content);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsSubmittingAI(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleCeateAnswer)}>
        <FormItem className="flex flex-row items-center justify-between">
          <FormLabel className="text-dark300_light700 font-bold">Write your answer here</FormLabel>
          <Button
            onClick={() => {
              handleSubmitAI();
            }}
            disabled={isSubmittingAI}
            className="light-border-2 gap-2 rounded-lg bg-slate-100  text-primary-500 dark:bg-slate-900">
            <Stars className="w-[15px]" /> Generate AI answer
          </Button>
        </FormItem>

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                  onInit={(evt, editor) =>
                    // @ts-ignore

                    (editorRef.current = editor)
                  }
                  onBlur={field.onBlur}
                  onEditorChange={(content) => {
                    field.onChange(content);
                  }}
                  initialValue=""
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table'
                    ],
                    toolbar:
                      'undo redo | ' +
                      'codesample| bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Inter; font-size:16px }',
                    skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                    content_css: mode === 'dark' ? 'dark' : 'light'
                  }}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="primary-gradient mt-6 w-fit !text-light-900"
            disabled={isSubmitting}>
            {isSubmitting ? (
              <>{type === 'edit' ? 'editing...' : 'posting...'}</>
            ) : (
              <>{type === 'edit' ? 'Edit Answer' : 'Post Answer'}</>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default Answer;
