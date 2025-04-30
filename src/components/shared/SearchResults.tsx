import { Models } from "appwrite";
import React from "react";
import Loader from "./Loader";
import GridPosts from "./GridPosts";

type SearchResultsProps = {
  isFetching: boolean;
  searchedPosts: Models.Document[];
};
const SearchResults = ({ isFetching, searchedPosts }: SearchResultsProps) => {
  if (isFetching) {
    <Loader />;
  }
  if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPosts posts={searchedPosts.documents} />;
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No Results Found</p>
  );
};

export default SearchResults;
