import React from "react";
import ReactPaginate from "react-paginate";
import _JSXStyle from "styled-jsx/style";

import { NORMAL_BLACK } from "../../lib/config"
import Wrapper from "../../hoc/Wrapper";

const Pagination = props => {
  const { pageCount, handlePageClick } = props;
  return (
    <Wrapper>
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
        pageClassName={"pageNumber"}
      />

      <style jsx>
        {`
          .pagination-section :global(.pagination) {
            margin: 0;
          }

          .pagination-section :global(.pageNumber) {
            width: 28px;
            height: 28px;
            text-align: center;
          }

          .pagination-section :global(a) {
            color: ${NORMAL_BLACK};
            font-size: 14px;
            font-weight: 500;
          }

          .pagination-section :global(a:hover) {
            cursor: pointer;
          }

          .pagination-section :global(.pageNumber a:focus) {
            outline: none;
          }

          .pagination-section :global(.pageNumber.active) {
            border: 1px solid #999;
          }

          .pagination-section :global(.previous, .next) {
            margin: 0px 10px;
          }
        `}
      </style>
    </Wrapper>
  );
};

export default Pagination;
