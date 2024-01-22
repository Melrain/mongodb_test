import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import React from 'react';

const Loading = () => {
  return (
    <section>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>All Questions!!!</h1>
        <Link href={'/ask-question'} className='flex justify-end max-sm:w-full'>
          <Button className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>Ask a Question</Button>
        </Link>
      </div>
      <div className='mt-11 flex  items-center justify-between gap-5 max-sm:flex-col'>
        <Skeleton className='flex-1' />
        <Skeleton className='min-h-[56px] sm:min-w-[170px]' />
      </div>
    </section>
  );
};

export default Loading;
