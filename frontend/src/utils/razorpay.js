export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async ({
  amount,
  planName,
  userType,
}) => {
  const loaded = await loadRazorpay();

  if (!loaded) {
    alert("Razorpay SDK failed to load");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amount * 100,
    currency: "INR",
    name: "HireFold",
    description: `${planName} Plan (${userType})`,
    handler: function (response) {
      
      alert("Payment successful!");
    },
    theme: {
      color: "#4f46e5",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
