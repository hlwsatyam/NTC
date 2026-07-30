import { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineCamera } from "react-icons/ai";
import { getSeller } from "../../../redux/actions/user";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const SellerDashboardSettings = () => {
  const dispatch = useDispatch();
  const [avatar] = useState();
  const { seller } = useSelector((state) => state.seller);
  const [name, setName] = useState(seller?.name || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [password, setPassword] = useState("");

  // New fields
  const [age, setAge] = useState(seller?.age || "");
  const [gender, setGender] = useState(seller?.gender || "");
  const [companyName, setCompanyName] = useState(seller?.companyName || "");
  const [officeAddress, setOfficeAddress] = useState(seller?.officeAddress || "");
  const [godownAddress, setGodownAddress] = useState(seller?.godownAddress || "");
  const [state, setState] = useState(seller?.state || "");
  const [town, setTown] = useState(seller?.town || "");
  const [aadhaarNo, setAadhaarNo] = useState(seller?.aadhaarNo || "");
  const [panNo, setPanNo] = useState(seller?.panNo || "");
  const [gstNo, setGstNo] = useState(seller?.gstNo || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/sellers/update-avatar`,
          { avatar: reader.result },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        dispatch(getSeller());
        toast.success("Avatar updated successfully.");
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update avatar."
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/sellers/update-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
          age,
          gender,
          companyName,
          officeAddress,
          godownAddress,
          state,
          town,
          aadhaarNo,
          panNo,
          gstNo,
          password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Seller info updated successfully.");
        dispatch(getSeller());
        setPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full">
      <div className="flex justify-center w-full mb-8">
        <div className="relative">
          <img
            src={avatar ? avatar : `${seller?.avatar?.url}`}
            className="w-32 h-32 md:w-40 md:h-40 lg:w-[150px] lg:h-[150px] rounded-full object-cover border-4 border-gray-400 shadow-[0_0_20px_rgba(0,0,0,0.05)]"
            alt="Seller Profile"
          />
          <div className="w-8 h-8 md:w-[34px] md:h-[34px] bg-gray-100 rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px] border-2 border-gray-400">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label htmlFor="image" className="cursor-pointer">
              <AiOutlineCamera className="text-gray-500 text-sm md:text-base" />
            </label>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white py-6 md:py-8 px-4 md:px-6 lg:px-10 shadow-[0_0_20px_rgba(0,0,0,0.05)] rounded-sm">
          <form onSubmit={updateHandler} className="space-y-6">
            {/* ===== Personal Information ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Shop Description
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your shop"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    min="18"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base bg-white"
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ===== Address Details ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Residential Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={zipCode}
                    onChange={(e) => setZipcode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Town / City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ===== Business Information ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Office Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Godown / Warehouse Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={godownAddress}
                    onChange={(e) => setGodownAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ===== Identity & Tax Information ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Identity & Tax Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={aadhaarNo}
                    onChange={(e) => setAadhaarNo(e.target.value)}
                    maxLength={12}
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={panNo}
                    onChange={(e) => setPanNo(e.target.value)}
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                    GST Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    required
                    value={gstNo}
                    onChange={(e) => setGstNo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ===== Confirm Password ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Confirm Changes
              </h3>
              <div className="w-full md:w-1/2">
                <label className="block text-sm md:text-base font-semibold text-gray-800 mb-1">
                  Enter your password to confirm <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 md:py-3 bg-orange-500 hover:bg-gray-800 text-white cursor-pointer rounded-sm font-semibold tracking-wide transition mt-2 flex items-center justify-center text-lg"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardSettings;
