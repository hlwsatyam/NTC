import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign, FaTruck } from "react-icons/fa";
import axios from "axios";

const UserPayment = () => {
  const navigate = useNavigate();
  const [select, setSelect] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const storedOrder = localStorage.getItem("latestOrder");
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    }
  }, []);

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const finishOrder = async (paymentInfo) => {
    order.paymentInfo = paymentInfo;

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/orders/create`,
        order,
        config
      );
      navigate("/order/success");
      toast.success("Order successful.");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      window.location.reload();
    } catch (error) {
      console.error("Order creation error:", error);
      setLoading(false);
      toast.error(
        error?.response?.data?.message || "Failed to place the order."
      );
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const razorpayPaymentHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create a Razorpay order on the backend
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/payments/razorpay/order`,
        { amount: Number(   orderData?.totalPrice) },
        config
      );

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setLoading(false);
        return toast.error("Razorpay SDK failed to load. Are you online?");
      }

      // 2. Open the Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.order.amount, // in paise
        currency: data.order.currency,
        name: "NTC Ecommerce",
        description: "Order Payment",
        order_id: data.order.id,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phoneNumber,
        },
        theme: {
          color: "#f97316",
        },
        handler: async (response) => {
          // 3. Verify the payment signature on the backend
          const verifyRes = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/payments/razorpay/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            config
          );

          if (verifyRes.data.success) {
            const paymentInfo = {
              id: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              status: "succeeded",
              type: "Razorpay",
            };
            await finishOrder(paymentInfo);
          } else {
            toast.error("Payment verification failed.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
      toast.error(error?.response?.data?.message || "Payment failed.");
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await finishOrder({
      status: "pending",
      type: "Cash On Delivery",
    });
  };

  return (
    <div className="w-full flex flex-col items-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.05)] p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Select Payment Method
            </h2>
            <div className="space-y-4">
              <div
                className={`flex items-center gap-3 p-4 rounded-sm border transition cursor-pointer ${
                  select === 1
                    ? "border-gray-500 bg-gray-50 shadow-[0_0_20px_rgba(0,0,0,0.05)]"
                    : "border-gray-200 bg-white hover:border-gray-800"
                }`}
                onClick={() => setSelect(1)}
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                    select === 1 ? "border-gray-800" : "border-gray-300"
                  }`}
                >
                  {select === 1 && (
                    <span className="w-3 h-3 bg-gray-800 rounded-full block" />
                  )}
                </span>
                <span className="font-semibold text-gray-800">
                  Pay Online (Razorpay)
                </span>
                <span className="ml-auto text-xs text-gray-400">
                  UPI · Cards · Net Banking · Wallets
                </span>
              </div>
              <div
                className={`flex items-center gap-3 p-4 rounded-sm border transition cursor-pointer ${
                  select === 2
                    ? "border-gray-500 bg-gray-50 shadow-[0_0_20px_rgba(0,0,0,0.05)]"
                    : "border-gray-200 bg-white hover:border-gray-800"
                }`}
                onClick={() => setSelect(2)}
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                    select === 2 ? "border-gray-800" : "border-gray-300"
                  }`}
                >
                  {select === 2 && (
                    <span className="w-3 h-3 bg-gray-800 rounded-full block" />
                  )}
                </span>
                <span className="font-semibold text-gray-800">
                  Cash on Delivery
                </span>
                <span className="ml-auto text-xs text-gray-400">
                  Pay when you receive
                </span>
              </div>
            </div>

            <div className="mt-8">
              {select === 1 && (
                <form className="space-y-5" onSubmit={razorpayPaymentHandler}>
                  <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-sm">
                    <FaRupeeSign size={20} className="text-orange-500 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      You will be redirected to Razorpay's secure checkout to
                      pay via UPI, debit/credit card, net banking or wallets.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-orange-500 hover:bg-gray-800 disabled:opacity-60 text-white rounded-sm font-semibold text-lg transition"
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </button>
                </form>
              )}
              {select === 2 && (
                <form className="w-full mt-2" onSubmit={cashOnDeliveryHandler}>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-sm">
                    <FaTruck size={20} className="text-gray-600 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Pay the total amount in cash when your order is delivered
                      to your doorstep.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-5 py-3 bg-orange-500 hover:bg-gray-800 disabled:opacity-60 text-white rounded-sm font-semibold text-lg transition"
                  >
                    {loading ? "Placing Order..." : "Confirm Order"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-[400px]">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  return (
    <div className="bg-white rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.05)] pb-2 pt-8 pl-8 pr-8">
      <div className="flex justify-between mb-3">
        <span className="text-base font-medium text-gray-700">Subtotal:</span>
        <span className="text-lg font-bold text-gray-800">
          ₹{orderData?.subTotalPrice}
        </span>
      </div>
      <div className="flex justify-between mb-3">
        <span className="text-base font-medium text-gray-700">Shipping:</span>
        <span className="text-lg font-bold text-gray-800">₹{shipping}</span>
      </div>
      <div className="flex justify-between border-b pb-3 mb-3">
        <span className="text-base font-medium text-gray-700">Discount:</span>
        <span className="text-lg font-bold text-green-600">
          {orderData?.discountPrice ? "₹" + orderData.discountPrice : "₹0"}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-800">Total:</span>
        <span className="text-2xl font-bold text-orange-500">
          ₹{orderData?.totalPrice}
        </span>
      </div>
      <br />
    </div>
  );
};

export default UserPayment;
