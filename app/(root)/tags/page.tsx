import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { TagsPageFilters } from '@/constants/filters';
import Filter from '@/components/shared/Filter';
import React from 'react';
import { getAllTags } from '@/lib/actions/tag.action';
import NoResult from '@/components/shared/NoResult';
import Link from 'next/link';
import { SearchParamsProps } from '@/types';
import PaginationPage from '@/components/shared/PaginationPage';

const page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1
  });

  return (
    <section className="flex w-full flex-col flex-wrap">
      <h1 className="h1-bold text-dark300_light900">Tags</h1>
      <div className="mt-4 flex flex-row items-center justify-between gap-5 max-sm:flex-col">
        <LocalSearchBar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search amazing minds here..."
          otherClasses="flex-1"
        />
        <Filter
          filters={TagsPageFilters}
          containerClasses="max-sm:w-full outline-none w-[180px]"
          otherClasses="min-h-[56px]"
        />
      </div>
      <div className="mt-12 flex flex-row flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link
              key={tag._id}
              href={`/tags/${tag._id}`}>
              <div className="background-light900_dark200 flex w-[260px] flex-col rounded-lg border-2 p-5 shadow-lg">
                <h2 className="h2-bold text-dark500_light700 background-light800_dark300 w-fit rounded-md p-2 text-lg">
                  {tag.name}
                </h2>
                <p className="text-dark500_light700 text-sm">
                  JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of
                  the World Wide Web, alongside HTML and CSS
                </p>
                <p className="text-dark500_light700 mt-4 text-sm font-bold">
                  <span className="primary-text-gradient">{tag.questions.length}+</span> Questions
                </p>
              </div>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tags Found!"
            description="There are no tags in the database"
            link="/"
            linkTitle="Go back to home page"
          />
        )}
      </div>
      <PaginationPage
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
  );
};

export default page;
