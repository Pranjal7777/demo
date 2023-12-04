import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import InputField from '../containers/profile/edit-profile/label-input-field'
import Wrapper from '../hoc/Wrapper'
import isMobile from '../hooks/isMobile'
import useLang from '../hooks/language'
import useProfileData from '../hooks/useProfileData'
import { backArrow_lightgrey, INFO, MAP_KEY } from '../lib/config'
import { Process_icon } from '../lib/config/logo'
import { getGeoLocation, goBack } from '../lib/global'
import { close_drawer, drawerToast, startLoader, stopLoader, Toast } from '../lib/global/loader'
import { sendMail } from '../lib/global/routeAuth'
import { getCityStateWithZipCode } from '../lib/url/fetchCityState'
import {  getCities, getCountry, getSellerAddress, sellerAddress, updateSellerAddress } from '../services/address'
import Button from './button/button'
import Switch from './formControl/switch'
import Icon from './image/icon'
import Image from './image/image'


function JoinAsSeller(props) {
  const [editAddress, setEditAddressData] = useState({});
  const [pending, setPending] = useState(false);
  const [profileData] = useProfileData();
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([])
  const [addressDetails, setAddressDetails] = useState({});
  const [mobileView] = isMobile();
  const [inputDisabled, setInputDisabled] = useState(false);
  const [sameAddress,setSameAddress] = useState(false)
  const [lang] = useLang();
  const [storeErrors, setStoreErrors] = useState(true);
  const [businessErrors, setBusinessErrors] = useState(true);
  const [BillingErrors, setBillingErrors] = useState(true);
    
    const [storeDetails, setStoreDetails] = useState({
      city: "",
      country: '',
      cityId: '',
      countryId: '',
      username: profileData?.username || "",
    });
    const [BillingAddress, setBillingAddress] = useState({
      addressLine1: "",
      address: "",
      postCode: "",
      city: "",
      state: "",
      country: "",
    });
    const [BussinessAddress, setBussinessAddress] = useState({
      addressLine1: "",
      address: "",
      postCode: "",
      city: "",
      state: "",
      country: "",
    });
    const [companyForm, setCompanyForm] = useState({
      company: "",
      tax: "",
    });

  useEffect(async()=>{
    if(profileData.sellerId?.length) {
      try {
        let res = await getSellerAddress();
        if (res.status == 200) {
          setAddressDetails(res.data?.data);
          setInputDisabled((res?.data?.data?.status == 'PENDING') ? true : false)
          setPending(res?.data?.data?.status);
        }
      } catch (error) {
        console.error(error);
      }
    }
  },[profileData.sellerId])

  useEffect(()=>{
    if (storeDetails?.country?.length && storeDetails?.city?.length) {
      setStoreErrors(false)
    }else{
      setStoreErrors(true)
    }
    if (BussinessAddress?.postCode?.length && BussinessAddress?.state?.length && BussinessAddress?.city?.length && BussinessAddress?.addressLine1?.length) {
      setBusinessErrors(false)
    }else{
      setBusinessErrors(true)
    }
    if (BillingAddress?.postCode?.length && BillingAddress?.state?.length && BillingAddress?.city?.length && BillingAddress?.addressLine1?.length) {
      setBillingErrors(false)
    }else{
      setBillingErrors(true)
    }
  },[storeDetails, BussinessAddress, BillingAddress])

  useEffect(()=>{
    if(addressDetails) {
      setStoreDetails({
        city: addressDetails?.cityName || "",
        country: addressDetails?.countryName || '',
        cityId: addressDetails?.cityId || '',
        countryId: addressDetails?.countryId || '',
        username: profileData?.username || "",
      });
      setBillingAddress({
        addressLine1: addressDetails?.billingaddress?.addressLine1 || "",
        address: addressDetails?.billingaddress?.address || "",
        postCode: addressDetails?.billingaddress?.postCode || "",
        city: addressDetails?.billingaddress?.city || "",
        state: addressDetails?.billingaddress?.state || "",
        country: addressDetails?.billingaddress?.country || "",
      })
      setBussinessAddress({
        addressLine1: addressDetails?.businessaddress?.addressLine1 || "",
        address: addressDetails?.businessaddress?.address || "",
        postCode: addressDetails?.businessaddress?.postCode || "",
        city: addressDetails?.businessaddress?.city || "",
        state: addressDetails?.businessaddress?.state || "",
        country: addressDetails?.businessaddress?.country || "",
      })
      setCompanyForm({
        company: addressDetails?.companyName || "",
        tax: addressDetails?.taxNumber || "",
      })
    }
  },[addressDetails])


  useEffect(async()=>{
    if (profileData && [5, 6].includes(profileData.statusCode)) {
      setInputDisabled(true);
      return drawerToast({
        closing_time: 10000,
        title: lang.submitted,
        desc: lang.unverifiedProfile,
        closeIconVisible: true,
        button: {
          text: lang.contactUs,
          onClick: () => {
            sendMail();
          },
        },
        titleClass: "max-full",
        autoClose: true,
        isMobile: false,
      });
    };
    let addressData = await getGeoLocation();
    setEditAddressData(addressData);

    const countrydata = await getCountry();
    setCountryList(countrydata.data.data);
    
  },[]);

  useEffect(()=>{
    if(sameAddress){
      setBillingAddress((prev)=>({...prev,
        addressLine1: BussinessAddress?.addressLine1 || "",
        address: BussinessAddress?.address || "",
        postCode: BussinessAddress?.postCode || "",
        city: BussinessAddress?.city || "",
        state: BussinessAddress?.state || "",
        country: BussinessAddress?.country || "",
      }))
    }
  },[sameAddress])

  useEffect(async()=>{
    if(storeDetails?.countryId?.length){
    try {
      const res = await getCities(storeDetails?.countryId);
      if(res.status == 200) {
        setCityList(res.data.data)
      }else setCityList([]);
    } catch (error) {
      console.error(error);
      setCityList([])
    }
  }
  },[storeDetails.countryId]);

   const changeStoreDetails = async(e) => {
     let {name,value} = e.target;
     setStoreDetails((prev) => ({...prev, [name]: value}));
     if (name === 'country') {
       const res = await getCountry();
       let countryId = res.data.data?.find(country=>country.countryName == value)?._id;
       setCountryList(res.data.data);
       setStoreDetails((prev) => ({...prev, 'countryId': countryId}))
      }
    if(name === 'city' && storeDetails?.countryId?.length > 0){
    let cityId = cityList?.find(city=>city.cityName == value)?._id;
    setStoreDetails((prev) => ({...prev, 'cityId': cityId}))
    }
  };

  const changeBusinessAddress = async (e, field) => {
    setSameAddress(false);
    let {name, value} = e.target;
    if (name == "postCode") {
      setBussinessAddress((prev) => ({...prev,[name]: value.toUpperCase()}));
    } else {
      setBussinessAddress((prev) => ({...prev,[name]: value}))
    }
    // Dynamic Country, State and City from Google API
    if (field === "postCode" && name === 'postCode') {
      const cityStateObj = await getCityStateWithZipCode(value);
      if (cityStateObj) {
        setBussinessAddress((prev) => ({...prev, 'city': cityStateObj?.find(city => city?.types[0] === "locality" || city.types[0] === "postal_town")?.long_name}))
        setBussinessAddress((prev)=> ({...prev, 'state': cityStateObj?.find(state => state?.types[0] === "administrative_area_level_1")?.long_name}))
        setBussinessAddress((prev) => ({...prev, 'country': cityStateObj?.find(country => country?.types[0] === "country")?.long_name}))
      }else {
        setBussinessAddress((prev)=>({...prev,
          city: "",
          state: "",
          country: "",
        }))
      }
    }
  };

  const changeBillingAddress = async (e, field) => {
    let {name,value} = e.target;
    if (name == "postCode") {
      setBillingAddress((prev) => ({...prev,[name]: value.toUpperCase()}));
    } else {
      setBillingAddress((prev) => ({...prev,[name]: value}))
    }
    // Dynamic Country, State and City from Google API
    if (field === "postCode" && name === 'postCode') {
      const cityStateObj = await getCityStateWithZipCode(value);
      if (cityStateObj) {
        setBillingAddress((prev) => ({...prev, 'city': cityStateObj?.find(city => city?.types[0] === "locality" || city.types[0] === "postal_town")?.long_name}))
        setBillingAddress((prev)=> ({...prev, 'state': cityStateObj?.find(state => state?.types[0] === "administrative_area_level_1")?.long_name}))
        setBillingAddress((prev) => ({...prev, 'country': cityStateObj?.find(country => country?.types[0] === "country")?.long_name}))
      }else {
        setBillingAddress((prev)=>({...prev,
          city: "",
          state: "",
          country: "",
        }))
      }
    }
  };
      const changeCompany = (e) => {
        let {name,value} = e.target;
        setCompanyForm({...companyForm, [name]: value})
      };

      const addAddressApi = (type) => {
        startLoader();
        let payload;
        payload = {
          countryId: storeDetails.countryId,
          countryName: storeDetails.country,
          cityId: storeDetails.cityId,
          cityName: storeDetails.city,
          // storeName: storeDetails.username.value,
          businessaddress: {
            city: BussinessAddress.city,
            state: BussinessAddress.state,
            country: BussinessAddress.country,
            postCode: BussinessAddress.postCode,
            addressLine1: BussinessAddress.addressLine1,
            lat: String(editAddress.lat || editAddress.latitude),
            long: String(editAddress.long || editAddress.longitude),
            address: editAddress.address,
          },
          billingaddress: {
            city: BillingAddress.city,
            state: BillingAddress.state,
            country: BillingAddress.country,
            postCode: BillingAddress.postCode,
            addressLine1: BillingAddress.addressLine1,
            lat: String(editAddress.lat || editAddress.latitude),
            long: String(editAddress.long || editAddress.longitude),
            address: editAddress.address,
          },
          pickupAddress: {
            city: BillingAddress.city,
            state: BillingAddress.state,
            country: BillingAddress.country,
            postCode: BillingAddress.postCode,
            addressLine1: BillingAddress.addressLine1,
            lat: String(editAddress.lat || editAddress.latitude),
            long: String(editAddress.long || editAddress.longitude),
            address: editAddress.address,
          },
        }

        if (companyForm.company?.length) {
          payload.companyName = companyForm.company
        }

        if(companyForm.tax?.length) {
          payload.taxNumber = companyForm.tax
        }
        
        if(!profileData?.sellerId?.length) {
          sellerAddress(payload)
          .then((data) => {
            setTimeout(() => {
              stopLoader();
              Toast("Address Added", "success");
              setPending('PENDING');
            }, 500);
          })
          .catch((e) => {
            stopLoader();
            Toast(e?.response?.data?.message, "error");
          });
        }else{
          updateSellerAddress(payload)
          .then((data) => {
            setTimeout(() => {
              stopLoader();
              Toast("Address Added", "success");
              setPending("PENDING");
            }, 500);
          })
          .catch((e) => {
            stopLoader();
            Toast(e?.response?.data?.message, "error");
          });
        }
      };
    const FormInput = () => {
        return(<>
            <input autocomplete="false" name="hidden" type="text" style={{display: "none"}}></input>
            <div className="">
                    <h5 className="dialogTextColor p-3 m-0">
                        Store Details
                    </h5>
                <div className='row mx-0'>
                    <div className="col-12 col-sm-5">
                      <label>Country *</label>
                      <select className="selectpicker dv_select_address_form_control defultCountryColor" data-live-search="true" 
                          onChange={changeStoreDetails}
                          type='text'
                          inputType='text'
                          name='country'
                          value={storeDetails.country}
                          placeholder='Enter country' disabled={inputDisabled}>
                        <option hidden>Enter country</option>
                          {countryList && countryList?.map((data) =>
                          <option data-tokens={data?.countryCode}>{data?.countryName}</option>
                        )}
                      </select>
                    </div>
                    <div className="col-12 col-sm-5">
                        <label>City *</label>
                        <select className="selectpicker dv_select_address_form_control defultCityColor" data-live-search="true"
                          onChange={changeStoreDetails}
                          type='text'
                          inputType='text'
                          name='city'
                          value={storeDetails.city}
                          
                          placeholder='Enter city' disabled={inputDisabled || !cityList?.length}>
                            <option hidden>{!storeDetails.country?.length ? 'Enter city' : cityList?.length ? 'Enter city' : 'City Not Found...'}</option>
                            {cityList && cityList?.map((data) =>
                              <option data-tokens={data?.cityCode}>{data?.cityName}</option>
                              )}
                      </select>
                    </div>
                    <div className="col-12 col-sm-10 mt-3">
                        <label>Store Name (Username)*</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='username'
                            value={storeDetails.username || profileData?.username}
                            
                            autoComplete="off"
                            onChange={changeStoreDetails}
                            className='dv_address_form_control'
                            placeholder='@appscrip'
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div className="">
                <div>
                    <h5 className="dialogTextColor p-3 m-0 d-flex">
                        Business Pickup Address
                        <Icon 
                        icon={`${INFO}#info`}
                        color='var(--l_base)'
                        width={19}
                        height={19}
                        class='mx-3'
                        viewBox='0 0 12 12'
                        />
                    </h5>
                </div>
                <div className='row mx-0'>
                    <div className="col-12 col-sm-4">
                        <label>Zipcode*</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='postCode'
                            value={BussinessAddress.postCode}
                            
                            autoComplete="off"
                            onChange={(e)=>changeBusinessAddress(e,'postCode')}
                            className='dv_address_form_control'
                            placeholder='Enter zipcode'
                            disabled={inputDisabled}
                        />
                    </div>
                    <div className="col-12 col-sm-4">
                        <label>State *</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='state'
                            value={BussinessAddress.state}
                            
                            autoComplete="off"
                            onChange={changeBusinessAddress}
                            className='dv_address_form_control'
                            placeholder='Enter state'
                            disabled={inputDisabled}
                        />
                    </div>
                    <div className="col-12 col-sm-4">
                        <label>City *</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='city'
                            value={BussinessAddress.city}
                            
                            autoComplete="off"
                            onChange={(e)=>changeBusinessAddress(e,'city')}
                            className='dv_address_form_control'
                            placeholder='Enter city'
                            disabled={inputDisabled}
                        />
                    </div>
                    <div className="col-12 col-sm-10">
                        <label>Address*</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='addressLine1'
                            value={BussinessAddress.addressLine1}
                            
                            autoComplete="off"
                            onChange={changeBusinessAddress}
                            className='dv_address_form_control'
                            placeholder='Enter address'
                            disabled={inputDisabled}
                        />
                    </div>
                </div>
            </div>
            <div className="">
                <div className='d-flex flex-row justify-content-between align-items-center'>
                    <h5 className="dialogTextColor p-3 m-0 d-flex">
                    Billing Address
                        <Icon 
                        icon={`${INFO}#info`}
                        color='var(--l_base)'
                        width={19}
                        height={19}
                        class='ml-sm-3 ml-2'
                        viewBox='0 0 12 12'
                        />
                    </h5>
                    <div className='d-flex felx-row pr-3'>
                    <div className='mr-2'>Same as Pickup Address</div>
                    <Switch 
                      checked={sameAddress}
                      onChange={() => setSameAddress(!sameAddress)}
                      disabled={inputDisabled}
                    />
                    </div>
                </div>
                <div className='row mx-0'>
                    <div className="col-12 col-sm-4">
                        <label>Zipcode*</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='postCode'
                            value={BillingAddress.postCode}
                            
                            autoComplete="off"
                            onChange={(e)=>changeBillingAddress(e,'postCode')}
                            className='dv_address_form_control'
                            placeholder='Enter zipcode'
                            disabled={inputDisabled || sameAddress}
                        />
                    </div>
                    <div className="col-12 col-sm-4">
                        <label>State *</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='state'
                            value={BillingAddress.state}
                            
                            autoComplete="off"
                            onChange={changeBillingAddress}
                            className='dv_address_form_control'
                            placeholder='Enter state'
                            disabled={inputDisabled || sameAddress}
                        />
                    </div>
                    <div className="col-12 col-sm-4">
                        <label>City *</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='city'
                            value={BillingAddress.city}
                            
                            autoComplete="off"
                            onChange={(e)=>changeBillingAddress(e,'city')}
                            className='dv_address_form_control'
                            placeholder='Enter city'
                            disabled={inputDisabled || sameAddress}
                        />
                    </div>
                    <div className="col-12 col-sm-10">
                        <label>Address*</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='addressLine1'
                            value={BillingAddress.addressLine1}
                            
                            autoComplete="off"
                            onChange={changeBillingAddress}
                            className='dv_address_form_control'
                            placeholder='Enter address'
                            disabled={inputDisabled || sameAddress}
                        />
                    </div>
                </div>
            </div>
            <div className="">
                <div>
                    <h5 className="dialogTextColor p-3 m-0 d-flex">
                    Company Information
                        <Icon 
                        icon={`${INFO}#info`}
                        color='var(--l_base)'
                        width={19}
                        height={19}
                        class='mx-3'
                        viewBox='0 0 12 12'
                        />
                    </h5>
                </div>
                <div className='row mx-0'>
                    <div className="col-12 col-sm-5">
                        <label>Company Name</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='company'
                            value={companyForm.company}
                            
                            autoComplete="off"
                            onChange={changeCompany}
                            className='dv_address_form_control'
                            placeholder='Enter company name'
                            disabled={inputDisabled}
                        />
                    </div>
                    <div className="col-12 col-sm-5">
                        <label>Tax Number</label>
                        <InputField
                            type='text'
                            inputType='text'
                            name='tax'
                            value={companyForm.tax}
                            
                            autoComplete="off"
                            onChange={changeCompany}
                            className='dv_address_form_control'
                            placeholder='Enter tax Number'
                            disabled={inputDisabled}
                        />
                    </div>
                </div>
            </div>
            <style jsx>{`
            :global(.dv_address_form_control){
                background: #1E1C22 !important;
                border-radius: 8px !important;
            }
            :global(.dv_address_form_control::placeholder){
                color: #B6B8CE;
                font-size: 13px;
            }
            label{
                color: #B6B8CE;
            }
            .defultCountryColor{
              color: ${storeDetails.country?.length ? 'rgb(255, 255, 255)' : '#a1a1a3'};
            }
            .defultCityColor{
              color: ${storeDetails.city?.length ? 'rgb(255, 255, 255)' : '#a1a1a3'};
            }
            .dv_select_address_form_control{
              width: inherit;
              height: 44px;
              border: none;
              padding-left: 15px;
              background: #1e1c22;
              border-radius: 8px;
              cursor: pointer;
              opacity: 1;
            }
        `}</style>
            </>
        )
    }

  return (
    <Wrapper>
        <Head>
          <script src={`https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&libraries=places`} />
        </Head>
        {mobileView && <div className="pl-3 py-3 sticky-top" style={{ background: '#121212', zIndex: '99' }}>
          <Image
              alt="model-registration"
              onClick={() => {close_drawer('JOIN_SELLER'), goBack()}}
              src={backArrow_lightgrey}
              width={28}
              id="scr2"
          />
        </div>}
        <div className='px-sm-3 text-white' style={mobileView ? {height: 'calc(calc(var(--vhCustom, 1vh) * 100) - 60px)', overflowY: 'auto'} : {}}>
            <h3 className='px-3 mb-3'>
                Join as a Juicy seller
            </h3>
            {pending == ('PENDING' || 'VERIFIED') && <div className='px-3'>
              <div className='row mx-0 py-2 align-items-center' style={{background: '#1E1C22', borderRadius: '12px'}}>
                <div className='col-3'>
                <Icon 
                  icon={`${Process_icon}#process_icon`}
                  width={76}
                  height={76}
                  viewBox="0 0 76 76"
                />
                </div>
                <div className='col-9 col-md-8 pl-0 text-center'>
                  <h6>Your profile verification is under process</h6>
                  <div className='text-center fntSz12 d-sm-block d-none' style={{color: '#B6B8CE'}}>Please wait until your profile gets verified. Usually it takes 24 hours for the <br /> admin to review the profile</div>
                </div>
                <div className='col-12 d-sm-none pt-2'>
                  <div className='text-center fntSz12' style={{color: '#B6B8CE'}}>Please wait until your profile gets verified. Usually it takes 24 hours for the admin to review the profile</div>
                </div>
              </div>
            </div>}
            <form className='pb-3'>
                <div>{FormInput()}</div>
                <div className='float-right px-3' style={{width: `${mobileView ? '100%' : '8rem'}`}}>
                    <Button
                        type="button"
                        cssStyles={{
                            background:
                            "linear-gradient(91.19deg, rgba(255, 26, 170) 0%, #460a56 100%)",
                            // padding: "14px 0px",
                            fontFamily: 'Roboto',
                            // fontSize: '13px',
                        }}
                        onClick={()=> addAddressApi()}
                        disabled={(storeErrors || businessErrors || BillingErrors) || (pending == 'PENDING')}
                        fclassname='mt-4 font-weight-500 mb-4'
                        children={'Apply'}
                    />
                </div>
            </form>
        </div>
    </Wrapper>
  )
}

export default JoinAsSeller;