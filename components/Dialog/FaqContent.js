import React from "react";
import Wrapper from "../../hoc/Wrapper";
import parse from "html-react-parser";
import useLang from "../../hooks/language";

function FaqContent(props) {
  const [lang] = useLang();
  const { FaqContent, title } = props;
  return (
    <Wrapper>
      <button
        type="button"
        className="close dv__modal_close"
        data-dismiss="modal"
        onClick={() => props.onClose()}
      >
        {lang.btnX}
      </button>
      <div className="col-12 p-4 dv__black_color">
        <h5 className="dialogTextColor px-1 py-3 text-center m-0">{title}</h5>
        {parse(FaqContent)}
      </div>
    </Wrapper>
  );
}
export default FaqContent;
