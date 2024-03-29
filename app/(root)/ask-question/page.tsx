import React from 'react';
import Question from '@/components/forms/Question';

import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';

const page = async () => {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const result = await getUserById({ userId });

  const mongoUser = result.user;

  console.log('mongouser' + mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser?._id)} />
      </div>
    </div>
  );
};

export default page;
