import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

const SellerRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);

  // New fields
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [godownAddress, setGodownAddress] = useState("");
  const [state, setState] = useState("");
  const [town, setTown] = useState("");
  const [aadhaarNo, setAadhaarNo] = useState("");
  const [panNo, setPanNo] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarBase64 = "";
      if (avatar) {
        avatarBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(avatar);
        });
      }

      const payload = {
        name,
        email,
        password,
        avatar: avatarBase64,
        phoneNumber,
        address,
        zipCode,
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
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sellers/register`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data.message);
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setAvatar(null);
      setPhoneNumber("");
      setAddress("");
      setZipCode("");
      setAvatarPreview(null);
      setAge("");
      setGender("");
      setCompanyName("");
      setOfficeAddress("");
      setGodownAddress("");
      setState("");
      setTown("");
      setAadhaarNo("");
      setPanNo("");
      setGstNo("");
    } catch (err) {
      toast.error(err.response?.data.message);
      setLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, or JPEG files are allowed.");
      return;
    }

    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[45rem]">
        <div className="bg-white py-8 px-4 shadow-[0_0_20px_rgba(0,0,0,0.05)] sm:rounded-sm sm:px-10">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Seller Registration
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ===== Personal Information ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="phone-number"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter your mobile number"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="18"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base bg-white"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={visible ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                      placeholder="Enter password (min 6 chars)"
                    />
                    {visible ? (
                      <AiOutlineEye
                        className="absolute right-2 top-2.5 cursor-pointer"
                        size={22}
                        onClick={() => setVisible(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute right-2 top-2.5 cursor-pointer"
                        size={22}
                        onClick={() => setVisible(true)}
                      />
                    )}
                  </div>
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
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Residential Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter your residential address"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="zipcode"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter pin code"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter your state"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Town / City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="town"
                    required
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter your town/city"
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
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Office Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="officeAddress"
                    required
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter office address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Godown / Warehouse Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="godownAddress"
                    required
                    value={godownAddress}
                    onChange={(e) => setGodownAddress(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter godown/warehouse address"
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
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadhaarNo"
                    required
                    value={aadhaarNo}
                    onChange={(e) => setAadhaarNo(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter 12-digit Aadhaar number"
                    maxLength={12}
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="panNo"
                    required
                    value={panNo}
                    onChange={(e) => setPanNo(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter PAN number"
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    GST Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="gstNo"
                    required
                    value={gstNo}
                    onChange={(e) => setGstNo(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder="Enter GST number"
                  />
                </div>
              </div>
            </div>

            {/* ===== Avatar Upload ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Profile Image
              </h3>
              <div className="flex items-center gap-4">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-full w-full text-gray-400" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-sm shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition"
                >
                  <span>Upload Profile Image</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-sm font-semibold tracking-wide transition flex items-center justify-center text-lg ${
                  loading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-gray-800 text-white"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Register as Seller"
                )}
              </button>
            </div>

            <div className="flex gap-4 mt-4">
              <Link
                to="/seller/login"
                className="w-full py-2 bg-gray-300 text-black text-base text-center rounded-sm font-semibold hover:bg-gray-800 hover:text-white transition"
              >
                Already have a registered shop? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;
