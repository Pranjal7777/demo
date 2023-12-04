import React, { useEffect, useState } from "react";
import Button from "../../../components/button/button";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { useTheme } from "react-jss";
import { getCategoriesData } from "../../../services/user_category";
import { close_drawer } from "../../../lib/global/loader";
import { Arrow_Left2 } from "../../../lib/config/homepage";
import Image from "../../../components/image/image";
import Icon from "../../../components/image/icon";
import { DONE_ICON } from "../../../lib/config/logo";

const Category = (props) => {
  const { selectedCategoryState, signUpdata = {} } = props;
  const theme = useTheme();
  const [lang] = useLang();
  const [nonHeroCategory, setNonHeroCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [value] = useForm({
    defaultValue: { ...signUpdata },
  });

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

  //check validations and if valid then submit form
  const changeCategoryState = () => {
    close_drawer("category");
    props?.setSelectedCategoryState(selectedCategory)
  }

  useEffect(() => {
    focus("email");
  }, []);

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  const backHanlder = () => {
    close_drawer("category");
  };

  return (
    <>
      <div className="p-3">
        <div className="d-flex flex-row align-items-center mb-4">
          <div onClick={backHanlder}>
            <Icon
              icon={`${Arrow_Left2}#arrowleft2`}
              hoverColor='var(--l_base)'
              width={20}
              height={20}
              alt="Back Arrow"
            />
          </div>
          <div className="text-center w-100">
            <h4 className="text-dark mb-0">{lang.chooseCategory}</h4>
          </div>
        </div>
        <div className="overflow-auto" style={{ height: "calc(calc(var(--vhCustom, 1vh) * 100) - 142px)" }}>
          {nonHeroCategory && nonHeroCategory.map((category, index) => (
            <div key={index} className="mb-3 d-flex align-items-center justify-content-between py-2"
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
          ))}
        </div>
        <div className="pt-3">
          <Button
            onClick={() => changeCategoryState()}
            type="submit"
            id="scr6"
            fclassname="btnGradient_bg rounded-pill py-2"
            children={lang.next}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(Category);
