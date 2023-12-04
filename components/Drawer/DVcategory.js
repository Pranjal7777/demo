import React, { useState, useEffect } from "react";
import { useTheme } from "react-jss";
import Button from "../../components/button/button"
import useLang from "../../hooks/language";
import { close_dialog } from "../../lib/global";
import { getCategoriesData } from "../../services/user_category";
import { Skeleton } from "@material-ui/lab";
import Icon from "../image/icon";
import { CLOSE_ICON_WHITE, DONE_ICON } from "../../lib/config/logo";
import Image from "../image/image";

const DVCategory = (props) => {
  const { selectedCategoryState } = props;
  const theme = useTheme();
  const [lang] = useLang();
  const [nonHeroCategory, setNonHeroCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const handleCategories = async () => {
    try {
      // API CALL
      const res = await getCategoriesData();
      const data = res?.data?.data
      setNonHeroCategory(data);
      props?.setAvailabelCategories(data)
    } catch (e) {
      console.error("Error in handleCategories", e);
    }
  }

  useEffect(() => {
    handleCategories();
    handleCategoryFormData();
  }, [])

  const handleCategoryFormData = () => {
    const categoryFormData = [...selectedCategoryState];
    setSelectedCategory([...categoryFormData]);
  }

  const handleSelectedCategory = (cat) => {
    const categoryArr = [...selectedCategory];
    const isCategoryInArray = selectedCategory.indexOf(cat?._id);
    isCategoryInArray != -1 ? categoryArr.splice(isCategoryInArray, 1) : categoryArr.push(cat?._id);
    setSelectedCategory([...categoryArr])
  }

  const changeCategoryState = () => {
    close_dialog("category");
    props?.setSelectedCategoryState(selectedCategory)
  }

  const skeletonComponent = () => {
    return (
      <>
        <Skeleton
          variant="rect"
          width="100%"
          height={50}
          animation="wave"
          className="my-1"
        />
        <Skeleton
          variant="rect"
          width="100%"
          height={50}
          animation="wave"
          className="my-1"
        />
        <Skeleton
          variant="rect"
          width="100%"
          height={50}
          animation="wave"
          className="my-1"
        />
        <Skeleton
          variant="rect"
          width="100%"
          height={50}
          animation="wave"
          className="my-1"
        />
      </>
    )
  }

  return (
    <>
      <div className="py-3 dv_dialog">
        <div className="text-right">
          <Icon
            icon={`${CLOSE_ICON_WHITE}#close-white`}
            color={"var(--l_app_text)"}
            size={16}
            onClick={() => props.onClose()}
            alt="back_arrow"
            class="cursorPtr px-3"
            viewBox="0 0 16 16"
          />
        </div>
        <div className="text-center">
          <h5 className="mb-3">{lang.chooseCategory}</h5>
        </div>
        <div className="px-5">
          {!!nonHeroCategory?.length
            ? nonHeroCategory.map((category) => (
              <div key={category._id} className="mb-3 cursorPtr d-flex align-items-center justify-content-between py-2"
                style={{
                  borderRadius: "25px",
                  border: "none",
                  background: theme?.inputBox?.background,
                  color: theme?.inputBox?.color,
                }}
                onClick={() => handleSelectedCategory(category)}
              >
                <p className="col-auto d-flex m-0">{category.title}</p>
                {selectedCategory.includes(category?._id) &&
                  <Image
                    src={DONE_ICON}
                    width={21}
                    height={21}
                    className="mx-2"
                  />
                }
              </div>
            ))
            : skeletonComponent()
          }
        </div>
        <div className="px-4">
          <Button
            type="submit"
            onClick={() => changeCategoryState()}
            fclassname="my-3 btnGradient_bg rounded-pill"
            children={lang.save || "Save"}
          />
        </div>
      </div>
      <style jsx>{`
        .dv_dialog {
          width: 500px;
          color: ${theme.text} !important;
          background-color: var(--l_drawer)!important;
        }
      `}</style>
    </>
  );
};

export default DVCategory;
