'use client';

import { useState } from 'react';
import type { DiscussionPost, User } from '@/lib/api/types';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';


type PostFormData = {
  body: string;
};


async function createPost({ inventoryId, body }: { inventoryId: string, body: string }) {
  const { data } = await apiClient.post<DiscussionPost>(
    `/inventories/${inventoryId}/posts`,
    { body }
  );
  return data;
}


interface DiscussionProps {
  inventoryId: string;
  initialPosts: DiscussionPost[];
}

export function Discussion({ inventoryId, initialPosts }: DiscussionProps) {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  
  
  const [posts, setPosts] = useState(initialPosts);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PostFormData>();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPostData) => {
     
      const newPostWithAuthor = {
        ...newPostData,
        author: {
          id: user!.id,
          name: user!.name,
          email: user!.email,
        },
      };

      
      setPosts((prevPosts) => [...prevPosts, newPostWithAuthor]);
      reset(); 
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.response?.data?.error || error.message || 'Не удалось отправить пост.',
      });
    },
  });

  const onSubmit: SubmitHandler<PostFormData> = (data) => {
    mutation.mutate({ inventoryId, body: data.body });
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-2xl font-semibold">Обсуждение</h2>

      
      <div className="mt-6 space-y-4">
        {posts.length === 0 && (
          <p className="text-muted-foreground">Здесь пока нет сообщений.</p>
        )}
        
        {posts.map((post) => (
          <div key={post.id} className="flex space-x-3">
            <div className="shrink-0">
              
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                {post.author.name?.[0] || 'A'}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium">{post.author.name}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleString('ru-RU')}
              </div>
              <p className="mt-1 text-base">{post.body}</p>
            </div>
          </div>
        ))}
      </div>

      
      {isLoggedIn && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium">Оставить комментарий</h3>
          <Textarea
            {...register('body', { required: 'Текст не может быть пустым' })}
            placeholder="Что вы думаете?"
            className="mt-2"
            rows={4}
            disabled={mutation.isPending}
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-500">{errors.body.message}</p>
          )}
          <Button type="submit" className="mt-4" disabled={mutation.isPending}>
            {mutation.isPending ? 'Отправка...' : 'Отправить'}
          </Button>
        </form>
      )}
    </div>
  );
}