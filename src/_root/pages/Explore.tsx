import GridPosts from "@/components/shared/GridPosts";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import { useInView } from "react-intersection-observer";
import useDebounce from "@/hooks/use-debounce";
import { useEffect } from "react";

import {
  useGetPost,
  useSearchPost,
} from "@/lib/react-query/queriesAndMutations";
import React, { useState } from "react";

const Explore = () => {
  const { data: posts, fetchNextPage, hasNextPage } = useGetPost();
  const [search, setSearch] = useState("");
  const { ref, inView } = useInView();
  const debounced = useDebounce(search, 500);
  const { data: searchedPosts, isPending: isFetching } =
    useSearchPost(debounced);

  useEffect(() => {
    if (inView && !search) {
      fetchNextPage();
    }
  }, [inView, search]);

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  //console.log(posts);
  const ShowsearchResults = search !== "";
  const shouldShowPosts =
    !ShowsearchResults &&
    posts?.pages.every((item) => item?.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            alt="search"
            width={24}
            height={24}
            src="/assets/icons/search.svg"
          />
          <Input
            type="text"
            placeholder="search"
            className="explore-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold w-full">Popular Today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer  ">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            alt="filter"
            height={20}
            width={20}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {ShowsearchResults ? (
          <SearchResults
            isFetching={isFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of Posts</p>
        ) : (
          posts?.pages?.map((item, index) => (
            <GridPosts key={`page-${index}`} posts={item?.documents} />
          ))
        )}
      </div>
      {hasNextPage && !search && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
