/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../../static/data";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../../redux/actions/product";

const SellerDashboardAddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  // New fields
  const [specifications, setSpecifications] = useState("");
  const [yearMfg, setYearMfg] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [boxImage, setBoxImage] = useState(null);
  const [boxImagePreview, setBoxImagePreview] = useState(null);
  const [packing, setPacking] = useState("");
  const [qty, setQty] = useState("");
  const [discount, setDiscount] = useState("");
  const [gstCategory, setGstCategory] = useState(18);
  const [priceIncludingGst, setPriceIncludingGst] = useState("");
  const [loading, setLoading] = useState(false);

  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);

  // Auto-calculate discountPrice when MRP or Discount % changes
  const calculateDiscountPrice = useCallback((mrp, disc) => {
    if (mrp && disc) {
      const price = Number(mrp) - (Number(mrp) * Number(disc)) / 100;
      return Math.round(price * 100) / 100;
    }
    return "";
  }, []);

  // Auto-calculate priceIncludingGst when discountPrice or GST changes
  const calculatePriceIncludingGst = useCallback((price, gst) => {
    if (price && gst) {
      const total = Number(price) + (Number(price) * Number(gst)) / 100;
      return Math.round(total * 100) / 100;
    }
    return "";
  }, []);

  const handleOriginalPriceChange = (e) => {
    const val = e.target.value;
    setOriginalPrice(val);
    if (val && discount) {
      const calcPrice = calculateDiscountPrice(val, discount);
      setDiscountPrice(calcPrice);
      if (calcPrice && gstCategory) {
        setPriceIncludingGst(calculatePriceIncludingGst(calcPrice, gstCategory));
      }
    }
  };

  const handleDiscountChange = (e) => {
    const val = e.target.value;
    setDiscount(val);
    if (originalPrice && val) {
      const calcPrice = calculateDiscountPrice(originalPrice, val);
      setDiscountPrice(calcPrice);
      if (calcPrice && gstCategory) {
        setPriceIncludingGst(calculatePriceIncludingGst(calcPrice, gstCategory));
      }
    }
  };

  const handleDiscountPriceChange = (e) => {
    const val = e.target.value;
    setDiscountPrice(val);
    if (val && gstCategory) {
      setPriceIncludingGst(calculatePriceIncludingGst(val, gstCategory));
    }
  };

  const handleGstChange = (e) => {
    const val = e.target.value;
    setGstCategory(val);
    if (discountPrice && val) {
      setPriceIncludingGst(calculatePriceIncludingGst(discountPrice, val));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product added successfully.");
      navigate("/seller/dashboard-products");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    files.forEach((file) => {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PNG, JPG, or JPEG files are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBoxImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, or JPEG files are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setBoxImage(reader.result);
        setBoxImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!seller || !seller._id) {
      toast.error("Seller not found. Please login again.");
      setLoading(false);
      return;
    }

    if (!stock || Number(stock) <= 0) {
      toast.error("Stock must be greater than 0.");
      setLoading(false);
      return;
    }
    if (!discountPrice || Number(discountPrice) < 1) {
      toast.error("Price (Each) must be at least 1.");
      setLoading(false);
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      setLoading(false);
      return;
    }

    let imagesBase64 = images;
    if (images.length && typeof images[0] !== "string") {
      imagesBase64 = await Promise.all(
        Array.from(images).map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );
    }

    const payload = {
      name,
      description,
      specifications,
      yearMfg: yearMfg || undefined,
      hsnCode,
      category,
      tags,
      originalPrice: originalPrice || undefined,
      discountPrice,
      discount: discount || undefined,
      gstCategory,
      priceIncludingGst: priceIncludingGst || undefined,
      stock,
      qty: qty || undefined,
      packing,
      sellerId: seller._id,
      images: imagesBase64,
    };

    // Add boxImage as base64 if present (will be uploaded by backend)
    if (boxImage) {
      payload.boxImage = boxImage;
    }

    try {
      await dispatch(addProduct(payload));
    } catch (err) {
      // Error handled by Redux reducer
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-[45rem]">
        <div
          className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10"
          style={{ maxHeight: "calc(140vh - 100px)", overflowY: "auto" }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ===== Basic Information ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your product name..."
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    cols="30"
                    rows="4"
                    name="description"
                    value={description}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter your product description..."
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Product Specifications
                  </label>
                  <textarea
                    cols="30"
                    rows="3"
                    name="specifications"
                    value={specifications}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={(e) => setSpecifications(e.target.value)}
                    placeholder="Enter product specifications / features..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Year of Manufacturing
                  </label>
                  <input
                    type="number"
                    name="yearMfg"
                    value={yearMfg}
                    min={1900}
                    max={new Date().getFullYear()}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={(e) => setYearMfg(e.target.value)}
                    placeholder={`e.g. ${new Date().getFullYear()}`}
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    HSN Code
                  </label>
                  <input
                    type="text"
                    name="hsnCode"
                    value={hsnCode}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={(e) => setHsnCode(e.target.value)}
                    placeholder="Enter HSN code..."
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Choose a category</option>
                    {categoriesData &&
                      categoriesData.map((i) => (
                        <option value={i.title} key={i.title}>
                          {i.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={tags}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Enter tags..."
                  />
                </div>
              </div>
            </div>

            {/* ===== Pricing & GST ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Pricing & GST
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={originalPrice}
                    min={0}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={handleOriginalPriceChange}
                    placeholder="Max Retail Price"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Discount (%) <span className="text-xs text-gray-400">(auto-calc)</span>
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={discount}
                    min={0}
                    max={100}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={handleDiscountChange}
                    placeholder="Discount %"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Price Each (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={discountPrice}
                    min={1}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={handleDiscountPriceChange}
                    placeholder="Selling price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    GST Category (%) <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base bg-white"
                    value={gstCategory}
                    onChange={handleGstChange}
                    required
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Price Including GST (₹)
                  </label>
                  <input
                    type="number"
                    name="priceIncludingGst"
                    value={priceIncludingGst}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base bg-gray-50"
                    readOnly
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
            </div>

            {/* ===== Stock & Packing ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Stock & Packing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={stock}
                    min={1}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Total stock"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Qty per Pack
                  </label>
                  <input
                    type="number"
                    name="qty"
                    value={qty}
                    min={1}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="Qty per pack"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Packing Details
                  </label>
                  <input
                    type="text"
                    name="packing"
                    value={packing}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-base"
                    onChange={(e) => setPacking(e.target.value)}
                    placeholder="e.g. Box, Packet, Carton"
                  />
                </div>
              </div>
            </div>

            {/* ===== Images ===== */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Product Images <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="upload"
                    className="hidden"
                    multiple
                    onChange={handleImageChange}
                  />
                  <div className="flex items-center flex-wrap gap-3 mt-2">
                    <label
                      htmlFor="upload"
                      className="cursor-pointer flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-orange-400 bg-orange-50 rounded-sm hover:bg-orange-100 transition"
                    >
                      <AiOutlinePlusCircle size={32} className="text-orange-500" />
                      <span className="text-xs text-gray-500 mt-1">Add Images</span>
                    </label>
                    {images &&
                      images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt=""
                            className="h-28 w-28 object-cover rounded-sm border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 text-gray-600 hover:text-orange-500 transition"
                            title="Remove"
                          >
                            <AiOutlineCloseCircle size={20} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-1">
                    Box / Packaging Image
                  </label>
                  <input
                    type="file"
                    id="boxImageUpload"
                    className="hidden"
                    onChange={handleBoxImageChange}
                  />
                  <div className="flex items-center flex-wrap gap-3 mt-2">
                    <label
                      htmlFor="boxImageUpload"
                      className="cursor-pointer flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-orange-400 bg-orange-50 rounded-sm hover:bg-orange-100 transition"
                    >
                      <AiOutlinePlusCircle size={32} className="text-orange-500" />
                      <span className="text-xs text-gray-500 mt-1">Box Image</span>
                    </label>
                    {boxImagePreview && (
                      <div className="relative group">
                        <img
                          src={boxImagePreview}
                          alt="Box"
                          className="h-28 w-28 object-cover rounded-sm border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setBoxImage(null);
                            setBoxImagePreview(null);
                          }}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 text-gray-600 hover:text-orange-500 transition"
                          title="Remove"
                        >
                          <AiOutlineCloseCircle size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
                  Adding Product...
                </span>
              ) : (
                "Add Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardAddProduct;
